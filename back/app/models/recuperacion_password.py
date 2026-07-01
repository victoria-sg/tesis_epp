from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from app.db.base import Base


class RecuperacionPassword(Base):
    __tablename__ = "EPP_T_RECUPERACION_PASSWORD"

    id_recuperacion = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(
        Integer, ForeignKey("EPP_M_USUARIO.id_usuario"), nullable=False, index=True
    )
    # Solo se guarda el hash (sha256) del token, nunca el token en texto plano.
    token_hash = Column(String(64), nullable=False, unique=True, index=True)
    fecha_expiracion = Column(DateTime, nullable=False)
    usado = Column(Boolean, nullable=False, default=False)
    fecha_creacion = Column(DateTime, nullable=False)
