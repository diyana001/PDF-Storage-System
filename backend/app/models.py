from datetime import datetime,timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped,mapped_column
from .database import Base
class Document(Base):
    __tablename__='documents'
    id:Mapped[str]=mapped_column(String(36),primary_key=True)
    filename:Mapped[str]=mapped_column(String(255),nullable=False,index=True)
    stored_filename:Mapped[str]=mapped_column(String(255),nullable=False,unique=True)
    size_bytes:Mapped[int]=mapped_column(Integer,nullable=False)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)
    user_id:Mapped[str|None]=mapped_column(ForeignKey('users.id'),nullable=True,index=True)
    folder_id:Mapped[str|None]=mapped_column(ForeignKey('folders.id'),nullable=True,index=True)

class Folder(Base):
    __tablename__='folders'
    id:Mapped[str]=mapped_column(String(36),primary_key=True)
    name:Mapped[str]=mapped_column(String(120),nullable=False)
    user_id:Mapped[str]=mapped_column(ForeignKey('users.id'),nullable=False,index=True)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)

class User(Base):
    __tablename__='users'
    id:Mapped[str]=mapped_column(String(36),primary_key=True)
    username:Mapped[str]=mapped_column(String(80),nullable=False,unique=True,index=True)
    email:Mapped[str]=mapped_column(String(255),nullable=False,unique=True,index=True)
    password_hash:Mapped[str]=mapped_column(String(255),nullable=False)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc),nullable=False)
