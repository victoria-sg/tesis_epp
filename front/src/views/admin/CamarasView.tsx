import { Plus, Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButtons } from "../../components/crud/ActionButtons";
import { CameraQRDialog } from "../../components/CameraQRDialog";
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
import type { Camara, CamaraCreate, CamaraUpdate } from "../../models/camara.model";
import { CAMARA_ESTADOS, TIPOS_FUENTE } from "../../models/camara.model";
import { camaraService } from "../../services/camara.service";
import { camaraSchema, type CamaraFormValues } from "../../validators/camara.schema";

const INITIAL_VALUES: CamaraFormValues = {
  id_zona: 0,
  codigo_camara: "",
  tipo_fuente: "hikvision",
  ip_direccion: "",
  estado_conexion: null,
};

const FIELD_MAPPING: Record<string, string> = {
  id_zona: "id_zona",
  codigo_camara: "codigo_camara",
  tipo_fuente: "tipo_fuente",
  ip_direccion: "ip_direccion",
  estado_conexion: "estado_conexion",
};

const PAGE_SIZE = 10;

export const CamarasView = () => {
  const crud = useCrud<Camara, CamaraCreate, CamaraUpdate>(camaraService, {
    pageSize: PAGE_SIZE,
  });

  const [qrCamara, setQrCamara] = useState<Camara | null>(null);

  const { formik, handleSubmit: handleFormSubmit } = useCrudForm<CamaraFormValues>({
    isEditing: crud.isEditing,
    editingItem: crud.editingItem as unknown as Record<string, unknown> | null,
    validationSchema: camaraSchema,
    initialValues: INITIAL_VALUES,
    fieldMapping: FIELD_MAPPING,
    onSubmit: async (values) => {
      const data = {
        ...values,
        ip_direccion: values.ip_direccion || null,
        estado_conexion: values.estado_conexion || null,
      };
      if (crud.isEditing && crud.editingItem) {
        const id = crud.editingItem.id_camara;
        await crud.handleSubmit(data as CamaraUpdate, id);
      } else {
        await crud.handleSubmit(data as CamaraCreate);
      }
    },
  });

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((c) =>
      `${c.codigo_camara} ${c.ip_direccion ?? ""} ${c.zona_nombre ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [crud.items, crud.filters.query]);

  const esFallbackPhone = formik.values.tipo_fuente === "fallback_phone";

  const columns: Column<Camara>[] = [
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
      key: "codigo_camara",
      header: "Código",
      render: (c) => <span style={{ fontWeight: 500 }}>{c.codigo_camara}</span>,
    },
    { key: "zona_nombre", header: "Zona", render: (c) => c.zona_nombre ?? "—" },
    {
      key: "tipo_fuente",
      header: "Tipo",
      render: (c) =>
        c.tipo_fuente === "fallback_phone" ? (
          <span className="flex items-center gap-1 text-blue-600" style={{ fontSize: 12 }}>
            <Smartphone size={12} /> Teléfono
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#6b6b6b" }}>
            {c.tipo_fuente === "hikvision" ? "Hikvision" : "RTSP"}
          </span>
        ),
    },
    {
      key: "ip_direccion",
      header: "Dirección IP",
      render: (c) =>
        c.tipo_fuente === "fallback_phone" ? (
          <span style={{ color: "#b0b0b0", fontSize: 12 }}>Virtual</span>
        ) : (
          c.ip_direccion ?? "—"
        ),
    },
    {
      key: "estado_conexion",
      header: "Estado",
      align: "center",
      render: (c) =>
        c.estado_conexion ? (
          <StatusBadge estado={c.estado_conexion} />
        ) : (
          <span style={{ color: "#b0b0b0" }}>—</span>
        ),
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "130px",
      render: (c) => (
        <div className="flex items-center justify-center gap-2">
          {c.tipo_fuente === "fallback_phone" && (
            <button
              onClick={() => setQrCamara(c)}
              className="h-8 w-8 rounded-md border border-[#d4d4d4] hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center transition-colors"
              title="Vincular teléfono"
            >
              <Smartphone size={14} className="text-blue-500" />
            </button>
          )}
          <ActionButtons
            onEdit={() => crud.openEditModal(c)}
            onDelete={() => crud.confirmDelete(c.id_camara)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cámaras"
        subtitle="Administre las cámaras del sistema"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nueva Cámara
          </button>
        }
      />

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Cámaras{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar cámara…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(c) => c.id_camara}
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

      {/* Modal crear/editar */}
      <CustomModal
        open={crud.modalOpen}
        onClose={crud.closeModal}
        title={crud.isEditing ? "Editar Cámara" : "Nueva Cámara"}
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
            label="Código de Cámara"
            name="codigo_camara"
            placeholder="Ej: CAM-A1"
            value={formik.values.codigo_camara}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.codigo_camara}
            touched={formik.touched.codigo_camara as boolean | undefined}
          />
          <CustomSelect
            label="Tipo de fuente"
            value={formik.values.tipo_fuente}
            onChange={(v) => formik.setFieldValue("tipo_fuente", v)}
            options={TIPOS_FUENTE.map((t) => ({ value: t.value, label: t.label }))}
            placeholder="Seleccionar tipo…"
            error={formik.errors.tipo_fuente}
            touched={formik.touched.tipo_fuente as boolean | undefined}
          />
          {!esFallbackPhone && (
            <CustomInput
              label="Dirección IP"
              name="ip_direccion"
              placeholder="Ej: 192.168.1.100"
              value={formik.values.ip_direccion ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.ip_direccion}
              touched={formik.touched.ip_direccion as boolean | undefined}
            />
          )}
          {esFallbackPhone && (
            <div
              className="px-3 py-2.5 rounded-md border border-[#e5e5e5] bg-blue-50"
              style={{ fontSize: 12, color: "#1d4ed8", lineHeight: 1.5 }}
            >
              📱 Al guardar, aparecerá un botón con ícono de teléfono en la
              tabla. Haz clic en él para obtener el QR y el enlace que debes
              compartir con el teléfono.
            </div>
          )}
          <CustomSelect
            label="Estado de Conexión"
            value={formik.values.estado_conexion ?? ""}
            onChange={(v) => formik.setFieldValue("estado_conexion", v || null)}
            options={CAMARA_ESTADOS.map((e) => ({
              value: e,
              label: e.charAt(0).toUpperCase() + e.slice(1),
            }))}
            placeholder="Seleccionar estado…"
            error={formik.errors.estado_conexion}
            touched={formik.touched.estado_conexion as boolean | undefined}
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

      {/* Modal QR para teléfono */}
      {qrCamara && (
        <CameraQRDialog
          open={qrCamara !== null}
          onClose={() => setQrCamara(null)}
          camaraId={qrCamara.id_camara}
          codigoCamara={qrCamara.codigo_camara}
        />
      )}

      <ConfirmDialog
        open={crud.deleteConfirmOpen}
        title="Eliminar Cámara"
        message="¿Estás seguro de eliminar esta cámara? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};