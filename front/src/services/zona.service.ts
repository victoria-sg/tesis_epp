import { API_ROUTES } from "../constants/apiRoutesConstants";
import type { Zona, ZonaCreate, ZonaUpdate } from "../models/zona.model";
import { createCrudService } from "./crud.service";

export const zonaService = createCrudService<Zona, ZonaCreate, ZonaUpdate>(
  API_ROUTES.ZONAS,
);
