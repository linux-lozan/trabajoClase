import { useLayoutEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router";
import { ProveedorBD } from "./datos/bd.jsx";
import { Cursor, Transiciones, useRevelar } from "./componentes/efectos.jsx";
import { Aviso, Cabecera, Pie } from "./componentes/Estructura.jsx";
import { Modal } from "./componentes/Modal.jsx";
import Inicio from "./paginas/Inicio.jsx";
import Charlas from "./paginas/Charlas.jsx";
import Ponentes from "./paginas/Ponentes.jsx";
import Planes from "./paginas/Planes.jsx";
import Panel from "./paginas/Panel.jsx";
import Contacto from "./paginas/Contacto.jsx";

function Paginas() {
  const { pathname } = useLocation();
  useRevelar();
  // Cada página empieza arriba.
  useLayoutEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <Cabecera />
      <main key={pathname}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/charlas" element={<Charlas />} />
          <Route path="/ponentes" element={<Ponentes />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Pie />
      <Modal />
      <Aviso />
      <Cursor />
    </>
  );
}

export default function App() {
  return (
    <ProveedorBD>
      {/* HashRouter: la web funciona en cualquier servidor estático, sin configurar rutas. */}
      <HashRouter>
        <Transiciones>
          <Paginas />
        </Transiciones>
      </HashRouter>
    </ProveedorBD>
  );
}
