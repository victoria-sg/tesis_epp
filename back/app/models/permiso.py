from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Permiso(Base):
    __tablename__ = "EPP_P_PERMISO"

    id_permiso = Column(Integer, primary_key=True, index=True)
    descripcion = Column(String(255), nullable=True)

    permisos_roles = relationship("PermisoRol", back_populates="permiso")
