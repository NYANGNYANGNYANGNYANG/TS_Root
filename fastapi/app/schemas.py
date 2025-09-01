# app/schemas.py

##########################################################################################
#                                    Pydantic Schema                                     #
# Data validation                                                                        #
# Data Serialization / Deserialization                                                   #  
# ...                                                                                    #
##########################################################################################                   

from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime

TicketStatus = Literal["TODO", "ACTIVE", "DONE"]
TicketPriority = Literal["LOW", "NORMAL", "CRITICAL"]
Category = Literal["Server", "Network", "OA", "Security", "ETC"]

class Attachment(BaseModel):
    id: Optional[int] = None
    filename: Optional[str] = None
    url: Optional[str] = None
    path: Optional[str] = None

class Comment(BaseModel):
    id: Optional[int] = None
    author: Optional[str] = None
    content: str
    created_at: Optional[datetime] = None

class TicketBase(BaseModel):
    id: int
    req_date: datetime
    acp_date: Optional[datetime] = None
    fin_date: Optional[datetime] = None
    status: TicketStatus
    content: str
    priority: TicketPriority
    requester: str
    department: str
    worker: Optional[str] = None
    category: Category
    attachments: Optional[List[Attachment]] = None
    comments: Optional[List[Comment]] = None
    created_at: datetime
    updated_at: datetime
    requester_id: Optional[str] = None
    ip_address: Optional[str] = None
    log_trace_id: Optional[str] = None
    result: Optional[str] = None

class TicketCreate(BaseModel):
    requester: str
    department: str
    category: Category
    content: str
    priority: TicketPriority
    worker: Optional[str] = ""
    status: TicketStatus

class TicketUpdateStatus(BaseModel):
    status: TicketStatus
