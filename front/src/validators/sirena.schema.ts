import * as Yup from "yup";

export const sirenaSchema = Yup.object({
  id_zona: Yup.number()
    .typeError("Selecciona una zona")
    .required("La zona es obligatoria"),
  codigo_sirena: Yup.string()
    .required("El código de sirena es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  ip_direccion: Yup.string().nullable().max(45, "Máximo 45 caracteres"),
  estado_dispositivo: Yup.string()
    .nullable()
    .oneOf(["online", "offline"], "Estado no válido"),
});

export type SirenaFormValues = Yup.InferType<typeof sirenaSchema>;
