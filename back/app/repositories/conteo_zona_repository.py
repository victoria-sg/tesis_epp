from sqlalchemy.orm import Session
from app.models.conteo_zona import ConteoZona


def get_by_id(db: Session, id_conteo: int) -> ConteoZona | None:
    return db.query(ConteoZona).filter(ConteoZona.id_conteo == id_conteo).first()


def get_by_camara(db: Session, id_camara: int) -> list[ConteoZona]:
    return db.query(ConteoZona).filter(ConteoZona.id_camara == id_camara).all()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ConteoZona]:
    return db.query(ConteoZona).offset(skip).limit(limit).all()


def create(db: Session, conteo: ConteoZona) -> ConteoZona:
    db.add(conteo)
    db.commit()
    db.refresh(conteo)
    return conteo


def delete(db: Session, conteo: ConteoZona) -> None:
    db.delete(conteo)
    db.commit()
