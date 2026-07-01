from sqlalchemy.orm import Session
from app.models.alerta import Alerta


def get_by_id(db: Session, id_alerta: int) -> Alerta | None:
    return db.query(Alerta).filter(Alerta.id_alerta == id_alerta).first()


def get_by_camara(db: Session, id_camara: int) -> list[Alerta]:
    return db.query(Alerta).filter(Alerta.id_camara == id_camara).all()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Alerta]:
    return db.query(Alerta).offset(skip).limit(limit).all()


def create(db: Session, alerta: Alerta) -> Alerta:
    db.add(alerta)
    db.commit()
    db.refresh(alerta)
    return alerta


def update(db: Session, alerta: Alerta, data: dict) -> Alerta:
    for key, value in data.items():
        setattr(alerta, key, value)
    db.commit()
    db.refresh(alerta)
    return alerta


def delete(db: Session, alerta: Alerta) -> None:
    db.delete(alerta)
    db.commit()
