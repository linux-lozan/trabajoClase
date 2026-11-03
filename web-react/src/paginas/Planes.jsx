import { CabPagina } from "../componentes/CabPagina.jsx";
import { Enlace } from "../componentes/efectos.jsx";
import { useTitulo } from "./useTitulo.js";

const PLANES = [
  { nombre: "Meetup", precio: "0 €", mes: true, ventajas: ["1 evento activo", "Hasta 100 asistentes", "Reservas online", "Soporte por email"], boton: "Empezar" },
  { nombre: "Pro", precio: "49 €", mes: true, destacado: true, ventajas: ["Eventos ilimitados", "Hasta 2.000 asistentes", "Validación de entradas QR", "Emails automáticos", "Estadísticas de asistencia"], boton: "Solicitar demo" },
  { nombre: "Enterprise", precio: "A medida", ventajas: ["Multisede", "Integraciones y API", "Marca personalizada", "Soporte dedicado 24/7"], boton: "Hablemos" },
];

export default function Planes() {
  useTitulo("Planes");
  return (
    <>
      <CabPagina etiqueta="Precios" titulo="Planes">Licencias pensadas para meetups, congresos y universidades.</CabPagina>
      <section className="seccion">
        <div className="contenedor rejilla-3">
          {PLANES.map((p) => (
            <article key={p.nombre} className={"plan" + (p.destacado ? " destacado" : "")}>
              {p.destacado && <span className="cinta">Más popular</span>}
              <h3>{p.nombre}</h3>
              <p className="precio">{p.precio}{p.mes && <small>/mes</small>}</p>
              <ul>{p.ventajas.map((v) => <li key={v}>{v}</li>)}</ul>
              <Enlace to="/contacto" className={"btn" + (p.destacado ? "" : " btn-sec")}>{p.boton}</Enlace>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
