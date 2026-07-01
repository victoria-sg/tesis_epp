from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class Usuario(Base):
    __tablename__ = "EPP_M_USUARIO"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("EPP_M_ROL.id_rol"), nullable=False)
    nombre = Column(String(100), nullable=False)
    apelido = Column(String(100), nullable=False)
    correo = Column(String(255), nullable=False, unique=True, index=True)
    contrasena = Column(String(255), nullable=False)
    cedula = Column(String(10), nullable=True)
    fecha_creacion = Column(DateTime, nullable=True)

    rol = relationship("Rol", back_populates="usuarios")
    resoluciones = relationship("ResolucionAlerta", back_populates="usuario")

    @property
    def rol_nombre(self) -> str:
        return self.rol.nombre_rol if self.rol else ""