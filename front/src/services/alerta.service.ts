export interface AlertaCapturaPayload {
  id_camara: number;
  frame_base64: string;
  descripcion?: string;
}

export const capturarIncidencia = async (
  payload: AlertaCapturaPayload,
): Promise<void> => {
  const token = localStorage.getItem("epp_token") || "";
  const baseUrl = window.location.origin;

  const response = await fetch(`${baseUrl}/alertas/captura`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Error al guardar la captura");
  }
};