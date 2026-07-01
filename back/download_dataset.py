from roboflow import Roboflow

rf = Roboflow(api_key="McXdcJWVHB0N9D7B7U22")
project = rf.workspace("roboflow-universe-projects").project("construction-site-safety")
version = project.version(30)
dataset = version.download("yolov8", location="./datasets/construction-site-safety")

print(f"Dataset descargado en: {dataset.location}")