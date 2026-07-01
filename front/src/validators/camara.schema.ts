import * as Yup from "yup";

export const camaraSchema = Yup.object({
  id_zona: Yup.number()
    .typeError("Selecciona una zona")
    .required("La zona es obligatoria"),
  codigo_camara: Yup.string()
    .required("El código de cámara es obligatorio")
    .max(50, "Máximo 50 caracteres"),
  tipo_fuente: Yup.string()
    .required("El tipo de fuente es obligatorio")
    .oneOf(
      ["hikvision", "rtsp_generic", "fallback_phone"],
      "Tipo de fuente no válido",
    ),
  ip_direccion: Yup.string().nullable().max(45, "Máximo 45 caracteres"),
  estado_conexion: Yup.string()
    .nullable()
    .oneOf(["activo", "inactivo", "mantenimiento"], "Estado no válido"),
});

export type CamaraFormValues = Yup.InferType<typeof camaraSchema>;