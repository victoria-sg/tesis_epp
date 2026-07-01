from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Rol(Base):
    __tablename__ = "EPP_M_ROL"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre_rol = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)

    usuarios = relationship("Usuario", back_populates="rol")
    permisos_roles = relationship("PermisoRol", back_populates="rol")
    tipos_epp = relationship("TipoEPP", back_populates="rol")
