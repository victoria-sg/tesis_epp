from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class Camara(Base):
    __tablename__ = "EPP_M_CAMARA"

    id_camara = Column(Integer, primary_key=True, index=True)
    id_zona = Column(Integer, ForeignKey("EPP_M_ZONA.id_zona"), nullable=False)
    codigo_camara = Column(String(50), nullable=False)
    tipo_fuente = Column(String(30), nullable=True, default="hikvision")
    ip_direccion = Column(String(45), nullable=True)
    estado_conexion = Column(String(30), nullable=True)
    ultima_conexion = Column(DateTime, nullable=True)

    zona = relationship("Zona", back_populates="camaras")
    alertas = relationship("Alerta", back_populates="camara")
    conteos_zona = relationship("ConteoZona", back_populates="camara")