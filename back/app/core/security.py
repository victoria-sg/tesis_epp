import hashlib
import re
import secrets
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── Política de contraseñas seguras ───────────────────────────────────────
# Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número
# y un carácter especial.
_PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$"
)

MENSAJE_PASSWORD_DEBIL = (
    "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, "
    "una letra minúscula, un número y un carácter especial."
)


def es_password_segura(password: str) -> bool:
    return bool(_PASSWORD_REGEX.match(password))


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── Tokens de recuperación de contraseña ──────────────────────────────────
# El token "plano" es el que se envía por correo y el usuario ve en el
# enlace. En la base de datos solo se guarda su hash (sha256), igual que
# nunca se guarda la contraseña en texto plano, así una fuga de la base de
# datos no permite reutilizar tokens de recuperación.


def generar_token_recuperacion() -> tuple[str, str]:
    token_plano = secrets.token_urlsafe(32)
    return token_plano, hash_token(token_plano)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None

# ─── Contraseña automática para nuevos usuarios ────────────────────────────────
# Formato: Cédula + Inicial del nombre en mayúscula + Inicial del apellido
# en mayúscula + carácter especial fijo (@).
# Ejemplo: cedula=0912345678, nombre="Jeremy", apellido="Cuadrado"
#   → "0912345678JC@"

_CARACTER_ESPECIAL = "@"


def generar_password_inicial(cedula: str, nombre: str, apelido: str) -> str:
    inicial_nombre = nombre.strip()[0].upper() if nombre.strip() else "X"
    inicial_apelido = apelido.strip()[0].upper() if apelido.strip() else "X"
    return f"{cedula}{inicial_nombre}{inicial_apelido}{_CARACTER_ESPECIAL}"