from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class TipoEPP(Base):
    __tablename__ = "EPP_M_TIPO"

    id_tipo_epp = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("EPP_M_ROL.id_rol"), nullable=True)
    nombre_epp = Column(String(100), nullable=False)
    descripcion = Column(String(255), nullable=True)

    rol = relationship("Rol", back_populates="tipos_epp")
    requeridos_zona = relationship("RequeridoZona", back_populates="tipo_epp")
