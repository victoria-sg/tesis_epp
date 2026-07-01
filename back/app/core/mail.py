import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings


class EnvioCorreoError(Exception):
    """Se lanza cuando el correo no pudo enviarse (SMTP mal configurado, etc.)."""


def _texto_plano(enlace: str) -> str:
    return (
        "Recibimos una solicitud para restablecer tu contraseña en EPP Monitor.\n\n"
        "Abre el siguiente enlace para definir una nueva contraseña:\n"
        f"{enlace}\n\n"
        f"Este enlace expira en {settings.RESET_TOKEN_EXPIRE_MINUTES} minutos "
        "y solo puede usarse una vez.\n\n"
        "Si tú no solicitaste este cambio, puedes ignorar este correo: "
        "tu contraseña actual seguirá funcionando con normalidad."
    )


def _html(enlace: str) -> str:
    return f"""\
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#eef1f5; font-family:Segoe UI, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1f5; padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:480px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 18px rgba(15,39,68,0.12);">

            <tr>
              <td align="center" bgcolor="#0f2744" style="background-color:#0f2744; background-image:linear-gradient(135deg,#0a1628,#0f2744,#1a3a5c); padding:28px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <div style="width:36px; height:36px; border-radius:10px; background-color:#3b82f6; background-image:linear-gradient(135deg,#3b82f6,#1d4ed8); text-align:center; line-height:36px; font-size:18px;">🛡️</div>
                    </td>
                    <td>
                      <span style="color:#ffffff; font-size:16px; font-weight:800; letter-spacing:0.04em;">EPP MONITOR</span><br/>
                      <span style="color:rgba(255,255,255,0.55); font-size:10px; letter-spacing:0.12em; text-transform:uppercase;">Sistema de Seguridad</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 36px 28px 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:18px;">
                      <div style="width:56px; height:56px; border-radius:16px; background-color:#7c3aed; background-image:linear-gradient(135deg,#8b5cf6,#7c3aed); text-align:center; line-height:56px; font-size:26px;">🔐</div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:8px; font-size:20px; font-weight:700; color:#0f172a;">
                      Recuperación de contraseña
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:26px; font-size:14px; line-height:1.6; color:#6b6b6b;">
                      Recibimos una solicitud para restablecer tu contraseña en EPP&nbsp;Monitor. Si fuiste tú, define una nueva contraseña con el siguiente botón.
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:26px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#7c3aed" style="background-color:#7c3aed; background-image:linear-gradient(135deg,#7c3aed,#6d28d9); border-radius:8px;">
                            <a href="{enlace}" target="_blank" style="display:inline-block; padding:14px 32px; font-size:14px; font-weight:600; letter-spacing:0.02em; color:#ffffff; text-decoration:none;">
                              Definir nueva contraseña
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:6px; font-size:12px; color:#9a9a9a;">
                      Este enlace expira en {settings.RESET_TOKEN_EXPIRE_MINUTES} minutos y solo puede usarse una vez.
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:12px; color:#9a9a9a; word-break:break-all;">
                      ¿El botón no funciona? Copia y pega este enlace:<br/>
                      <a href="{enlace}" target="_blank" style="color:#7c3aed;">{enlace}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 36px; background-color:#f5f5f5; font-size:12px; color:#9a9a9a; text-align:center;">
                Si tú no solicitaste este cambio, puedes ignorar este correo: tu contraseña actual seguirá funcionando con normalidad.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


def enviar_correo_recuperacion(destinatario: str, token: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise EnvioCorreoError(
            "SMTP no está configurado. Define SMTP_USER y SMTP_PASSWORD en el .env"
        )

    enlace = f"{settings.FRONTEND_URL}/reset-password/confirmar?token={token}"

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = "Recuperación de contraseña - EPP Monitor"
    mensaje["From"] = settings.SMTP_FROM or settings.SMTP_USER
    mensaje["To"] = destinatario

    mensaje.attach(MIMEText(_texto_plano(enlace), "plain", "utf-8"))
    mensaje.attach(MIMEText(_html(enlace), "html", "utf-8"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as servidor:
        servidor.starttls()
        servidor.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        servidor.sendmail(mensaje["From"], [destinatario], mensaje.as_string())


def _html_bienvenida(nombre: str, correo: str, contrasena: str) -> str:
    return f"""\
<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#eef1f5; font-family:Segoe UI, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef1f5; padding:32px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="width:480px; max-width:480px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 18px rgba(15,39,68,0.12);">
            <tr>
              <td align="center" bgcolor="#0f2744" style="background-color:#0f2744; background-image:linear-gradient(135deg,#0a1628,#0f2744,#1a3a5c); padding:28px 24px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:10px;">
                      <div style="width:36px; height:36px; border-radius:10px; background-color:#3b82f6; background-image:linear-gradient(135deg,#3b82f6,#1d4ed8); text-align:center; line-height:36px; font-size:18px;">🛡️</div>
                    </td>
                    <td>
                      <span style="color:#ffffff; font-size:16px; font-weight:800; letter-spacing:0.04em;">EPP MONITOR</span><br/>
                      <span style="color:rgba(255,255,255,0.55); font-size:10px; letter-spacing:0.12em; text-transform:uppercase;">Sistema de Seguridad</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 36px 28px 36px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:18px;">
                      <div style="width:56px; height:56px; border-radius:16px; background-color:#7c3aed; background-image:linear-gradient(135deg,#8b5cf6,#7c3aed); text-align:center; line-height:56px; font-size:26px;">👋</div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:8px; font-size:20px; font-weight:700; color:#0f172a;">
                      ¡Bienvenido/a, {nombre}!
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding-bottom:24px; font-size:14px; line-height:1.6; color:#6b6b6b;">
                      Tu cuenta en EPP&nbsp;Monitor ha sido creada. A continuación encontrarás tus credenciales de acceso.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ff; border-radius:10px; border:1px solid #ede9fe;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <div style="font-size:11px; color:#7c3aed; text-transform:uppercase; letter-spacing:0.1em; font-weight:600; margin-bottom:10px;">Tus credenciales</div>
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                              <tr>
                                <td style="font-size:12px; color:#6b6b6b; padding-bottom:6px; width:110px;">Correo:</td>
                                <td style="font-size:13px; color:#0f172a; font-weight:600; padding-bottom:6px;">{correo}</td>
                              </tr>
                              <tr>
                                <td style="font-size:12px; color:#6b6b6b;">Contraseña:</td>
                                <td style="font-size:15px; color:#7c3aed; font-weight:700; font-family:Courier New, monospace; letter-spacing:0.08em;">{contrasena}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-size:12px; color:#9a9a9a; line-height:1.6;">
                      Por seguridad, te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez usando la opción "¿Olvidaste tu contraseña?" en la pantalla de acceso.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 36px; background-color:#f5f5f5; font-size:12px; color:#9a9a9a; text-align:center;">
                Si no esperabas este correo, contacta al administrador del sistema.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""


def enviar_correo_bienvenida(destinatario: str, nombre: str, contrasena: str) -> None:
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise EnvioCorreoError(
            "SMTP no está configurado. Define SMTP_USER y SMTP_PASSWORD en el .env"
        )

    cuerpo_plano = (
        f"Bienvenido/a {nombre} a EPP Monitor.\n\n"
        f"Tus credenciales de acceso:\n"
        f"  Correo:     {destinatario}\n"
        f"  Contraseña: {contrasena}\n\n"
        "Por seguridad, te recomendamos cambiar tu contraseña después de "
        "iniciar sesión por primera vez."
    )

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = "Bienvenido/a a EPP Monitor - Tus credenciales de acceso"
    mensaje["From"] = settings.SMTP_FROM or settings.SMTP_USER
    mensaje["To"] = destinatario

    mensaje.attach(MIMEText(cuerpo_plano, "plain", "utf-8"))
    mensaje.attach(MIMEText(_html_bienvenida(nombre, destinatario, contrasena), "html", "utf-8"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as servidor:
        servidor.starttls()
        servidor.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        servidor.sendmail(mensaje["From"], [destinatario], mensaje.as_string())