import { API_ROUTES } from "../constants/apiRoutesConstants";
import type {
  TipoEPP,
  TipoEPPCreate,
  TipoEPPUpdate,
} from "../models/tipo.model";
import { createCrudService } from "./crud.service";

export const tipoService = createCrudService<
  TipoEPP,
  TipoEPPCreate,
  TipoEPPUpdate
>(API_ROUTES.TIPOS_EPP);
