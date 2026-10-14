from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from .security import create_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix='/auth', tags=['Authentication'])


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=80)
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=128)


def user_response(user: User, token: str) -> dict:
    return {
        'access_token': token,
        'token_type': 'bearer',
        'user': {'id': user.id, 'username': user.username, 'email': user.email},
    }


@router.post('/register', status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    username = payload.username.strip()
    email = payload.email.strip().lower()
    if not username:
        raise HTTPException(422, 'Username cannot be empty.')
    if db.query(User).filter((User.username == username) | (User.email == email)).first():
        raise HTTPException(409, 'Username or email is already registered.')
    user = User(
        id=str(uuid4()),
        username=username,
        email=email,
        password_hash=hash_password(payload.password),
        created_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user_response(user, create_token(user))


@router.post('/login')
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form.username.strip().lower()).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(401, 'Invalid email or password.')
    return user_response(user, create_token(user))


@router.get('/me')
def me(user: User = Depends(get_current_user)):
    return {'id': user.id, 'username': user.username, 'email': user.email}
