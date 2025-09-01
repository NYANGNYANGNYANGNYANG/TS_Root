# app/models.py
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, DateTime, Text
from datetime import datetime

class Base(DeclarativeBase): pass

class Ticket(Base):
    __tablename__ = "tickets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    req_date: Mapped[datetime]
    acp_date: Mapped[datetime | None]
    fin_date: Mapped[datetime | None]
    status: Mapped[str] = mapped_column(String(10))        # TODO/ACTIVE/DONE
    priority: Mapped[str] = mapped_column(String(10))      # 낮음/보통/긴급
    category: Mapped[str | None] = mapped_column(String(50))
    content: Mapped[str] = mapped_column(Text)
    requester: Mapped[str] = mapped_column(String(100))
    department: Mapped[str] = mapped_column(String(100))
    worker: Mapped[str | None] = mapped_column(String(100))
    result: Mapped[str | None] = mapped_column(Text)
    # 필요 시 created_at/updated_at 컬럼 추가

