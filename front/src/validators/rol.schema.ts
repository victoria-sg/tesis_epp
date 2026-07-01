import * as Yup from "yup";

export const rolSchema = Yup.object({
  nombre_rol: Yup.string()
    .required("El nombre del rol es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  descripcion: Yup.string().nullable().max(255, "Máximo 255 caracteres"),
});

export type RolFormValues = Yup.InferType<typeof rolSchema>;
