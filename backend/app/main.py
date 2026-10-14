from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base,engine
from . import models
from .routers.documents import router
@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    yield
app=FastAPI(title=settings.app_name,description='Upload, search, download and manage PDF documents.',version='1.0.0',lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=settings.allowed_origins,allow_credentials=True,allow_methods=['GET','POST','DELETE','OPTIONS'],allow_headers=['*'])
@app.get('/')
def root(): return {'message':'PDF Vault API is running','docs':'/docs'}
@app.get(f'{settings.api_prefix}/health')
def health(): return {'status':'ok','service':settings.app_name}
app.include_router(router,prefix=settings.api_prefix)
