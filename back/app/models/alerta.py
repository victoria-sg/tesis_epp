from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Alerta(Base):
    __tablename__ = "EPP_T_ALERTA"

    id_alerta = Column(Integer, primary_key=True, index=True)
    id_camara = Column(Integer, ForeignKey("EPP_M_CAMARA.id_camara"), nullable=False)
    fecha_hora_deteccion = Column(DateTime, nullable=True)
    segundos_transcurridos = Column(Integer, nullable=True)
    estado_alerta = Column(String(30), nullable=True)
    captura_frame = Column(Text, nullable=True)  # base64 del frame capturado

    camara = relationship("Camara", back_populates="alertas")
    resolucion = relationship(
        "ResolucionAlerta", back_populates="alerta", uselist=False
    )
    historial_sirenas = relationship("HistorialSirena", back_populates="alerta")