from sqlalchemy.orm import Session
from app.models.camara import Camara


def get_by_id(db: Session, id_camara: int) -> Camara | None:
    return db.query(Camara).filter(Camara.id_camara == id_camara).first()


def get_by_zona(db: Session, id_zona: int) -> list[Camara]:
    return db.query(Camara).filter(Camara.id_zona == id_zona).all()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Camara]:
    return db.query(Camara).offset(skip).limit(limit).all()


def create(db: Session, camara: Camara) -> Camara:
    db.add(camara)
    db.commit()
    db.refresh(camara)
    return camara


def update(db: Session, camara: Camara, data: dict) -> Camara:
    for key, value in data.items():
        setattr(camara, key, value)
    db.commit()
    db.refresh(camara)
    return camara


def delete(db: Session, camara: Camara) -> None:
    db.delete(camara)
    db.commit()
