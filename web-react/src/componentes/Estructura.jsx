import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useBD } from "../datos/bd.jsx";
import { Enlace } from "./efectos.jsx";

const LOGO = import.meta.env.BASE_URL + "Imagen1.png";
const ANIO = new Date().getFullYear();

const MENU = [
  ["/", "Inicio"],
  ["/charlas", "Charlas"],
  ["/ponentes", "Ponentes"],
  ["/planes", "Planes"],
  ["/contacto", "Contacto"],
];

function Logo({ alt = "" }) {
  return (
    <Enlace to="/" className="logo">
      <img src={LOGO} alt={alt} />ADITECH<span>EVENTS</span>
    </Enlace>
  );
}

export function Cabecera() {
  const { usuario, abrirLogin, cerrarSesion } = useBD();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [escondida, setEscondida] = useState(false);

  // Cabecera que se esconde al bajar y reaparece al subir.
  useEffect(() => {
    let ultimoY = scrollY;
    const alHacerScroll = () => {
      const y = scrollY;
      setEscondida(y > ultimoY && y > 140 && !abierto);
      ultimoY = y;
    };
    addEventListener("scroll", alHacerScroll, { passive: true });
    return () => removeEventListener("scroll", alHacerScroll);
  }, [abierto]);

  const salir = (e) => {
    e.preventDefault();
    cerrarSesion();
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <header id="cabecera" className={"cabecera" + (escondida ? " escondida" : "")}>
      <div className="contenedor nav">
        <Logo alt="Logo AdiTech" />
        <button className="menu-btn" aria-label="Abrir menú" aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>&#9776;</button>
        {/* Al pulsar cualquier enlace se cierra el menú móvil. */}
        <nav id="menu" className={abierto ? "abierto" : ""} onClick={(e) => { if (e.target.closest("a")) setAbierto(false); }}>
          {MENU.map(([ruta, texto]) => (
            <Enlace key={ruta} to={ruta} className={pathname === ruta ? "activo" : ""}>{texto}</Enlace>
          ))}
          {usuario ? (
            <>
              <Enlace to="/panel" className={pathname === "/panel" ? "activo" : ""}>Mi panel</Enlace>
              <a href="#" className="btn btn-sec btn-peq" onClick={salir}>Salir</a>
            </>
          ) : (
            <a href="#" className="btn btn-peq" onClick={(e) => { e.preventDefault(); abrirLogin(); }}>Acceder</a>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Pie() {
  return (
    <footer id="pie" className="pie">
      <div className="contenedor pie-grid">
        <Logo />
        <nav>{MENU.map(([ruta, texto]) => <Enlace key={ruta} to={ruta}>{texto}</Enlace>)}</nav>
        <p>© {ANIO} AdiTech Events · Proyecto final 2º DAW</p>
      </div>
    </footer>
  );
}

export function Aviso() {
  const { aviso } = useBD();
  return (
    <div className={"aviso" + (aviso.visible ? " visible" : "") + (aviso.error ? " error" : "")} role="status">
      {aviso.texto}
    </div>
  );
}
