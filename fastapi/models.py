# app/models.py

##########################################################################################
#                                   SQLAlchemy ORM                                       #
# DB_TABLE MAPPING                                                                      #
##########################################################################################     

from sqlalchemy import String, Text, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .database import Base
import enum

class TicketStatus(str, enum.Enum):
    TODO = "TODO"
    ACTIVE = "ACTIVE"
    DONE = "DONE"

class TicketPriority(str, enum.Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    CRITICAL = "CRITICAL"

class Category(str, enum.Enum):
    Server = "Server"
    Network = "Network"
    OA = "OA"
    Security = "Security"
    ETC = "ETC"


# ----------------------------------[ Ticket Table ]------------------------------------ # 
class Ticket(Base):
    __tablename__ = "tickets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    req_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    acp_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    fin_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    status: Mapped[TicketStatus] = mapped_column(Enum(TicketStatus), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[TicketPriority] = mapped_column(Enum(TicketPriority), nullable=False)
    requester: Mapped[str] = mapped_column(String(100), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    worker: Mapped[str] = mapped_column(String(100), nullable=True)
    category: Mapped[Category] = mapped_column(Enum(Category), nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    requester_id: Mapped[str | None] = mapped_column(String(100))
    ip_address: Mapped[str | None] = mapped_column(String(64))
    log_trace_id: Mapped[str | None] = mapped_column(String(128))
    result: Mapped[str | None] = mapped_column(Text)

    attachments: Mapped[list["Attachment"]] = relationship(back_populates="ticket", cascade="all, delete-orphan")
    comments: Mapped[list["Comment"]] = relationship(back_populates="ticket", cascade="all, delete-orphan")


# ----------------------------------[ Attachment Table ]------------------------------------ # 
class Attachment(Base):
    __tablename__ = "attachments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), index=True, nullable=False)
    filename: Mapped[str | None] = mapped_column(String(255))
    url: Mapped[str | None] = mapped_column(String(500))
    path: Mapped[str | None] = mapped_column(String(500))
    ticket: Mapped["Ticket"] = relationship(back_populates="attachments")


# ----------------------------------[ Comment Table ]------------------------------------ # 
class Comment(Base):
    __tablename__ = "comments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), index=True, nullable=False)
    author: Mapped[str | None] = mapped_column(String(100))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    ticket: Mapped["Ticket"] = relationship(back_populates="comments")
