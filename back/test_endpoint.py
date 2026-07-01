import base64
import requests

# Toma una imagen del dataset y la convierte a base64
img_path = "./datasets/construction-site-safety/test/images"
import os
primera_imagen = os.listdir(img_path)[1]
ruta_completa = os.path.join(img_path, primera_imagen)

with open(ruta_completa, "rb") as f:
    img_bytes = f.read()

img_base64 = "data:image/jpeg;base64," + base64.b64encode(img_bytes).decode()

print(f"Imagen usada: {primera_imagen}")
print(f"Tamaño base64: {len(img_base64)} caracteres")

# Necesitas un token válido — primero hacemos login
login_resp = requests.post(
    "http://localhost:8000/auth/login",
    json={"correo": "admin@epp.com", "contrasena": "admin123"},
)
print("Login status:", login_resp.status_code)

if login_resp.status_code == 200:
    token = login_resp.json()["access_token"]

    resp = requests.post(
        "http://localhost:8000/deteccion/analizar",
        json={"frame_base64": img_base64, "confianza_minima": 0.3},
        headers={"Authorization": f"Bearer {token}"},
    )
    print("Detección status:", resp.status_code)
    print(resp.json())
else:
    print("Error en login:", login_resp.text)