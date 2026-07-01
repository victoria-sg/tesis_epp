import random
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app.models.alerta import Alerta
from app.models.resolucion_alerta import ResolucionAlerta

db = SessionLocal()

camaras = [1, 2, 3, 4]
comentarios = [
    'Trabajador sin casco en zona de riesgo, se llamó la atención.',
    'Operario sin chaleco reflectante, se le proporcionó el EPP.',
    'Personal sin guantes en área de maquinaria, se corrigió.',
    'Falta de botas de seguridad detectada, se solucionó.',
]

for i in range(10):
    camara_id = random.choice(camaras)
    fecha = datetime.utcnow() - timedelta(hours=random.randint(1, 72))
    estado = random.choice(['Resuelta', 'Resuelta', 'Resuelta', 'Pendiente'])

    alerta = Alerta(
        id_camara=camara_id,
        fecha_hora_deteccion=fecha,
        segundos_transcurridos=random.randint(10, 120),
        estado_alerta=estado,
    )
    db.add(alerta)
    db.commit()
    db.refresh(alerta)

    if estado == 'Resuelta':
        res = ResolucionAlerta(
            id_alerta=alerta.id_alerta,
            id_usuario=1,
            fecha_hora_resolucion=fecha + timedelta(minutes=random.randint(2, 15)),
            comentario=random.choice(comentarios),
        )
        db.add(res)
        db.commit()

print('10 alertas de prueba creadas correctamente.')
db.close()