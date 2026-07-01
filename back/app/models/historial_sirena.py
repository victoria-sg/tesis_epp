from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.base import Base


class HistorialSirena(Base):
    __tablename__ = "EPP_T_HISTORIAL_SIRENA"

    id_historial_sirena = Column(Integer, primary_key=True, index=True)
    id_sirena = Column(
        Integer, ForeignKey("EPP_M_SIRENA_AREA.id_sirena"), nullable=False
    )
    id_alerta = Column(Integer, ForeignKey("EPP_T_ALERTA.id_alerta"), nullable=False)
    fecha_hora_encendido = Column(DateTime, nullable=True)
    fecha_hora_apagado = Column(DateTime, nullable=True)

    sirena = relationship("SirenaArea", back_populates="historial_sirenas")
    alerta = relationship("Alerta", back_populates="historial_sirenas")
