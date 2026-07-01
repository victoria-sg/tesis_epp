from sqlalchemy.orm import Session
from app.models.zona import Zona


def get_by_id(db: Session, id_zona: int) -> Zona | None:
    return db.query(Zona).filter(Zona.id_zona == id_zona).first()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Zona]:
    return db.query(Zona).offset(skip).limit(limit).all()


def create(db: Session, zona: Zona) -> Zona:
    db.add(zona)
    db.commit()
    db.refresh(zona)
    return zona


def update(db: Session, zona: Zona, data: dict) -> Zona:
    for key, value in data.items():
        setattr(zona, key, value)
    db.commit()
    db.refresh(zona)
    return zona


def delete(db: Session, zona: Zona) -> None:
    db.delete(zona)
    db.commit()
