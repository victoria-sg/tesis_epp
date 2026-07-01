import { Plus } from "lucide-react";
import { useMemo } from "react";
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
import type {
  TipoEPP,
  TipoEPPCreate,
  TipoEPPUpdate,
} from "../../models/tipo.model";
import { tipoService } from "../../services/tipo.service";
import { tipoSchema, type TipoFormValues } from "../../validators/tipo.schema";

const INITIAL_VALUES: TipoFormValues = {
  nombre_epp: "",
  descripcion: "",
  id_rol: null,
};

const FIELD_MAPPING: Record<string, string> = {
  nombre_epp: "nombre_epp",
  descripcion: "descripcion",
  id_rol: "id_rol",
};

const PAGE_SIZE = 10;

export const TiposEPPView = () => {
  const crud = useCrud<TipoEPP, TipoEPPCreate, TipoEPPUpdate>(tipoService, {
    pageSize: PAGE_SIZE,
  });

  const { formik, handleSubmit: handleFormSubmit } =
    useCrudForm<TipoFormValues>({
      isEditing: crud.isEditing,
      editingItem: crud.editingItem as unknown as Record<
        string,
        unknown
      > | null,
      validationSchema: tipoSchema,
      initialValues: INITIAL_VALUES,
      fieldMapping: FIELD_MAPPING,
      onSubmit: async (values) => {
        const data = {
          ...values,
          id_rol: values.id_rol || null,
          descripcion: values.descripcion || null,
        };
        if (crud.isEditing) {
          await crud.handleSubmit(data as TipoEPPUpdate);
        } else {
          await crud.handleSubmit(data as TipoEPPCreate);
        }
      },
    });

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((t) =>
      `${t.nombre_epp} ${t.descripcion ?? ""}`.toLowerCase().includes(q),
    );
  }, [crud.items, crud.filters.query]);

  const columns: Column<TipoEPP>[] = [
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
      key: "nombre_epp",
      header: "Nombre del EPP",
      render: (t) => <span style={{ fontWeight: 500 }}>{t.nombre_epp}</span>,
    },
    {
      key: "descripcion",
      header: "Descripción",
      render: (t) => t.descripcion ?? "—",
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (t) => (
        <ActionButtons
          onEdit={() => crud.openEditModal(t)}
          onDelete={() => crud.confirmDelete(t.id_tipo_epp)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tipos de EPP"
        subtitle="Administre los tipos de Equipos de Protección Personal"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] flex items-center gap-2 shadow-lg shadow-green-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nuevo Tipo de EPP
          </button>
        }
      />

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Tipos de EPP{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar tipo de EPP…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(t) => t.id_tipo_epp}
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
        title={crud.isEditing ? "Editar Tipo de EPP" : "Nuevo Tipo de EPP"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomInput
            label="Nombre del EPP"
            name="nombre_epp"
            placeholder="Ej: Casco, Guantes, Botas"
            value={formik.values.nombre_epp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.nombre_epp}
            touched={formik.touched.nombre_epp as boolean | undefined}
          />
          <CustomInput
            label="Descripción"
            name="descripcion"
            placeholder="Descripción del equipo"
            value={formik.values.descripcion ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.descripcion}
            touched={formik.touched.descripcion as boolean | undefined}
          />
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
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-green-500/30"
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
        title="Eliminar Tipo de EPP"
        message="¿Estás seguro de eliminar este tipo de EPP? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};
