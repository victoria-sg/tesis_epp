from sqlalchemy.orm import Session
from app.models.tipo import TipoEPP


def get_by_id(db: Session, id_tipo_epp: int) -> TipoEPP | None:
    return db.query(TipoEPP).filter(TipoEPP.id_tipo_epp == id_tipo_epp).first()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[TipoEPP]:
    return db.query(TipoEPP).offset(skip).limit(limit).all()


def create(db: Session, tipo: TipoEPP) -> TipoEPP:
    db.add(tipo)
    db.commit()
    db.refresh(tipo)
    return tipo


def update(db: Session, tipo: TipoEPP, data: dict) -> TipoEPP:
    for key, value in data.items():
        setattr(tipo, key, value)
    db.commit()
    db.refresh(tipo)
    return tipo


def delete(db: Session, tipo: TipoEPP) -> None:
    db.delete(tipo)
    db.commit()
