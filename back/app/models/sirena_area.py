from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class SirenaArea(Base):
    __tablename__ = "EPP_M_SIRENA_AREA"

    id_sirena = Column(Integer, primary_key=True, index=True)
    id_zona = Column(Integer, ForeignKey("EPP_M_ZONA.id_zona"), nullable=False)
    codigo_sirena = Column(String(50), nullable=False)
    ip_direccion = Column(String(45), nullable=True)
    estado_dispositivo = Column(String(30), nullable=True)

    zona = relationship("Zona", back_populates="sirenas")
    historial_sirenas = relationship("HistorialSirena", back_populates="sirena")
