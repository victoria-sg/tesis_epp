import { API_ROUTES } from "../constants/apiRoutesConstants";
import type {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
} from "../models/usuario.model";
import { createCrudService } from "./crud.service";

export const usuarioService = createCrudService<
  Usuario,
  UsuarioCreate,
  UsuarioUpdate
>(API_ROUTES.USUARIOS);
