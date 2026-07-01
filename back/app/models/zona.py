from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Zona(Base):
    __tablename__ = "EPP_M_ZONA"

    id_zona = Column(Integer, primary_key=True, index=True)
    nombre_zona = Column(String(100), nullable=False)
    nivel_riesgo = Column(String(50), nullable=True)
    capacidad_max = Column(Integer, nullable=True)
    tiempo_toleracia_segundo = Column(Integer, nullable=True)

    camaras = relationship("Camara", back_populates="zona")
    sirenas = relationship("SirenaArea", back_populates="zona")
    requerimientos_zona = relationship("RequeridoZona", back_populates="zona")
