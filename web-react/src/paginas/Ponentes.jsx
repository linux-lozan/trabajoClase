import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useBD } from "../datos/bd.jsx";
import { charlasDe, formatoFecha } from "../datos/consultas.js";
import { CabPagina } from "../componentes/CabPagina.jsx";
import { Enlace } from "../componentes/efectos.jsx";
import { useTitulo } from "./useTitulo.js";

function Ponente({ p, abiertoInicial }) {
  const { bd } = useBD();
  const [abierto, setAbierto] = useState(abiertoInicial);
  const detalle = useRef(null);
  const tarjeta = useRef(null);
  const charlas = charlasDe(bd, p.id_ponente).filter((c) => c && c.estado === "publicada");

  // Desplegable con altura animada.
  useLayoutEffect(() => {
    detalle.current.style.maxHeight = abierto ? detalle.current.scrollHeight + "px" : "0";
  }, [abierto]);

  // Si se llega desde una charla (/ponentes?p=3) se centra su ficha.
  useEffect(() => {
    if (!abiertoInicial) return;
    const t = setTimeout(() => tarjeta.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    return () => clearTimeout(t);
  }, [abiertoInicial]);

  return (
    <article className="tarjeta ponente" id={`ponente-${p.id_ponente}`} ref={tarjeta}>
      <div className="ponente-cab">
        <div className="avatar">{p.nombre[0] + p.apellidos[0]}</div>
        <div>
          <h3>{p.nombre} {p.apellidos}</h3>
          <p className="especialidad">{p.especialidad || ""}</p>
          <p className="meta">{p.cargo || ""}{p.experiencia ? ` · ${p.experiencia} años de experiencia` : ""}</p>
        </div>
      </div>
      <p>{p.biografia}</p>
      <button className="desplegar" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
        {abierto ? "Ocultar especialización " : "Ver especialización "}<span className="flecha">▾</span>
      </button>
      <div className="detalle" ref={detalle}>
        <div className="detalle-int">
          <h4>Especialización</h4>
          <p>{p.especializacion || "Información no disponible."}</p>
          {p.temas && <><h4>Áreas que domina</h4><ul>{p.temas.map((t) => <li key={t}>{t}</li>)}</ul></>}
          {p.tecnologias && <><h4>Tecnologías</h4><div className="etiquetas">{p.tecnologias.map((t) => <span className="chip" key={t}>{t}</span>)}</div></>}
          <h4>Charlas en el evento</h4>
          {charlas.length ? (
            <ul>{charlas.map((c) => <li key={c.id_charla}><Enlace to="/charlas">{c.titulo}</Enlace> · {formatoFecha(c.fecha)}, {c.hora_inicio}</li>)}</ul>
          ) : <p>Sin charlas programadas.</p>}
        </div>
      </div>
    </article>
  );
}

export default function Ponentes() {
  const { bd } = useBD();
  const [params] = useSearchParams();
  const elegido = Number(params.get("p"));
  useTitulo("Ponentes");

  return (
    <>
      <CabPagina etiqueta="Expertos" titulo="Ponentes">Conoce a los profesionales que participan en nuestros eventos y su especialización.</CabPagina>
      <section className="seccion">
        <div className="contenedor">
          <div className="ponentes-lista">
            {bd.ponentes.map((p) => <Ponente key={`${p.id_ponente}-${elegido}`} p={p} abiertoInicial={p.id_ponente === elegido} />)}
          </div>
        </div>
      </section>
    </>
  );
}
