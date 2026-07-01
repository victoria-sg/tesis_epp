from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class RequeridoZona(Base):
    __tablename__ = "EPP_P_REQUERIDO_ZONA"

    id_epp_requerido = Column(Integer, primary_key=True, index=True)
    id_tipo_epp = Column(Integer, ForeignKey("EPP_M_TIPO.id_tipo_epp"), nullable=False)
    id_zona = Column(Integer, ForeignKey("EPP_M_ZONA.id_zona"), nullable=False)

    tipo_epp = relationship("TipoEPP", back_populates="requeridos_zona")
    zona = relationship("Zona", back_populates="requerimientos_zona")
