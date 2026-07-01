from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class ConteoZona(Base):
    __tablename__ = "EPP_T_CONTEO_ZONA"

    id_conteo = Column(Integer, primary_key=True, index=True)
    id_camara = Column(Integer, ForeignKey("EPP_M_CAMARA.id_camara"), nullable=False)
    fecha_hora = Column(DateTime, nullable=True)
    total_personas = Column(Integer, nullable=True)
    total_con_epp = Column(Integer, nullable=True)
    total_sin_epp = Column(Integer, nullable=True)
    url_captura_evidencia = Column(String(500), nullable=True)

    camara = relationship("Camara", back_populates="conteos_zona")
