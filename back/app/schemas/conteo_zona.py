from pydantic import BaseModel
from pydantic.config import ConfigDict
from datetime import datetime


class ConteoZonaBase(BaseModel):
    id_camara: int
    fecha_hora: datetime | None = None
    total_personas: int | None = None
    total_con_epp: int | None = None
    total_sin_epp: int | None = None
    url_captura_evidencia: str | None = None


class ConteoZonaCreate(ConteoZonaBase):
    pass


class ConteoZonaResponse(ConteoZonaBase):
    id_conteo: int

    model_config = ConfigDict(from_attributes=True)
