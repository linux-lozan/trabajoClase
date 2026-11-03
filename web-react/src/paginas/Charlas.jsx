import { useState } from "react";
import { useBD } from "../datos/bd.jsx";
import { ahora, codigoReserva, formatoFecha, plazasLibres, ponentesDe, registrarEmail, reservasActivas, sala, siguienteId } from "../datos/consultas.js";
import { CabPagina } from "../componentes/CabPagina.jsx";
import { Enlace } from "../componentes/efectos.jsx";
import { useTitulo } from "./useTitulo.js";

export default function Charlas() {
  const { bd, modificar, usuario, avisar, abrirLogin } = useBD();
  const [texto, setTexto] = useState("");
  const [fecha, setFecha] = useState("");
  const [idSala, setIdSala] = useState("");
  useTitulo("Charlas");

  const fechas = [...new Set(bd.charlas.map((c) => c.fecha))].sort();
  const busqueda = texto.trim().toLowerCase();

  const lista = bd.charlas
    .filter((c) => c.estado === "publicada")
    .filter((c) => !fecha || c.fecha === fecha)
    .filter((c) => !idSala || c.id_sala === Number(idSala))
    .filter((c) => {
      const nombres = ponentesDe(bd, c.id_charla).map((p) => p.nombre + " " + p.apellidos).join(" ");
      return (c.titulo + " " + nombres).toLowerCase().includes(busqueda);
    })
    .sort((a, b) => (a.fecha + a.hora_inicio).localeCompare(b.fecha + b.hora_inicio));

  function reservar(idCharla) {
    if (!usuario) { avisar("Inicia sesión para reservar plaza", true); abrirLogin(); return; }
    const charla = bd.charlas.find((c) => c.id_charla === idCharla);
    // Mismas reglas que la BD: aforo y una sola reserva activa por usuario y charla
    if (plazasLibres(bd, charla) <= 0) return avisar("La charla está completa", true);
    if (reservasActivas(bd, idCharla).some((r) => r.id_usuario === usuario.id_usuario)) return avisar("Ya tienes una reserva para esta charla", true);

    const reserva = { id_reserva: siguienteId(bd, "reservas", "id_reserva"), id_usuario: usuario.id_usuario, id_charla: idCharla, fecha_reserva: ahora(), estado: "confirmada" };
    modificar((b) => { b.reservas.push(reserva); registrarEmail(b, reserva, "confirmacion"); });
    avisar(`Reserva confirmada: ${codigoReserva(reserva.id_reserva)}`);
  }

  return (
    <>
      <CabPagina etiqueta="Agenda" titulo="Charlas">Filtra, consulta y reserva tu plaza en las charlas publicadas.</CabPagina>

      <section className="seccion">
        <div className="contenedor">
          <div className="filtros">
            <input type="search" placeholder="Buscar por título o ponente..." value={texto} onChange={(e) => setTexto(e.target.value)} />
            <select value={fecha} onChange={(e) => setFecha(e.target.value)}>
              <option value="">Todas las fechas</option>
              {fechas.map((f) => <option key={f} value={f}>{formatoFecha(f)}</option>)}
            </select>
            <select value={idSala} onChange={(e) => setIdSala(e.target.value)}>
              <option value="">Todas las salas</option>
              {bd.salas.map((s) => <option key={s.id_sala} value={s.id_sala}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="rejilla-3">
            {lista.map((c) => {
              const libres = plazasLibres(bd, c);
              const ocupacion = Math.round(((c.aforo_maximo - libres) / c.aforo_maximo) * 100);
              const yaReservada = usuario && reservasActivas(bd, c.id_charla).some((r) => r.id_usuario === usuario.id_usuario);
              const s = sala(bd, c.id_sala);
              return (
                <article className="tarjeta charla" key={c.id_charla}>
                  <span className="chip">{formatoFecha(c.fecha)} · {c.hora_inicio}–{c.hora_fin}</span>
                  <h3>{c.titulo}</h3>
                  <p>{c.descripcion}</p>
                  <p className="meta">🎤 {ponentesDe(bd, c.id_charla).map((p, i) => (
                    <span key={p.id_ponente}>{i > 0 && ", "}<Enlace to={`/ponentes?p=${p.id_ponente}`}>{p.nombre} {p.apellidos}</Enlace></span>
                  ))}</p>
                  <p className="meta">📍 {s.nombre} ({s.ubicacion})</p>
                  <div className={"barra" + (libres <= 0 ? " llena" : "")}><span style={{ width: ocupacion + "%" }} /></div>
                  <div className="charla-pie">
                    <span className="meta">{Math.max(libres, 0)} de {c.aforo_maximo} plazas libres</span>
                    {yaReservada ? <span className="chip ok">Reservada ✔</span>
                      : libres <= 0 ? <button className="btn btn-peq" disabled>Completo</button>
                      : <button className="btn btn-peq" onClick={() => reservar(c.id_charla)}>Reservar</button>}
                  </div>
                </article>
              );
            })}
          </div>
          {lista.length === 0 && <p className="centrado">No hay charlas que coincidan con la búsqueda.</p>}
        </div>
      </section>
    </>
  );
}
