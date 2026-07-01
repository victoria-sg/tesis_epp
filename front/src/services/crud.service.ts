import api from "./api";

// ─── Tipos genéricos ──────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Servicio CRUD genérico ────────────────────────────────────────────────────

export const createCrudService = <T, TCreate, TUpdate>(basePath: string) => {
  const getById = async (id: number): Promise<T> => {
    const response = await api.get<T>(`${basePath}/${id}`);
    return response.data;
  };

  const getAll = async (
    skip = 0,
    limit = 100,
    params?: Record<string, string | number | undefined>,
  ): Promise<T[]> => {
    const response = await api.get<T[]>(`${basePath}/`, {
      params: { skip, limit, ...params },
    });
    return response.data;
  };

  const create = async (data: TCreate): Promise<T> => {
    const response = await api.post<T>(`${basePath}/`, data);
    return response.data;
  };

  const update = async (id: number, data: TUpdate): Promise<T> => {
    const response = await api.put<T>(`${basePath}/${id}`, data);
    return response.data;
  };

  const remove = async (id: number): Promise<void> => {
    await api.delete(`${basePath}/${id}`);
  };

  return { getById, getAll, create, update, remove };
};
