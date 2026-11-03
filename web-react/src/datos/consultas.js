/*
 * Consultas sobre la "base de datos" (equivalentes a SELECT / JOIN de la BD `sabitech`).
 * Todas son funciones puras: reciben `bd` y no la modifican.
 */

export function formatoFecha(iso) {
  return new Date(iso + "T00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}
export const ahora = () => new Date().toISOString().slice(0, 16).replace("T", " ");
export const codigoReserva = (id) => "ADI-" + String(id).padStart(5, "0");
export const siguienteId = (bd, tabla, campo) => bd[tabla].reduce((max, f) => Math.max(max, f[campo]), 0) + 1;

export const sala = (bd, id) => bd.salas.find((s) => s.id_sala === id);
export const rolDe = (bd, u) => bd.roles.find((r) => r.id_rol === u.id_rol).nombre;
export const ponentesDe = (bd, idCharla) => bd.charla_ponente
  .filter((cp) => cp.id_charla === idCharla)
  .map((cp) => bd.ponentes.find((p) => p.id_ponente === cp.id_ponente));
export const charlasDe = (bd, idPonente) => bd.charla_ponente
  .filter((cp) => cp.id_ponente === idPonente)
  .map((cp) => bd.charlas.find((c) => c.id_charla === cp.id_charla));
export const reservasActivas = (bd, idCharla) => bd.reservas.filter((r) => r.id_charla === idCharla && r.estado !== "cancelada");
export const plazasLibres = (bd, c) => c.aforo_maximo - reservasActivas(bd, c.id_charla).length;

// Registra el email "enviado" (tabla notificaciones_email). Modifica la copia de trabajo de la BD.
export function registrarEmail(bd, reserva, tipo) {
  const u = bd.usuarios.find((x) => x.id_usuario === reserva.id_usuario);
  bd.notificaciones_email.push({
    id_email: siguienteId(bd, "notificaciones_email", "id_email"), id_reserva: reserva.id_reserva,
    destinatario: u.email, tipo, fecha_envio: ahora(), estado_envio: "enviado"
  });
}
