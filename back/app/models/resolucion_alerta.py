from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Time
from sqlalchemy.orm import relationship
from app.db.base import Base


class ResolucionAlerta(Base):
    __tablename__ = "EPP_T_RESOLUCION_ALERTA"

    id_resolucion = Column(Integer, primary_key=True, index=True)
    id_alerta = Column(Integer, ForeignKey("EPP_T_ALERTA.id_alerta"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("EPP_M_USUARIO.id_usuario"), nullable=False)
    fecha_hora_resolucion = Column(DateTime, nullable=True)
    tiempo_resolucion = Column(Time, nullable=True)
    comentario = Column(String(500), nullable=True)

    alerta = relationship("Alerta", back_populates="resolucion")
    usuario = relationship("Usuario", back_populates="resoluciones")
