from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class PermisoRol(Base):
    __tablename__ = "EPP_P_PERMISO_ROL"

    id_permiso_rol = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("EPP_M_ROL.id_rol"), nullable=False)
    id_permiso = Column(Integer, ForeignKey("EPP_P_PERMISO.id_permiso"), nullable=False)
    descripcion = Column(String(255), nullable=True)

    rol = relationship("Rol", back_populates="permisos_roles")
    permiso = relationship("Permiso", back_populates="permisos_roles")
