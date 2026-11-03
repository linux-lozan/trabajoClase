import { useState } from "react";
import { useNavigate } from "react-router";
import { useBD } from "../datos/bd.jsx";
import { ahora, codigoReserva, registrarEmail, reservasActivas, rolDe, sala, siguienteId } from "../datos/consultas.js";
import { Enlace, Titular } from "../componentes/efectos.jsx";
import { useTitulo } from "./useTitulo.js";

function EstadoChip({ estado }) {
  const clase = { confirmada: "ok", cancelada: "ko", pendiente: "pend", publicada: "ok", borrador: "pend", finalizada: "" }[estado] ?? "";
  return <span className={"chip " + clase}>{estado}</span>;
}

// ---------- Asistente: sus reservas ----------
function PanelAsistente() {
  const { bd, modificar, usuario, avisar, verQR } = useBD();
  const mias = bd.reservas.filter((r) => r.id_usuario === usuario.id_usuario).sort((a, b) => b.id_reserva - a.id_reserva);

  function cancelar(idReserva) {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    modificar((b) => {
      const r = b.reservas.find((x) => x.id_reserva === idReserva);
      r.estado = "cancelada";
      registrarEmail(b, r, "cancelacion");
    });
    avisar("Reserva cancelada");
  }

  if (!mias.length) return (
    <><p className="centrado">Aún no tienes reservas.</p><br /><p className="centrado"><Enlace to="/charlas" className="btn">Ver charlas</Enlace></p></>
  );
  return (
    <>
      <h3 className="panel-h3">Mis reservas</h3>
      <div className="tabla-wrap"><table><tbody>
        <tr><th>Código</th><th>Charla</th><th>Fecha</th><th>Estado</th><th>Asistencia</th><th></th></tr>
        {mias.map((r) => {
          const c = bd.charlas.find((x) => x.id_charla === r.id_charla);
          const asistio = bd.asistencias.some((a) => a.id_reserva === r.id_reserva);
          return (
            <tr key={r.id_reserva}>
              <td className="codigo">{codigoReserva(r.id_reserva)}</td><td>{c.titulo}</td><td>{c.fecha} {c.hora_inicio}</td>
              <td><EstadoChip estado={r.estado} /></td>
              <td>{asistio ? <span className="chip ok">Validada</span> : "—"}</td>
              <td>{r.estado !== "cancelada" && !asistio && (
                <><button className="btn btn-peq" onClick={() => verQR(r.id_reserva)}>Ver QR</button>{" "}
                  <button className="btn btn-peq btn-peligro" onClick={() => cancelar(r.id_reserva)}>Cancelar</button></>
              )}</td>
            </tr>
          );
        })}
      </tbody></table></div>
    </>
  );
}

// ---------- Personal: validación de entradas ----------
function PanelPersonal() {
  const { bd, modificar, usuario, avisar } = useBD();
  const ultimas = [...bd.asistencias].reverse().slice(0, 10);

  function validar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const id = Number(form.codigo.value.trim().toUpperCase().replace("ADI-", ""));
    const r = bd.reservas.find((x) => x.id_reserva === id);
    if (!r) return avisar("Código no encontrado", true);
    if (r.estado !== "confirmada") return avisar("La reserva no está confirmada", true);
    if (bd.asistencias.some((a) => a.id_reserva === id)) return avisar("Esta entrada ya fue validada", true);
    modificar((b) => b.asistencias.push({
      id_asistencia: siguienteId(b, "asistencias", "id_asistencia"), id_reserva: id,
      id_usuario_validador: usuario.id_usuario, fecha_hora_acceso: ahora(), resultado: "valida"
    }));
    avisar("Entrada válida ✔ Acceso permitido");
    form.reset();
  }

  return (
    <>
      <h3 className="centrado panel-h3">Validación de entradas</h3>
      <form className="validador" onSubmit={validar}>
        <input name="codigo" placeholder="Código del QR (ej. ADI-00004)" required />
        <button className="btn">Validar entrada</button>
      </form>
      <h3 className="panel-h3">Últimas validaciones</h3>
      {ultimas.length ? (
        <div className="tabla-wrap"><table><tbody>
          <tr><th>Código</th><th>Asistente</th><th>Charla</th><th>Hora</th></tr>
          {ultimas.map((a) => {
            const r = bd.reservas.find((x) => x.id_reserva === a.id_reserva);
            const u = bd.usuarios.find((x) => x.id_usuario === r.id_usuario);
            const c = bd.charlas.find((x) => x.id_charla === r.id_charla);
            return <tr key={a.id_asistencia}><td className="codigo">{codigoReserva(r.id_reserva)}</td><td>{u.nombre} {u.apellidos}</td><td>{c.titulo}</td><td>{a.fecha_hora_acceso}</td></tr>;
          })}
        </tbody></table></div>
      ) : <p className="meta">Todavía no se ha validado ninguna entrada.</p>}
    </>
  );
}

// ---------- Organizador: ocupación y nueva charla ----------
function PanelOrganizador() {
  const { bd, modificar, usuario, avisar } = useBD();
  const [msg, setMsg] = useState("");

  function crearCharla(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const s = sala(bd, Number(form.id_sala.value));
    const aforo = Number(form.aforo_maximo.value);
    let error = "";
    if (!form.checkValidity()) error = "Completa todos los campos obligatorios";
    else if (form.hora_fin.value <= form.hora_inicio.value) error = "La hora de fin debe ser posterior a la de inicio";
    else if (aforo > s.capacidad) error = `El aforo no puede superar la capacidad de la sala (${s.capacidad})`;
    else if (bd.charlas.some((c) => c.id_sala === s.id_sala && c.fecha === form.fecha.value && c.estado !== "cancelada" &&
      form.hora_inicio.value < c.hora_fin && form.hora_fin.value > c.hora_inicio)) error = "La sala ya está ocupada en ese horario";
    setMsg(error);
    if (error) return;

    const nueva = {
      id_charla: siguienteId(bd, "charlas", "id_charla"), id_organizador: usuario.id_usuario, id_sala: s.id_sala, titulo: form.titulo.value.trim(),
      descripcion: form.descripcion.value.trim(), fecha: form.fecha.value, hora_inicio: form.hora_inicio.value,
      hora_fin: form.hora_fin.value, aforo_maximo: aforo, estado: "publicada"
    };
    const idPonente = Number(form.id_ponente.value);
    modificar((b) => { b.charlas.push(nueva); b.charla_ponente.push({ id_charla: nueva.id_charla, id_ponente: idPonente }); });
    avisar("Charla publicada");
    form.reset();
  }

  return (
    <>
      <h3 className="panel-h3">Ocupación de charlas</h3>
      <div className="tabla-wrap"><table><tbody>
        <tr><th>Charla</th><th>Fecha</th><th>Sala</th><th>Reservas</th><th>Asistencias</th><th>Estado</th></tr>
        {bd.charlas.map((c) => {
          const res = reservasActivas(bd, c.id_charla);
          const asis = bd.asistencias.filter((a) => res.some((r) => r.id_reserva === a.id_reserva)).length;
          return (
            <tr key={c.id_charla}><td>{c.titulo}</td><td>{c.fecha} {c.hora_inicio}</td><td>{sala(bd, c.id_sala).nombre}</td>
              <td>{res.length} / {c.aforo_maximo}</td><td>{asis}</td><td><EstadoChip estado={c.estado} /></td></tr>
          );
        })}
      </tbody></table></div>

      <h3 className="panel-h3">Nueva charla</h3>
      <form className="formulario caja" onSubmit={crearCharla}>
        <label>Título <input name="titulo" required maxLength={200} /></label>
        <label>Descripción <textarea name="descripcion" rows={2} /></label>
        <label>Sala <select name="id_sala">{bd.salas.map((s) => <option key={s.id_sala} value={s.id_sala}>{s.nombre} ({s.capacidad} plazas)</option>)}</select></label>
        <label>Ponente <select name="id_ponente">{bd.ponentes.map((p) => <option key={p.id_ponente} value={p.id_ponente}>{p.nombre} {p.apellidos}</option>)}</select></label>
        <label>Fecha <input type="date" name="fecha" required /></label>
        <label>Hora inicio <input type="time" name="hora_inicio" required /></label>
        <label>Hora fin <input type="time" name="hora_fin" required /></label>
        <label>Aforo máximo <input type="number" name="aforo_maximo" min="1" required /></label>
        <button className="btn">Publicar charla</button>
        <p className={"msg-form" + (msg ? " ko" : "")}>{msg}</p>
      </form>
    </>
  );
}

// ---------- Administrador: usuarios ----------
function PanelAdmin() {
  const { bd, restablecer } = useBD();
  const navigate = useNavigate();
  return (
    <>
      <h3 className="panel-h3">Usuarios del sistema</h3>
      <div className="tabla-wrap"><table><tbody>
        <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Activo</th></tr>
        {bd.usuarios.map((u) => (
          <tr key={u.id_usuario}><td>{u.nombre} {u.apellidos}</td><td>{u.email}</td><td>{rolDe(bd, u)}</td>
            <td>{u.activo ? <span className="chip ok">sí</span> : <span className="chip ko">no</span>}</td></tr>
        ))}
      </tbody></table></div>
      <p className="centrado">
        <button className="btn btn-sec btn-peq" onClick={() => {
          if (!confirm("¿Restablecer todos los datos de la demo?")) return;
          restablecer(); navigate("/"); window.scrollTo(0, 0);
        }}>Restablecer datos de la demo</button>
      </p>
    </>
  );
}

export default function Panel() {
  const { bd, usuario, abrirLogin } = useBD();
  useTitulo("Mi panel");
  const rol = usuario && rolDe(bd, usuario);

  return (
    <>
      <section className="cab-pagina">
        <div className="contenedor">
          <p className="etiqueta">Área privada</p>
          <Titular key={usuario?.id_usuario ?? 0}>{usuario ? `Hola, ${usuario.nombre}` : "Mi panel"}</Titular>
          <p>{usuario ? `Has accedido como ${rol}.` : "Inicia sesión para acceder a tu área."}</p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          {!usuario ? (
            <><p className="centrado">Necesitas iniciar sesión para ver tu panel.</p><br />
              <p className="centrado"><button className="btn" onClick={() => abrirLogin()}>Iniciar sesión</button></p></>
          ) : (
            <>
              {rol === "asistente" && <PanelAsistente />}
              {rol === "personal" && <PanelPersonal />}
              {(rol === "organizador" || rol === "administrador") && <PanelOrganizador />}
              {rol === "administrador" && <PanelAdmin />}
            </>
          )}
        </div>
      </section>
    </>
  );
}
