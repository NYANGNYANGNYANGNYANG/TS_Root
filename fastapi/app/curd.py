# app/curd.py

##########################################################################################
#                                    CURD Definition 
#
# crud 함수들은 세션을 받아서 모델만 수정/추가, 커밋 X
# → 라우터에서 db.commit(); db.refresh(obj)
##########################################################################################

from sqlalchemy.orm import Session
from . import models
from .schemas import TicketCreate, TicketUpdateStatus
from datetime import datetime


####################################### [ 조회 ] #########################################
##########################################################################################


def list_tickets(db: Session):
    return db.query(models.Ticket).order_by(models.Ticket.id.desc()).all()

# 단건 조회 (기본키)
def get_ticket(db: Session, ticket_id: int):
    return db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()


####################################### [ 생성 ] #########################################
# Pydantic TicketCreate를 받아서 DB 모델(models.Ticket) 인스턴스 생성
# db.add(t): 세션에 등록 (INSERT 예약)
# db.flush(): 아직 commit은 아니지만, SQL을 DB에 보내 AUTO INCREMENT id를 미리 확보
# 세션에 붙은 Ticket 객체(아직 미커밋)
##########################################################################################

def create_ticket(db: Session, data: TicketCreate):
    t = models.Ticket(
        requester=data.requester,
        department=data.department,
        category=data.category,
        content=data.content,
        priority=data.priority,
        worker=data.worker or "",
        status=data.status
    )
    db.add(t)
    db.flush()  # t.id 확보
    return t


####################################### [ 저장 ] #########################################
# 첨부 메타 저장: 파일은 디스크에 저장하고 DB에는 메타(이름/경로/URL)만 저장
# 트랜잭션은 호출부(라우터)에서 commit
##########################################################################################
def save_attachment(db: Session, ticket_id: int, filename: str, path: str, url: str):
    a = models.Attachment(ticket_id=ticket_id, filename=filename, path=path, url=url)
    db.add(a)
    return a

####################################### [ 수정 ] #########################################
# ACTIVE로 바뀌고 기존 접수일이 없을 때만 acp_date 채움(중복 갱신 방지)
# DONE이면 완료일 fin_date 찍음 (매번 업데이트)
##########################################################################################

def update_status(db: Session, ticket_id: int, payload: TicketUpdateStatus):
    t = get_ticket(db, ticket_id)
    if not t:
        return None
    t.status = payload.status
    if payload.status == models.TicketStatus.ACTIVE and not t.acp_date:
        t.acp_date = datetime.utcnow()
    if payload.status == models.TicketStatus.DONE:
        t.fin_date = datetime.utcnow()
    return t
