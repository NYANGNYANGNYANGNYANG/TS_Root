import os
import uuid
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Literal

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ------------------ 앱/업로드 디렉토리 ------------------ #
app = FastAPI(title="TS API", version="1.0.0")

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/data/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# ------------------ Enum (리터럴) ------------------ #
TicketStatus	= Literal["OPEN", "IN_PROGRESS", "DONE"]
TicketPriority	= Literal["LOW", "MEDIUM", "HIGH"]
Category		= Literal["SERVER", "SECURITY", "NETWORK", "OA", "ETC"]

# ------------------ 스키마 ------------------ #
class Attachment(BaseModel):
	id: Optional[int] = None
	filename: Optional[str] = None
	url: Optional[str] = None
	path: Optional[str] = None

class Comment(BaseModel):
	id: Optional[int] = None
	author: Optional[str] = None
	content: str
	created_at: Optional[str] = None

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

# ------------------ 인메모리 저장소 ------------------ #
_TICKETS: List[BaseTicket] = []
_SEQ = 0
def _next_id() -> int:
	global _SEQ
	_SEQ += 1
	return _SEQ

# ------------------ 헬스체크 ------------------ #
@app.get("/health")
def health():
	return {"ok": True}

# ------------------ 티켓 API (Nginx와 일치: /api) ------------------ #
@app.get("/api/tickets", response_model=List[BaseTicket])
def list_tickets():
	return _TICKETS

@app.get("/api/tickets/{ticket_id}", response_model=BaseTicket)
def get_ticket(ticket_id: int):
	for t in _TICKETS:
		if t.id == ticket_id:
			return t
	raise HTTPException(status_code=404, detail="not found")

@app.patch("/api/tickets/{ticket_id}/status", response_model=BaseTicket)
def update_status(ticket_id: int, status: TicketStatus = Form(...)):
	for idx, t in enumerate(_TICKETS):
		if t.id == ticket_id:
			now = datetime.now(timezone.utc)
			_TICKETS[idx].status = status
			if status == "IN_PROGRESS" and not _TICKETS[idx].acp_date:
				_TICKETS[idx].acp_date = now.strftime("%Y-%m-%d %H:%M:%S")
			if status == "DONE":
				_TICKETS[idx].fin_date = now.strftime("%Y-%m-%d %H:%M:%S")
			_TICKETS[idx].updated_at = now.isoformat(timespec="seconds")
			return _TICKETS[idx]
	raise HTTPException(status_code=404, detail="not found")

@app.post("/api/tickets", response_model=BaseTicket)
async def create_ticket(
	requester: str = Form(...),
	department: str = Form(...),
	category: Category = Form(...),
	content: str = Form(...),
	priority: TicketPriority = Form(...),
	status: TicketStatus = Form(...),
	worker: str = Form(""),
	attachments: List[UploadFile] = File(default=[]),
):
	# 필수 검증
	if not requester or not department or not content:
		raise HTTPException(status_code=422, detail="requester/department/content required")

	now = datetime.now(timezone.utc)
	acp_date = now if status in ("IN_PROGRESS", "DONE") else None
	fin_date = now if status == "DONE" else None

	# 첨부 저장
	saved_att: List[Attachment] = []
	for f in attachments:
	if not f or not f.filename:
		continue
	ext = os.path.splitext(f.filename)[1]
	unique = f"{uuid.uuid4().hex}{ext}"
	dst = os.path.join(UPLOAD_DIR, unique)
	with open(dst, "wb") as w:
		w.write(await f.read())
	web_path = f"/files/{unique}"
	saved_att.append(Attachment(filename=f.filename, path=dst, url=web_path))

	t = BaseTicket(
		id=_next_id(),
		req_date=now.strftime("%Y-%m-%d %H:%M:%S"),
		acp_date=acp_date.strftime("%Y-%m-%d %H:%M:%S") if acp_date else None,
		fin_date=fin_date.strftime("%Y-%m-%d %H:%M:%S") if fin_date else None,
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
	_TICKETS.append(t)
	return t

