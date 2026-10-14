import base64
import hashlib
import hmac
import json
import secrets
import time

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f'{settings.api_prefix}/auth/login')


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(
        password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=64
    )
    return f'scrypt${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(digest).decode()}'


def verify_password(password: str, stored: str) -> bool:
    try:
        algorithm, encoded_salt, encoded_digest = stored.split('$')
        if algorithm != 'scrypt':
            return False
        salt = base64.urlsafe_b64decode(encoded_salt.encode())
        expected = base64.urlsafe_b64decode(encoded_digest.encode())
        actual = hashlib.scrypt(
            password.encode(), salt=salt, n=2**14, r=8, p=1, dklen=len(expected)
        )
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def _encode(value: dict) -> str:
    raw = json.dumps(value, separators=(',', ':'), sort_keys=True).encode()
    return base64.urlsafe_b64encode(raw).decode().rstrip('=')


def _decode(value: str) -> dict:
    padding = '=' * (-len(value) % 4)
    return json.loads(base64.urlsafe_b64decode((value + padding).encode()))


def create_token(user: User) -> str:
    header = _encode({'alg': 'HS256', 'typ': 'JWT'})
    payload = _encode({
        'sub': user.id,
        'exp': int(time.time()) + settings.auth_token_minutes * 60,
    })
    unsigned = f'{header}.{payload}'
    signature = hmac.new(
        settings.auth_secret.encode(), unsigned.encode(), hashlib.sha256
    ).digest()
    return f'{unsigned}.{base64.urlsafe_b64encode(signature).decode().rstrip("=")}'


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        header, payload, encoded_signature = token.split('.')
        unsigned = f'{header}.{payload}'
        expected = hmac.new(
            settings.auth_secret.encode(), unsigned.encode(), hashlib.sha256
        ).digest()
        provided = base64.urlsafe_b64decode(
            (encoded_signature + '=' * (-len(encoded_signature) % 4)).encode()
        )
        claims = _decode(payload)
        if not hmac.compare_digest(expected, provided) or claims['exp'] < time.time():
            raise ValueError
        user = db.get(User, claims['sub'])
        if not user:
            raise ValueError
        return user
    except (KeyError, ValueError, TypeError, json.JSONDecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired authentication token.',
            headers={'WWW-Authenticate': 'Bearer'},
        )
