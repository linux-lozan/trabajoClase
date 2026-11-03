import { Fragment, useEffect, useState } from "react";
import { useBD } from "../datos/bd.jsx";
import { Enlace, Titular } from "../componentes/efectos.jsx";
import { Logo3D } from "../componentes/Logo3D.jsx";
import { useTitulo } from "./useTitulo.js";

// Cifra que cuenta desde 0 hasta su valor.
function Contador({ valor }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const paso = Math.max(1, Math.ceil(valor / 40));
    const intervalo = setInterval(() => setN((x) => {
      const sig = Math.min(valor, x + paso);
      if (sig === valor) clearInterval(intervalo);
      return sig;
    }), 25);
    return () => clearInterval(intervalo);
  }, [valor]);
  return <strong>{n}</strong>;
}

const MARQUESINA = ["Meetups", "Congresos", "Hackathons", "Jornadas universitarias", "Entradas con QR", "Control de aforo"];

export default function Inicio() {
  const { bd } = useBD();
  useTitulo("AdiTech Events · Gestión de eventos tecnológicos", true);

  const stats = [
    [bd.charlas.filter((c) => c.estado === "publicada").length, "Charlas"],
    [bd.ponentes.length, "Ponentes"],
    [bd.salas.length, "Salas"],
    [bd.charlas.reduce((t, c) => t + c.aforo_maximo, 0), "Plazas"],
  ];

  return (
    <>
      <section className="hero">
        <div className="contenedor hero-grid">
          <div>
            <p className="etiqueta">Software para eventos tecnológicos</p>
            <Titular>Organiza tu evento tech <span className="resaltado">sin perder el control</span></Titular>
            <p className="lead">AdiTech Events es la plataforma web para gestionar charlas, ponentes, salas, reservas de asistentes y validación de entradas con código QR. Todo desde el navegador.</p>
            <div className="acciones">
              <Enlace to="/charlas" className="btn">Ver la agenda</Enlace>
              <Enlace to="/planes" className="btn btn-sec">Ver planes</Enlace>
            </div>
          </div>
          <div className="hero-visual">
            <Logo3D />
          </div>
        </div>
      </section>

      <div className="marquesina" aria-hidden="true">
        <div className="pista">
          {[0, 1].map((k) => (
            <span key={k}>{MARQUESINA.map((t) => <Fragment key={t}>{t}<em>✦</em></Fragment>)}</span>
          ))}
        </div>
      </div>

      <div className="contenedor">
        <div className="stats">
          {stats.map(([valor, texto]) => <div key={texto}><Contador valor={valor} /><small>{texto}</small></div>)}
        </div>
      </div>

      <section className="seccion">
        <div className="contenedor">
          <h2>Una aplicación, cuatro perfiles</h2>
          <p className="sub">Cada usuario accede con su rol y ve solo lo que necesita.</p>
          <div className="rejilla-4">
            <article className="tarjeta"><div className="icono">🛡️</div><h3>Administrador</h3><p>Gestión completa del sistema: usuarios, roles, salas y configuración.</p></article>
            <article className="tarjeta"><div className="icono">🗓️</div><h3>Organizador</h3><p>Crea y publica charlas, asigna ponentes y salas, y controla el aforo.</p></article>
            <article className="tarjeta"><div className="icono">📷</div><h3>Personal</h3><p>Valida la entrada de los asistentes escaneando su código QR.</p></article>
            <article className="tarjeta"><div className="icono">🎟️</div><h3>Asistente</h3><p>Consulta la agenda, reserva plaza y recibe confirmación por email.</p></article>
          </div>
        </div>
      </section>

      <section className="seccion alt">
        <div className="contenedor">
          <h2>¿Por qué AdiTech Events?</h2>
          <p className="sub">Pensado para meetups, congresos, hackathons y jornadas universitarias.</p>
          <div className="rejilla-3">
            <article className="tarjeta"><div className="icono">📊</div><h3>Control de aforo</h3><p>Las reservas se bloquean automáticamente al completarse la capacidad de cada charla.</p></article>
            <article className="tarjeta"><div className="icono">✉️</div><h3>Notificaciones</h3><p>Emails automáticos de confirmación, cancelación y recordatorio para cada asistente.</p></article>
            <article className="tarjeta"><div className="icono">🔒</div><h3>Sin duplicados</h3><p>Cada usuario solo puede tener una reserva activa por charla, garantizado por la base de datos.</p></article>
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor cta">
          <h2>¿Preparas tu próximo evento?</h2>
          <p>Te enseñamos la plataforma en funcionamiento con una demo personalizada.</p>
          <Enlace to="/contacto" className="btn">Solicitar demo</Enlace>
        </div>
      </section>
    </>
  );
}
