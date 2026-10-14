from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base,engine
from . import models
from .routers.documents import router
from .auth.router import router as auth_router
from sqlalchemy import inspect, text
@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    if engine.url.get_backend_name() == 'sqlite':
        columns = {column['name'] for column in inspect(engine).get_columns('documents')}
        if 'user_id' not in columns:
            with engine.begin() as connection:
                connection.execute(text('ALTER TABLE documents ADD COLUMN user_id VARCHAR(36)'))
        if 'folder_id' not in columns:
            with engine.begin() as connection:
                connection.execute(text('ALTER TABLE documents ADD COLUMN folder_id VARCHAR(36)'))
    yield
app=FastAPI(title=settings.app_name,description='Upload, search, download and manage PDF documents.',version='1.0.0',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=settings.allowed_origins,allow_credentials=True,allow_methods=['GET','POST','DELETE','OPTIONS'],allow_headers=['*'])
@app.get('/')
def root(): return {'message':'PDF Vault API is running','docs':'/docs'}
@app.get(f'{settings.api_prefix}/health')
def health(): return {'status':'ok','service':settings.app_name}
app.include_router(router,prefix=settings.api_prefix)
app.include_router(auth_router,prefix=settings.api_prefix)
