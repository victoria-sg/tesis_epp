import * as Yup from "yup";

// ─── Esquema de validación del formulario de usuarios ────────────────────────
// La contraseña ya no se pide al crear: el backend la genera automáticamente
// a partir de cédula + iniciales + carácter especial, y la envía por correo.
export const buildUsuarioSchema = (isEditing: boolean) =>
  Yup.object({
    nombre: Yup.string()
      .required("El nombre es obligatorio")
      .max(100, "Máximo 100 caracteres"),
    apelido: Yup.string()
      .required("El apellido es obligatorio")
      .max(100, "Máximo 100 caracteres"),
    correo: Yup.string()
      .email("Correo no válido")
      .required("El correo es obligatorio"),
    id_rol: Yup.number()
      .typeError("Selecciona un rol")
      .min(1, "Selecciona un rol")
      .required("El rol es obligatorio"),
    cedula: isEditing
      ? Yup.string()
          .matches(/^\d{10}$/, "La cédula debe tener exactamente 10 dígitos")
          .notRequired()
      : Yup.string()
          .matches(/^\d{10}$/, "La cédula debe tener exactamente 10 dígitos")
          .required("La cédula es obligatoria"),
  });

export interface UsuarioFormValues {
  nombre: string;
  apelido: string;
  correo: string;
  id_rol: number | "";
  cedula?: string;
  [key: string]: unknown;
}