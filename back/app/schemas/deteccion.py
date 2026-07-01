from pydantic import BaseModel


class DeteccionRequest(BaseModel):
    frame_base64: str
    confianza_minima: float = 0.4


class DeteccionItem(BaseModel):
    clase: str
    confianza: float
    caja: list[int]


class DeteccionResponse(BaseModel):
    detecciones: list[DeteccionItem]
    infraccion: bool
    personas_detectadas: int