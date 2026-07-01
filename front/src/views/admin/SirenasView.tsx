import { Plus } from "lucide-react";
import { useMemo } from "react";
import { ActionButtons } from "../../components/crud/ActionButtons";
import { ConfirmDialog } from "../../components/crud/ConfirmDialog";
import { CustomInput } from "../../components/crud/CustomInput";
import { CustomModal } from "../../components/crud/CustomModal";
import { CustomPagination } from "../../components/crud/CustomPagination";
import { CustomSelect } from "../../components/crud/CustomSelect";
import { CustomTable, type Column } from "../../components/crud/CustomTable";
import { PageHeader } from "../../components/crud/PageHeader";
import { SearchBar } from "../../components/crud/SearchBar";
import { StatusBadge } from "../../components/crud/StatusBadge";
import { useCrud } from "../../hooks/useCrud";
import { useCrudForm } from "../../hooks/useCrudForm";
import type { Sirena, SirenaCreate, SirenaUpdate } from "../../models/sirena.model";
import { SIRENA_ESTADOS } from "../../models/sirena.model";
import { sirenaService } from "../../services/sirena.service";
import { sirenaSchema, type SirenaFormValues } from "../../validators/sirena.schema";

const INITIAL_VALUES: SirenaFormValues = {
  id_zona: 0,
  codigo_sirena: "",
  ip_direccion: "",
  estado_dispositivo: null,
};

const FIELD_MAPPING: Record<string, string> = {
  id_zona: "id_zona",
  codigo_sirena: "codigo_sirena",
  ip_direccion: "ip_direccion",
  estado_dispositivo: "estado_dispositivo",
};

const PAGE_SIZE = 10;

export const SirenasView = () => {
  const crud = useCrud<Sirena, SirenaCreate, SirenaUpdate>(sirenaService, {
    pageSize: PAGE_SIZE,
  });

  const { formik, handleSubmit: handleFormSubmit } =
    useCrudForm<SirenaFormValues>({
      isEditing: crud.isEditing,
      editingItem: crud.editingItem as unknown as Record<string, unknown> | null,
      validationSchema: sirenaSchema,
      initialValues: INITIAL_VALUES,
      fieldMapping: FIELD_MAPPING,
      onSubmit: async (values) => {
        const data = {
          ...values,
          ip_direccion: values.ip_direccion || null,
          estado_dispositivo: values.estado_dispositivo || null,
        };
        if (crud.isEditing) {
          await crud.handleSubmit(data as SirenaUpdate);
        } else {
          await crud.handleSubmit(data as SirenaCreate);
        }
      },
    });

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((s) =>
      `${s.codigo_sirena} ${s.ip_direccion ?? ""} ${s.zona_nombre ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [crud.items, crud.filters.query]);

  const columns: Column<Sirena>[] = [
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
      key: "codigo_sirena",
      header: "Código",
      render: (s) => <span style={{ fontWeight: 500 }}>{s.codigo_sirena}</span>,
    },
    { key: "zona_nombre", header: "Zona", render: (s) => s.zona_nombre ?? "—" },
    {
      key: "ip_direccion",
      header: "Dirección IP",
      render: (s) => s.ip_direccion ?? "—",
    },
    {
      key: "estado_dispositivo",
      header: "Estado",
      align: "center",
      render: (s) =>
        s.estado_dispositivo ? (
          <StatusBadge estado={s.estado_dispositivo} />
        ) : (
          <span style={{ color: "#b0b0b0" }}>—</span>
        ),
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (s) => (
        <ActionButtons
          onEdit={() => crud.openEditModal(s)}
          onDelete={() => crud.confirmDelete(s.id_sirena)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Bocinas"
        subtitle="Administre las bocinas del sistema por zona"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nueva Bocina
          </button>
        }
      />

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Bocinas{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar bocina…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(s) => s.id_sirena}
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
        title={crud.isEditing ? "Editar Bocina" : "Nueva Bocina"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomSelect
            label="Zona"
            value={formik.values.id_zona}
            onChange={(v) => formik.setFieldValue("id_zona", Number(v))}
            options={[
              { value: 1, label: "Zona A - Fundición" },
              { value: 2, label: "Zona B - Trituración" },
              { value: 3, label: "Zona C - Almacén" },
            ]}
            placeholder="Seleccionar zona…"
            error={formik.errors.id_zona}
            touched={formik.touched.id_zona as boolean | undefined}
          />
          <CustomInput
            label="Código de Bocina"
            name="codigo_sirena"
            placeholder="Ej: BOC-ZA-01"
            value={formik.values.codigo_sirena}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.codigo_sirena}
            touched={formik.touched.codigo_sirena as boolean | undefined}
          />
          <CustomInput
            label="Dirección IP"
            name="ip_direccion"
            placeholder="Ej: 192.168.1.200"
            value={formik.values.ip_direccion ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.ip_direccion}
            touched={formik.touched.ip_direccion as boolean | undefined}
          />
          <CustomSelect
            label="Estado del Dispositivo"
            value={formik.values.estado_dispositivo ?? ""}
            onChange={(v) => formik.setFieldValue("estado_dispositivo", v || null)}
            options={SIRENA_ESTADOS.map((e) => ({
              value: e,
              label: e.charAt(0).toUpperCase() + e.slice(1),
            }))}
            placeholder="Seleccionar estado…"
            error={formik.errors.estado_dispositivo}
            touched={formik.touched.estado_dispositivo as boolean | undefined}
          />
          {crud.error && (
            <div className="text-[12px] text-red-600 text-center">{crud.error}</div>
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
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-amber-500/30"
            >
              {crud.submitLoading ? "Guardando..." : crud.isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </CustomModal>

      <ConfirmDialog
        open={crud.deleteConfirmOpen}
        title="Eliminar Bocina"
        message="¿Estás seguro de eliminar esta bocina? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};