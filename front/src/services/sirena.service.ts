import { API_ROUTES } from "../constants/apiRoutesConstants";
import type {
  Sirena,
  SirenaCreate,
  SirenaUpdate,
} from "../models/sirena.model";
import { createCrudService } from "./crud.service";

export const sirenaService = createCrudService<
  Sirena,
  SirenaCreate,
  SirenaUpdate
>(API_ROUTES.SIRENAS);
