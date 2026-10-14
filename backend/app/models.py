from datetime import datetime,timezone
from sqlalchemy import DateTime,Integer,String
from sqlalchemy.orm import Mapped,mapped_column
from .database import Base
class Document(Base):
    __tablename__='documents'
    id:Mapped[str]=mapped_column(String(36),primary_key=True)
    filename:Mapped[str]=mapped_column(String(255),nullable=False,index=True)
    stored_filename:Mapped[str]=mapped_column(String(255),nullable=False,unique=True)
    size_bytes:Mapped[int]=mapped_column(Integer,nullable=False)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)
