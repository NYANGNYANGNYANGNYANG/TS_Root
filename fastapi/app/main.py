# app/main.py

##########################################################################################
#                                   API Main
#
##########################################################################################

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Literal
import os
from datetime import datetime


# ------------------ 타입(enum과 동일하게) ----------------- #

TicketStatus = Literal["TODO", "ACTIVE", "DONE"]
TicketPriority = Literal["LOW", "MORMAL", "CRITICAL"]
Category = Literal["Server", "Network", "OA", "Security", "ETC"]


########################### Schema ###########################

# ---------------------[ Attachment ]----------------------- #
#
# 첨부파일 메타데이터 구조 정의 (모든 티켓을 JSON 리스트로 반환)
# ---------------------------------------------------------- #

class Attachment(BaseModel):
	id: Optional[int] = None
	filename: Optional[str] = None
	url: Optional[str] = None
	path: Optional[str] = None

# ----------------------[ Comment ]------------------------ #
#
# 첨부파일 메타데이터 구조 정의
# --------------------------------------------------------- #

class Comment(BaseModel):
	id: Optional[int] = None
	author: Optional[str] = None
	content: str
	created_at: Optional[str] = None

# ---------------------[ BaseTicket ]---------------------- #
#
# 티켓 전체 구조 정의 (조회/응답 시 반환되는 전체 JSON 구조)
# --------------------------------------------------------- #

class BaseTicket(BaseModel):
	id: int
	req_date: str
	acp_date: Optional[str] = None
	fin_date: Optional[str] = None
	status: TicketStatus
	content: str
	priority: TicketPriority
	requester: str
	department: str
	worker: str
	category: Category
	attachments: Optional[List[Attachment]] = None
	comments: Optional[List[Comment]] = None
	created_at: Optional[str] = None
	updated_at: Optional[str] = None
	requester_id: Optional[str] = None
	ip_address: Optional[str] = None
	log_trace_id: Optional[str] = None
	result: Optional[str] = None

# --------------------[ NewTicketIn ]---------------------- #
# 
# 티켓 생성 요청(Request Body) 시 사용되는 입력 스키마
# --------------------------------------------------------- #

# NewTicket = Omit<BaseTicket, 'req_date'|'status'|'acp_date'|'fin_date'> + {attachment: File[], category}
class NewTicketIn(BaseModel):
	requester: str
	department: str
	category: Category
	content: str
	priority: TicketPriority
	worker: Optional[str] = ""

##############################################################


# 앱/업로드 디렉토리
app = FastAPI(title="TS API", version="1.0.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],		# 내부망/Nginx 뒤라 크게 문제 없음. 필요시 도메인 제한
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

UPLOAD_DIR = "/data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 메모리 저장소 (DB 붙기 전 최소 연동)
_TICKETS: List[BaseTicket] = []
_SEQ = 1

def _next_id() -> int:
	global _SEQ
	_SEQ += 1
	return _SEQ


# [ADD] 헬스 엔드포인트
@app.get("/health")
def health():
	return {"ok": True}


########################## EndPoint ##########################
# ------------------[ Get Ticket List ]--------------------- #
#
# 티켓 조회
# 모든 티켓을 JSON 리스트로 반환
# ---------------------------------------------------------- #
@app.get("/tickets", response_model=List[BaseTicket])
def list_tickets():
	return _TICKETS

# -------------------[ Get Ticket by ID ]------------------- #
#
# 단일 티켓 조희 (ID로 티켓 검색)
# ---------------------------------------------------------- #
@app.get("/tickets/{ticket_id}", response_model=BaseTicket)
def get_ticket(ticket_id: int):
	for t in _TICKETS:
		if t.id == ticket_id:
			return t
	raise HTTPException(status_code=404, detail="not found")

# -----------------[ Update Ticket Status ]----------------- #
#
# 상태 변경 API
# "ACTIVE" → 접수일(acp_date) 기록
# "DONE" → 완료일(fin_date) 기록
# updated_at 갱신
# ---------------------------------------------------------- #
@app.patch("/tickets/{ticket_id}/status", response_model=BaseTicket)
def update_status(ticket_id: int, status: TicketStatus):
	for idx, t in enumerate(_TICKETS):
		if t.id == ticket_id:
			_TICKETS[idx].status = status
			if status == "ACTIVE" and not _TICKETS[idx].acp_date:
				_TICKETS[idx].acp_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			if status == "DONE":
				_TICKETS[idx].fin_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
			_TICKETS[idx].updated_at = datetime.now().isoformat(timespec="seconds")
			return _TICKETS[idx]
	raise HTTPException(status_code=404, detail="not found")

# -----------------[ Create Ticket ]----------------------- #
#
# 티켓 생성
# 
# --------------------------------------------------------- #
@app.post("/tickets", response_model=BaseTicket)
async def create_ticket(
	# NewTicket 필드
	requester: str = Form(...),
	department: str = Form(...),
	category: Category = Form(...),
	content: str = Form(...),
	priority: TicketPriority = Form(...),
	worker: str = Form(""),
	# 선택한 상태 추가
	status: TicketStatus = Form(...),	# 생성 시 상태 선택 반영
	# 첨부
	attachments: List[UploadFile] = File(default=[]),
):
	# 메모리 시퀀스에서 신규 티켓 ID 발급
	new_id = _next_id()
	saved_att: List[Attachment] = []

	# 첨부파일이 있을 경우 서버 로컬에 저장
	for f in attachments:
		dst = os.path.join(UPLOAD_DIR, f.filename)
		with open(dst, "wb") as fh:
			fh.write(await f.read())
		# 프론트가 접근할 공개 URL
		web_path = f"/files/{f.filename}"

		# saved_att에 Pydantic Attachment 객체 추가
		# Attachment 스키마 객체로 만들어 첨부파일 메타데이터를 임시 저장
		saved_att.append(Attachment(filename=f.filename, path=dst, url=web_path))

	now = datetime.now()
	ticket = BaseTicket(
		id=new_id,
		req_date=now.strftime("%Y-%m-%d %H:%M:%S"),
		status=status,
		content=content,
		priority=priority,
		requester=requester,
		department=department,
		worker=worker or "",
		category=category,
		attachments=saved_att,
		comments=[],
		created_at=now.isoformat(timespec="seconds"),
		updated_at=now.isoformat(timespec="seconds"),
	)

	_TICKETS.append(ticket)
	return ticket

