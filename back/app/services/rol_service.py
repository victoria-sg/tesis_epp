from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.permiso_rol import PermisoRol
from app.repositories import permiso_repository, rol_repository
from app.schemas.rol import RolCreate, RolUpdate, RolResponse, RolConPermisosResponse


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[RolResponse]:
    roles = rol_repository.get_all(db, skip=skip, limit=limit)
    return [RolResponse.model_validate(r) for r in roles]


def get_by_id(db: Session, id_rol: int) -> RolResponse:
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado"
        )
    return RolResponse.model_validate(rol)


def get_con_permisos(db: Session, id_rol: int) -> RolConPermisosResponse:
    """Devuelve el rol junto con los ids de permisos que tiene asignados."""
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado"
        )
    ids_permisos = (
        db.query(PermisoRol.id_permiso)
        .filter(PermisoRol.id_rol == id_rol)
        .all()
    )
    return RolConPermisosResponse(
        id_rol=rol.id_rol,
        nombre_rol=rol.nombre_rol,
        descripcion=rol.descripcion,
        permisos=[r[0] for r in ids_permisos],
    )


def actualizar_permisos(db: Session, id_rol: int, ids_permisos: list[int]) -> RolConPermisosResponse:
    """Reemplaza los permisos de un rol por los que se reciben."""
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado"
        )
    for id_permiso in ids_permisos:
        if not permiso_repository.get_by_id(db, id_permiso):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El permiso {id_permiso} no existe",
            )
    db.query(PermisoRol).filter(PermisoRol.id_rol == id_rol).delete()
    for id_permiso in ids_permisos:
        db.add(PermisoRol(id_rol=id_rol, id_permiso=id_permiso))
    db.commit()
    return get_con_permisos(db, id_rol)


def create(db: Session, data: RolCreate) -> RolResponse:
    from app.models.rol import Rol
    rol = Rol(nombre_rol=data.nombre_rol, descripcion=data.descripcion)
    rol = rol_repository.create(db, rol)
    return RolResponse.model_validate(rol)


def update(db: Session, id_rol: int, data: RolUpdate) -> RolResponse:
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado"
        )
    update_data = data.model_dump(exclude_unset=True)
    rol = rol_repository.update(db, rol, update_data)
    return RolResponse.model_validate(rol)


def delete(db: Session, id_rol: int) -> None:
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado"
        )
    rol_repository.delete(db, rol)