import { API_ROUTES } from "../constants/apiRoutesConstants";
import type { Rol, RolCreate, RolConPermisos, RolUpdate } from "../models/rol.model";
import api from "./api";
import { createCrudService } from "./crud.service";

export const rolService = createCrudService<Rol, RolCreate, RolUpdate>(
  API_ROUTES.ROLES,
);

export const getRolConPermisos = async (id_rol: number): Promise<RolConPermisos> => {
  const r = await api.get<RolConPermisos>(`${API_ROUTES.ROLES}/${id_rol}/permisos`);
  return r.data;
};

export const actualizarPermisosRol = async (
  id_rol: number,
  permisos: number[],
): Promise<RolConPermisos> => {
  const r = await api.put<RolConPermisos>(
    `${API_ROUTES.ROLES}/${id_rol}/permisos`,
    { permisos },
  );
  return r.data;
};