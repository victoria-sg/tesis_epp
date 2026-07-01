import { AlertTriangle, Plus, Shield, ShieldAlert } from "lucide-react";
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
import { useCrud } from "../../hooks/useCrud";
import { useCrudForm } from "../../hooks/useCrudForm";
import type { Zona, ZonaCreate, ZonaUpdate } from "../../models/zona.model";
import {
  inferirNivelRiesgo,
  NIVEL_RIESGO_CONFIG,
  ZONA_NIVELES_RIESGO,
} from "../../models/zona.model";
import { zonaService } from "../../services/zona.service";
import { zonaSchema, type ZonaFormValues } from "../../validators/zona.schema";

const INITIAL_VALUES: ZonaFormValues = {
  nombre_zona: "",
  nivel_riesgo: null,
  capacidad_max: null,
  tiempo_toleracia_segundo: null,
};

const FIELD_MAPPING: Record<string, string> = {
  nombre_zona: "nombre_zona",
  nivel_riesgo: "nivel_riesgo",
  capacidad_max: "capacidad_max",
  tiempo_toleracia_segundo: "tiempo_toleracia_segundo",
};

const PAGE_SIZE = 10;

const NivelRiesgoBadge = ({ nivel }: { nivel: string | null | undefined }) => {
  if (!nivel) return <span style={{ color: "#b0b0b0" }}>—</span>;
  const key = nivel.toLowerCase() as keyof typeof NIVEL_RIESGO_CONFIG;
  const config = NIVEL_RIESGO_CONFIG[key] ?? NIVEL_RIESGO_CONFIG.bajo;
  const Icon = key === "alto" ? ShieldAlert : key === "medio" ? AlertTriangle : Shield;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.badge}`}
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
};

export const ZonasView = () => {
  const crud = useCrud<Zona, ZonaCreate, ZonaUpdate>(zonaService, {
    pageSize: PAGE_SIZE,
  });

  const { formik, handleSubmit: handleFormSubmit } =
    useCrudForm<ZonaFormValues>({
      isEditing: crud.isEditing,
      editingItem: crud.editingItem as unknown as Record<string, unknown> | null,
      validationSchema: zonaSchema,
      initialValues: INITIAL_VALUES,
      fieldMapping: FIELD_MAPPING,
      onSubmit: async (values) => {
        // Si no eligió nivel, inferirlo del nombre
        const nivel = values.nivel_riesgo || inferirNivelRiesgo(values.nombre_zona);
        const data = {
          ...values,
          nivel_riesgo: nivel,
          capacidad_max: values.capacidad_max || null,
          tiempo_toleracia_segundo: values.tiempo_toleracia_segundo || null,
        };
        if (crud.isEditing) {
          await crud.handleSubmit(data as ZonaUpdate);
        } else {
          await crud.handleSubmit(data as ZonaCreate);
        }
      },
    });

  // Nivel inferido en tiempo real mientras escribe el nombre
  const nivelInferido = useMemo(
    () => (!formik.values.nivel_riesgo && formik.values.nombre_zona
      ? inferirNivelRiesgo(formik.values.nombre_zona)
      : null),
    [formik.values.nombre_zona, formik.values.nivel_riesgo],
  );

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((z) =>
      `${z.nombre_zona} ${z.nivel_riesgo ?? ""}`.toLowerCase().includes(q),
    );
  }, [crud.items, crud.filters.query]);

  // Contadores por nivel
  const contadores = useMemo(() => ({
    alto: filteredItems.filter((z) => z.nivel_riesgo?.toLowerCase() === "alto").length,
    medio: filteredItems.filter((z) => z.nivel_riesgo?.toLowerCase() === "medio").length,
    bajo: filteredItems.filter((z) => z.nivel_riesgo?.toLowerCase() === "bajo").length,
  }), [filteredItems]);

  const columns: Column<Zona>[] = [
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
      key: "nombre_zona",
      header: "Nombre",
      render: (z) => {
        const nivel = z.nivel_riesgo?.toLowerCase() as keyof typeof NIVEL_RIESGO_CONFIG | undefined;
        const config = nivel ? NIVEL_RIESGO_CONFIG[nivel] : null;
        return (
          <div className="flex items-center gap-2">
            {config && (
              <div
                className="w-1.5 h-8 rounded-full shrink-0"
                style={{ background: config.color }}
              />
            )}
            <span style={{ fontWeight: 500 }}>{z.nombre_zona}</span>
          </div>
        );
      },
    },
    {
      key: "nivel_riesgo",
      header: "Nivel de Riesgo",
      align: "center",
      render: (z) => <NivelRiesgoBadge nivel={z.nivel_riesgo} />,
    },
    {
      key: "capacidad_max",
      header: "Capacidad Máx",
      align: "center",
      render: (z) => z.capacidad_max
        ? <span>{z.capacidad_max} <span style={{ color: "#9ca3af", fontSize: 11 }}>personas</span></span>
        : "—",
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (z) => (
        <ActionButtons
          onEdit={() => crud.openEditModal(z)}
          onDelete={() => crud.confirmDelete(z.id_zona)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Zonas"
        subtitle="Administre las zonas de la planta"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nueva Zona
          </button>
        }
      />

      {/* Resumen por nivel */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {(["alto", "medio", "bajo"] as const).map((nivel) => {
          const config = NIVEL_RIESGO_CONFIG[nivel];
          const Icon = nivel === "alto" ? ShieldAlert : nivel === "medio" ? AlertTriangle : Shield;
          return (
            <div
              key={nivel}
              className="rounded-lg border p-4 flex items-center gap-3"
              style={{ background: config.bg, borderColor: config.border }}
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: config.color + "20" }}>
                <Icon size={18} style={{ color: config.color }} />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: config.color }}>
                  {contadores[nivel]}
                </div>
                <div style={{ fontSize: 11, color: config.color, opacity: 0.8 }}>
                  Riesgo {config.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Zonas{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar zona…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(z) => z.id_zona}
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
        title={crud.isEditing ? "Editar Zona" : "Nueva Zona"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomInput
            label="Nombre de la Zona"
            name="nombre_zona"
            placeholder="Ej: Zona A - Fundición"
            value={formik.values.nombre_zona}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.nombre_zona}
            touched={formik.touched.nombre_zona as boolean | undefined}
          />

          <div>
            <CustomSelect
              label="Nivel de Riesgo"
              value={formik.values.nivel_riesgo ?? ""}
              onChange={(v) => formik.setFieldValue("nivel_riesgo", v || null)}
              options={ZONA_NIVELES_RIESGO.map((n) => ({
                value: n,
                label: NIVEL_RIESGO_CONFIG[n].label,
              }))}
              placeholder="Dejar vacío para detectar automáticamente…"
              error={formik.errors.nivel_riesgo}
              touched={formik.touched.nivel_riesgo as boolean | undefined}
            />
            {nivelInferido && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span style={{ fontSize: 11, color: "#6b6b6b" }}>
                  Se detectará automáticamente:
                </span>
                <NivelRiesgoBadge nivel={nivelInferido} />
              </div>
            )}
          </div>

          <CustomInput
            label="Capacidad Máxima"
            name="capacidad_max"
            type="number"
            placeholder="Ej: 50"
            value={formik.values.capacidad_max ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.capacidad_max}
            touched={formik.touched.capacidad_max as boolean | undefined}
          />
          <CustomInput
            label="Tiempo de Tolerancia (segundos)"
            name="tiempo_toleracia_segundo"
            type="number"
            placeholder="Ej: 30"
            value={formik.values.tiempo_toleracia_segundo ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.tiempo_toleracia_segundo}
            touched={formik.touched.tiempo_toleracia_segundo as boolean | undefined}
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
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white hover:from-[#2563eb] hover:to-[#1d4ed8] text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/30"
            >
              {crud.submitLoading ? "Guardando..." : crud.isEditing ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </CustomModal>

      <ConfirmDialog
        open={crud.deleteConfirmOpen}
        title="Eliminar Zona"
        message="¿Estás seguro de eliminar esta zona? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};