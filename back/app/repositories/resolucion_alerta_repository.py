from sqlalchemy.orm import Session
from app.models.resolucion_alerta import ResolucionAlerta


def get_by_id(db: Session, id_resolucion: int) -> ResolucionAlerta | None:
    return (
        db.query(ResolucionAlerta)
        .filter(ResolucionAlerta.id_resolucion == id_resolucion)
        .first()
    )


def get_by_alerta(db: Session, id_alerta: int) -> list[ResolucionAlerta]:
    return (
        db.query(ResolucionAlerta).filter(ResolucionAlerta.id_alerta == id_alerta).all()
    )


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ResolucionAlerta]:
    return db.query(ResolucionAlerta).offset(skip).limit(limit).all()


def create(db: Session, resolucion: ResolucionAlerta) -> ResolucionAlerta:
    db.add(resolucion)
    db.commit()
    db.refresh(resolucion)
    return resolucion


def delete(db: Session, resolucion: ResolucionAlerta) -> None:
    db.delete(resolucion)
    db.commit()
