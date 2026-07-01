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
import type {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
} from "../../models/usuario.model";
import { usuarioService } from "../../services/usuario.service";
import {
  buildUsuarioSchema,
  type UsuarioFormValues,
} from "../../validators/usuario.schema";

const INITIAL_VALUES: UsuarioFormValues = {
  nombre: "",
  apelido: "",
  correo: "",
  id_rol: "",
  cedula: "",
};

const ROLES_ASIGNABLES = [
  { value: 2, label: "Supervisor de Turno" },
  { value: 3, label: "Jefe de Planta" },
];

const FIELD_MAPPING: Record<string, string> = {
  nombre: "nombre",
  apelido: "apelido",
  correo: "correo",
  id_rol: "id_rol",
  cedula: "cedula",
};

const PAGE_SIZE = 8;

export const UsuariosView = () => {
  const crud = useCrud<Usuario, UsuarioCreate, UsuarioUpdate>(usuarioService, {
    pageSize: PAGE_SIZE,
  });

  const usuarioSchema = useMemo(
    () => buildUsuarioSchema(crud.isEditing),
    [crud.isEditing],
  );

  const { formik, handleSubmit: handleFormSubmit } =
    useCrudForm<UsuarioFormValues>({
      isEditing: crud.isEditing,
      editingItem: crud.editingItem as unknown as Record<string, unknown> | null,
      validationSchema: usuarioSchema,
      initialValues: INITIAL_VALUES,
      fieldMapping: FIELD_MAPPING,
      onSubmit: async (values) => {
        if (crud.isEditing) {
          const updateData: UsuarioUpdate = {
            nombre: values.nombre,
            apelido: values.apelido,
            correo: values.correo,
            id_rol: Number(values.id_rol),
            cedula: values.cedula?.trim() || undefined,
          };
          await crud.handleSubmit(updateData);
        } else {
          const createData: UsuarioCreate = {
            nombre: values.nombre,
            apelido: values.apelido,
            correo: values.correo,
            id_rol: Number(values.id_rol),
            cedula: values.cedula ?? "",
          };
          await crud.handleSubmit(createData);
        }
      },
    });

  const filteredItems = useMemo(() => {
    const q = crud.filters.query.toLowerCase().trim();
    if (!q) return crud.items;
    return crud.items.filter((u) =>
      `${u.nombre} ${u.apelido} ${u.correo} ${u.cedula ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [crud.items, crud.filters.query]);

  const columns: Column<Usuario>[] = [
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
      key: "nombre",
      header: "Nombre",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white flex items-center justify-center shadow-md shadow-purple-500/30"
            style={{ fontSize: 11, fontWeight: 700 }}
          >
            {u.nombre[0]}
            {u.apelido[0]}
          </div>
          <div style={{ fontWeight: 500 }}>
            {u.nombre} {u.apelido}
          </div>
        </div>
      ),
    },
    { key: "correo", header: "Correo" },
    { key: "cedula", header: "Cédula", render: (u) => u.cedula ?? "—" },
    { key: "rol_nombre", header: "Rol", render: (u) => u.rol_nombre ?? "—" },
    {
      key: "estado",
      header: "Estado",
      align: "center",
      render: () => <StatusBadge estado="activo" />,
    },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      width: "100px",
      render: (u) => (
        <ActionButtons
          onEdit={() => crud.openEditModal(u)}
          onDelete={() => crud.confirmDelete(u.id_usuario)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        subtitle="Administre los usuarios del sistema"
        action={
          <button
            onClick={crud.openCreateModal}
            className="h-10 px-4 rounded-md bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Nuevo Usuario
          </button>
        }
      />

      <div className="bg-white border border-[#e5e5e5] rounded-lg">
        <div className="px-5 py-4 border-b border-[#ececec] flex items-center justify-between gap-4">
          <div style={{ fontSize: 15, fontWeight: 600, color: "#000" }}>
            Usuarios{" "}
            <span style={{ color: "#6b6b6b", fontWeight: 400 }}>
              · {filteredItems.length}
            </span>
          </div>
          <SearchBar
            value={crud.filters.query}
            onChange={crud.handleSearch}
            placeholder="Buscar usuario…"
          />
        </div>

        <CustomTable
          columns={columns}
          data={filteredItems}
          keyExtractor={(u) => u.id_usuario}
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
        title={crud.isEditing ? "Editar Usuario" : "Nuevo Usuario"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <CustomInput
            label="Nombre"
            name="nombre"
            placeholder="Ingrese el nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.nombre}
            touched={formik.touched.nombre as boolean | undefined}
          />
          <CustomInput
            label="Apellido"
            name="apelido"
            placeholder="Ingrese el apellido"
            value={formik.values.apelido}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.apelido}
            touched={formik.touched.apelido as boolean | undefined}
          />
          <CustomInput
            label="Correo electrónico"
            name="correo"
            type="email"
            placeholder="correo@empresa.com"
            value={formik.values.correo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.correo}
            touched={formik.touched.correo as boolean | undefined}
          />
          <CustomInput
            label="Cédula"
            name="cedula"
            placeholder="10 dígitos numéricos"
            value={formik.values.cedula ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.cedula}
            touched={formik.touched.cedula as boolean | undefined}
          />
          <CustomSelect
            label="Rol"
            value={formik.values.id_rol}
            onChange={(v) => formik.setFieldValue("id_rol", v)}
            options={ROLES_ASIGNABLES}
            placeholder="Seleccionar rol…"
            error={formik.errors.id_rol}
            touched={formik.touched.id_rol as boolean | undefined}
          />
          {!crud.isEditing && (
            <div
              className="px-3 py-2.5 rounded-md border border-[#e5e5e5] bg-[#f5f3ff]"
              style={{ fontSize: 12, color: "#6b6b6b", lineHeight: 1.5 }}
            >
              🔐 La contraseña se generará automáticamente a partir de la
              cédula e iniciales del nombre, y se enviará al correo registrado.
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
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] text-sm font-semibold transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/30"
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
        title="Eliminar Usuario"
        message="¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer."
        onConfirm={crud.handleDelete}
        onCancel={crud.cancelDelete}
        loading={crud.deleteLoading}
      />
    </div>
  );
};