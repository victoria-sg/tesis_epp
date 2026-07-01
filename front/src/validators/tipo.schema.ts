import * as Yup from "yup";

export const tipoSchema = Yup.object({
  nombre_epp: Yup.string()
    .required("El nombre del EPP es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  descripcion: Yup.string().nullable().max(255, "Máximo 255 caracteres"),
  id_rol: Yup.number().nullable().typeError("Selecciona un rol"),
});

export type TipoFormValues = Yup.InferType<typeof tipoSchema>;
