from ultralytics import YOLO
import os

# Descarga automáticamente el modelo base la primera vez
model = YOLO("yolov8n.pt")

# Prueba con una imagen del dataset descargado
carpeta_test = "./datasets/construction-site-safety/test/images"
imagenes = os.listdir(carpeta_test)[:3]

for img_name in imagenes:
    img_path = os.path.join(carpeta_test, img_name)
    results = model(img_path)

    for r in results:
        print(f"\n--- {img_name} ---")
        for box in r.boxes:
            clase = model.names[int(box.cls)]
            confianza = float(box.conf)
            print(f"  Detectado: {clase} ({confianza:.2%})")

print("\n✅ Inferencia completada correctamente.")