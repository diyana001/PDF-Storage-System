from datetime import datetime,timezone
from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter,Depends,File,HTTPException,UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Document
from ..models import User
from ..auth.security import get_current_user
from ..config import settings
router=APIRouter(prefix='/documents',tags=['Documents'])
def pdf_dir():
    p=Path(settings.storage_dir)
    if not p.is_absolute(): p=Path(__file__).resolve().parents[2]/p
    p.mkdir(parents=True,exist_ok=True);return p
@router.get('')
def list_documents(search:str='',db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    q=db.query(Document).filter(Document.user_id == user.id)
    if search.strip(): q=q.filter(Document.filename.ilike(f'%{search.strip()}%'))
    return [{'id':d.id,'filename':d.filename,'size_bytes':d.size_bytes,'created_at':d.created_at} for d in q.order_by(Document.created_at.desc()).all()]
@router.post('',status_code=201)
async def create_document(file:UploadFile=File(...),db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    if not file.filename or not Path(file.filename).name.lower().endswith('.pdf'): raise HTTPException(415,'Only PDF files are allowed.')
    target_name=f'{uuid4().hex}.pdf';target=pdf_dir()/target_name;size=0;header=b'';limit=settings.max_upload_mb*1024*1024
    try:
        with target.open('wb') as out:
            while chunk:=await file.read(1024*1024):
                size+=len(chunk)
                if size>limit: raise HTTPException(413,f'Maximum upload size is {settings.max_upload_mb} MB.')
                if len(header)<5: header+=chunk[:5-len(header)]
                out.write(chunk)
        if header!=b'%PDF-': raise HTTPException(415,'File does not have a valid PDF header.')
        d=Document(id=str(uuid4()),filename=Path(file.filename).name,stored_filename=target_name,size_bytes=size,created_at=datetime.now(timezone.utc),user_id=user.id)
        db.add(d);db.commit();db.refresh(d)
        return {'id':d.id,'filename':d.filename,'size_bytes':d.size_bytes,'created_at':d.created_at}
    except Exception:
        target.unlink(missing_ok=True);db.rollback();raise
    finally: await file.close()
@router.get('/{document_id}/download')
def download_document(document_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    d=db.query(Document).filter(Document.id == document_id, Document.user_id == user.id).first()
    if not d: raise HTTPException(404,'Document not found.')
    p=pdf_dir()/d.stored_filename
    if not p.is_file(): raise HTTPException(404,'Stored PDF not found.')
    return FileResponse(p,media_type='application/pdf',filename=d.filename)
@router.delete('/{document_id}',status_code=204)
def remove_document(document_id:str,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    d=db.query(Document).filter(Document.id == document_id, Document.user_id == user.id).first()
    if not d: raise HTTPException(404,'Document not found.')
    (pdf_dir()/d.stored_filename).unlink(missing_ok=True);db.delete(d);db.commit()
