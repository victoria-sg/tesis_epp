import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActionButtons } from "../../components/crud/ActionButtons";
import { ConfirmDialog } from "../../components/crud/ConfirmDialog";
import { CustomInput } from "../../components/crud/CustomInput";
import { CustomModal } from "../../components/crud/CustomModal";
import { CustomPagination } from "../../components/crud/CustomPagination";
import { CustomTable, type Column } from "../../components/crud/CustomTable";
import { PageHeader } from "../../components/crud/PageHeader";
import { SearchBar } from "../../components/crud/SearchBar";
import { useCrud } from "../../hooks/useCrud";
import { useCrudForm } from "../../hooks/useCrudForm";
import type { Rol, RolCreate, RolUpdate } from "../../models/rol.model";
import { PERMISOS_DISPONIBLES } from "../../models/rol.model";
import {
  actualizarPermisosRol,
  getRolConPermisos,
  rolService,
} from "../../services/rol.service";
import { rolSchema, type RolFormValues } from "../../validators/rol.schema";

const INITIAL_VALUES: RolFormValues = {
  nombre_rol: "",
  descripcion: "",
};

const FIELD_MAPPING: Record<string, string> = {
  nombre_rol: "nombre_rol",
  descripcion: "descripcion",
};

const PAGE_SIZE = 10;

export const RolesView = () => {
  const crud = useCrud<Rol, RolCreate, RolUpdate>(rolService, {
    pageSize: PAGE_SIZE,
  });

  // ─── Estado de permisos del rol que se está editando ──────────────────────
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>([]);
  const [permisosLoading, setPermisosLoading] = useState(false);
  const [permisosError, setPermisosError] = useState<string | null>(null);

  useEffect(() => {
    if (!crud.isEditing || !crud.editingItem) {
      const timer = setTimeout(() => {
        setPermisosSeleccionados([]);
        setPermisosError(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    const idRol = crud.editingItem.id_rol;
    let activo = true;

    setPermisosLoading(true);
    getRolConPermisos(idRol)
      .then((r) => {
        if (activo) {
          setPermisosSeleccionados(r.permisos);
          setPermisosLoading(false);
        }
      })
      .catch(() => {
        if (activo) {
          setPermisosError("No se pudieron cargar los permisos");
          setPermisosLoading(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [crud.isEditing, crud.editingItem]);

  const togglePermiso = (id: number) => {
    setPermisosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const { formik, handleSubmit: handleFormSubmit } = useCrudForm<RolFormValues>(
    {
      isEditing: crud.isEditing,
      editingItem: crud.editingItem as unknown as Record<string, unknown> | null,
      validationSchema: rolSchema,
      initialValues: INITIAL_VALUES,
      fieldMapping: FIELD_MAPPING,
      onSubmit: async (values) => {
        if (crud.isEditing && crud.editingItem) {
          await crud.handleSubmit(values as RolUpdate);
          await actualizarPermisosRol(
            crud.editingItem.id_rol,
            permisosSeleccionados,
          );
        } else {
          await crud.handleSubmit(values as RolCreate);
        }
      },
    },
  );

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((r) =>
      `${r.nombre_rol} ${r.descripcion ?? ""}`.toLowerCase().includes(q),
    );
  }, [crud.items, crud.filters.query]);

  const columns: Column<Rol>[] = [
    {
      key: "index",
      header: "#",
      width: "60px",
      align: "center",
      render: (_, i) => (
        <span style={{ color: "#6b6b6b", fontVariantNumeric: "tabular-nums" }}>
          {(crud.page - 1) * PAGE_SIZE + i + 1}
        </span>
      ),
    },
    {
      key: "nombre_rol",
      header: "Nombre del Rol",
      render: (r) => <span style={{ fontWeight: 500 }}>{r.nombre_rol}</span>,
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (r) => r.descripcion ?? "—",
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (r) => (
        <ActionButtons
          onEdit={() => crud.openEditModal(r)}
          onDelete={() => crud.confirmDelete(r.id_rol)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Roles"
        subtitle="Administre los roles del sistema y sus permisos"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nuevo Rol
          </button>
        }
      />

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Roles{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar rol…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(r) => r.id_rol}
          startIndex={(crud.page - 1) * PAGE_SIZE}
        />

        <CustomPagination
          page={crud.page}
          totalPages={crud.totalPages}
          total={filteredItems.length}
          pageSize={PAGE_SIZE}
          onPageChange={crud.handlePageChange}
        />
      </div>

      {/* Modal */}
      <CustomModal
        open={crud.modalOpen}
        onClose={crud.closeModal}
        title={crud.isEditing ? "Editar Rol" : "Nuevo Rol"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomInput
            label="Nombre del Rol"
            name="nombre_rol"
            placeholder="Ej: Administrador"
            value={formik.values.nombre_rol}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.nombre_rol}
            touched={formik.touched.nombre_rol as boolean | undefined}
          />
          <CustomInput
            label="Descripción"
            name="descripcion"
            placeholder="Descripción del rol"
            value={formik.values.descripcion ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.descripcion}
            touched={formik.touched.descripcion as boolean | undefined}
          />

          {/* ─── Permisos (solo al editar) ─────────────────────────── */}
          {crud.isEditing && (
            <div>
              <div
                className="mb-2"
                style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}
              >
                Permisos
              </div>
              {permisosLoading ? (
                <div style={{ fontSize: 12, color: "#6b6b6b" }}>
                  Cargando permisos…
                </div>
              ) : permisosError ? (
                <div style={{ fontSize: 12, color: "#dc2626" }}>
                  {permisosError}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {PERMISOS_DISPONIBLES.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-md border border-[#e5e5e5] hover:border-[#8b5cf6] hover:bg-[#f5f3ff] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={permisosSeleccionados.includes(p.id)}
                        onChange={() => togglePermiso(p.id)}
                        className="accent-[#7c3aed] w-4 h-4"
                      />
                      <span style={{ fontSize: 12, color: "#1a1a1a" }}>
                        {p.etiqueta}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {crud.error && (
            <div className="text-[12px] text-red-600 text-center">
              {crud.error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={crud.closeModal}
              className="h-10 px-4 rounded-lg border border-[#d4d4d4] text-[#1a1a1a] hover:bg-[#f5f5f5] text-sm font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={crud.submitLoading}
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30"
            >
              {crud.submitLoading
                ? "Guardando..."
                : crud.isEditing
                  ? "Actualizar"
                  : "Crear"}
            </button>
          </div>
        </form>
      </CustomModal>

      <ConfirmDialog
        open={crud.deleteConfirmOpen}
        title="Eliminar Rol"
        message="¿Estás seguro de eliminar este rol? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};