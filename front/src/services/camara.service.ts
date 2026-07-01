import { API_ROUTES } from "../constants/apiRoutesConstants";
import type {
  Camara,
  CamaraCreate,
  CamaraUpdate,
} from "../models/camara.model";
import { createCrudService } from "./crud.service";

export const camaraService = createCrudService<
  Camara,
  CamaraCreate,
  CamaraUpdate
>(API_ROUTES.CAMARAS);
