from sqlalchemy.orm import Session
from app.models.sirena_area import SirenaArea


def get_by_id(db: Session, id_sirena: int) -> SirenaArea | None:
    return db.query(SirenaArea).filter(SirenaArea.id_sirena == id_sirena).first()


def get_by_zona(db: Session, id_zona: int) -> list[SirenaArea]:
    return db.query(SirenaArea).filter(SirenaArea.id_zona == id_zona).all()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[SirenaArea]:
    return db.query(SirenaArea).offset(skip).limit(limit).all()


def create(db: Session, sirena: SirenaArea) -> SirenaArea:
    db.add(sirena)
    db.commit()
    db.refresh(sirena)
    return sirena


def update(db: Session, sirena: SirenaArea, data: dict) -> SirenaArea:
    for key, value in data.items():
        setattr(sirena, key, value)
    db.commit()
    db.refresh(sirena)
    return sirena


def delete(db: Session, sirena: SirenaArea) -> None:
    db.delete(sirena)
    db.commit()
