from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..auth.security import get_current_user
from ..config import settings
from ..database import get_db
from ..models import ImageAsset, ImageCategory, User

router = APIRouter(prefix='/images', tags=['Images'])
IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'}
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'}

class CategoryRequest(BaseModel):
    name: str = Field(min_length=1, max_length=120)

def image_dir():
    path = Path(settings.storage_dir)
    if not path.is_absolute():
        path = Path(__file__).resolve().parents[2] / path
    path = path / 'images'
    path.mkdir(parents=True, exist_ok=True)
    return path

def category_or_404(category_id: str, db: Session, user: User):
    category = db.query(ImageCategory).filter(
        ImageCategory.id == category_id,
        ImageCategory.user_id == user.id,
    ).first()
    if not category:
        raise HTTPException(404, 'Image category not found.')
    return category

@router.get('/categories')
def list_categories(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [
        {'id': category.id, 'name': category.name}
        for category in db.query(ImageCategory).filter(
            ImageCategory.user_id == user.id
        ).order_by(ImageCategory.name.asc()).all()
    ]

@router.post('/categories', status_code=201)
def create_category(payload: CategoryRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    name = payload.name.strip()
    if not name:
        raise HTTPException(422, 'Category name cannot be empty.')
    if db.query(ImageCategory).filter(
        ImageCategory.user_id == user.id, ImageCategory.name == name
    ).first():
        raise HTTPException(409, 'An image category with this name already exists.')
    category = ImageCategory(
        id=str(uuid4()), name=name, user_id=user.id,
        created_at=datetime.now(timezone.utc),
    )
    db.add(category)
    db.commit()
    return {'id': category.id, 'name': category.name}

@router.delete('/categories/{category_id}', status_code=204)
def delete_category(category_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category = category_or_404(category_id, db, user)
    images = db.query(ImageAsset).filter(
        ImageAsset.category_id == category.id, ImageAsset.user_id == user.id
    ).all()
    for image in images:
        (image_dir() / image.stored_filename).unlink(missing_ok=True)
        db.delete(image)
    db.delete(category)
    db.commit()

@router.get('')
def list_images(category_id: str, search: str = '', db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    category_or_404(category_id, db, user)
    query = db.query(ImageAsset).filter(
        ImageAsset.user_id == user.id,
        ImageAsset.category_id == category_id,
    )
    if search.strip():
        query = query.filter(ImageAsset.filename.ilike(f'%{search.strip()}%'))
    return [
        {
            'id': image.id, 'filename': image.filename,
            'content_type': image.content_type, 'size_bytes': image.size_bytes,
            'created_at': image.created_at,
        }
        for image in query.order_by(ImageAsset.created_at.desc()).all()
    ]

@router.post('', status_code=201)
async def create_image(
    category_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category_or_404(category_id, db, user)
    extension = Path(file.filename or '').suffix.lower()
    if file.content_type not in IMAGE_TYPES or extension not in IMAGE_EXTENSIONS:
        raise HTTPException(415, 'Only JPG, PNG, GIF, WEBP, or BMP images are allowed.')
    target_name = f'{uuid4().hex}{extension}'
    target = image_dir() / target_name
    size = 0
    limit = settings.max_upload_mb * 1024 * 1024
    try:
        with target.open('wb') as output:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > limit:
                    raise HTTPException(413, f'Maximum upload size is {settings.max_upload_mb} MB.')
                output.write(chunk)
        image = ImageAsset(
            id=str(uuid4()), filename=Path(file.filename).name,
            stored_filename=target_name, content_type=file.content_type,
            size_bytes=size, category_id=category_id, user_id=user.id,
            created_at=datetime.now(timezone.utc),
        )
        db.add(image)
        db.commit()
        return {'id': image.id, 'filename': image.filename}
    except Exception:
        target.unlink(missing_ok=True)
        db.rollback()
        raise
    finally:
        await file.close()

@router.get('/{image_id}/file')
def image_file(image_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    image = db.query(ImageAsset).filter(
        ImageAsset.id == image_id, ImageAsset.user_id == user.id
    ).first()
    if not image:
        raise HTTPException(404, 'Image not found.')
    path = image_dir() / image.stored_filename
    if not path.is_file():
        raise HTTPException(404, 'Stored image not found.')
    return FileResponse(path, media_type=image.content_type, filename=image.filename)

@router.delete('/{image_id}', status_code=204)
def delete_image(image_id: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    image = db.query(ImageAsset).filter(
        ImageAsset.id == image_id, ImageAsset.user_id == user.id
    ).first()
    if not image:
        raise HTTPException(404, 'Image not found.')
    (image_dir() / image.stored_filename).unlink(missing_ok=True)
    db.delete(image)
    db.commit()
