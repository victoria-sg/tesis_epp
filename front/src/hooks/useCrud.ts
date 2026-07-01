import { useCallback, useEffect, useMemo, useState } from "react";

interface CrudService<T, TCreate, TUpdate> {
  getAll: (
    skip?: number,
    limit?: number,
    params?: Record<string, string | number | undefined>,
  ) => Promise<T[]>;
  getById: (id: number) => Promise<T>;
  create: (data: TCreate) => Promise<T>;
  update: (id: number, data: TUpdate) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

interface Filters {
  query: string;
  [key: string]: string | number | undefined;
}

interface UseCrudOptions {
  pageSize?: number;
  defaultFilters?: Filters;
}

const getItemId = (item: unknown): number => {
  const obj = item as Record<string, unknown>;
  return (
    (obj["id_usuario"] as number) ??
    (obj["id_rol"] as number) ??
    (obj["id_zona"] as number) ??
    (obj["id_camara"] as number) ??
    (obj["id_tipo_epp"] as number) ??
    (obj["id_sirena"] as number) ??
    (obj["id_alerta"] as number) ??
    (obj["id_resolucion"] as number) ??
    (obj["id"] as number)
  );
};

export const useCrud = <T, TCreate, TUpdate>(
  service: CrudService<T, TCreate, TUpdate>,
  options: UseCrudOptions = {},
) => {
  const { pageSize = 10, defaultFilters = { query: "" } } = options;

  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const isEditing = editingItem !== null;

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );
  const safePage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = (safePage - 1) * pageSize;
      const result = await service.getAll(skip, pageSize, filters);
      setItems(result);
      setTotal(result.length);
    } catch {
      setError("Error al cargar los datos.");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [service, safePage, pageSize, filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = useCallback(() => {
    setEditingItem(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((item: T) => {
    setEditingItem(item);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: TCreate | TUpdate, overrideId?: number) => {
      setSubmitLoading(true);
      setError(null);
      try {
        if (isEditing && editingItem) {
          const id = overrideId ?? getItemId(editingItem);
          await service.update(id, values as TUpdate);
        } else {
          await service.create(values as TCreate);
        }
        closeModal();
        await fetchItems();
      } catch (err: unknown) {
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        if (detail) {
          setError(detail);
        } else {
          setError("Error al guardar. Intenta de nuevo.");
        }
      } finally {
        setSubmitLoading(false);
      }
    },
    [service, isEditing, editingItem, closeModal, fetchItems],
  );

  const confirmDelete = useCallback((id: number) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (deletingId === null) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await service.remove(deletingId);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
      await fetchItems();
    } catch {
      setError("Error al eliminar. Intenta de nuevo.");
    } finally {
      setDeleteLoading(false);
    }
  }, [service, deletingId, fetchItems]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmOpen(false);
    setDeletingId(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    items,
    total,
    loading,
    error,
    page: safePage,
    totalPages,
    filters,
    modalOpen,
    editingItem,
    isEditing,
    deleteConfirmOpen,
    deleteLoading,
    submitLoading,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    confirmDelete,
    handleDelete,
    cancelDelete,
    handleSearch,
    handlePageChange,
    fetchItems,
  };
};