/*
 * Estado global de la aplicación: "base de datos" en localStorage, sesión,
 * avisos (toast) y modal. Sustituye a las variables globales de la versión HTML.
 */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { DB_INICIAL } from "./datos.js";

const CLAVE_BD = "aditech_bd_v2";
const CLAVE_SESION = "aditech_sesion";

const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const escribir = (k, v) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch { /* sin almacenamiento */ }
};

function cargarBD() {
  try {
    const guardada = leer(CLAVE_BD);
    if (guardada) return JSON.parse(guardada);
  } catch { /* datos corruptos: se usan los iniciales */ }
  return structuredClone(DB_INICIAL);
}

const Ctx = createContext(null);

export function ProveedorBD({ children }) {
  const [bd, setBd] = useState(cargarBD);
  const [idSesion, setIdSesion] = useState(() => Number(leer(CLAVE_SESION)) || null);
  const [aviso, setAviso] = useState({ texto: "", error: false, visible: false });
  const [modal, setModal] = useState(null); // null | { tipo: "login", pestana } | { tipo: "qr", idReserva }
  const temporizador = useRef();

  // Aplica cambios sobre una copia de la BD y la guarda (equivale a INSERT/UPDATE).
  const modificar = useCallback((fn) => {
    setBd((actual) => {
      const copia = structuredClone(actual);
      fn(copia);
      escribir(CLAVE_BD, JSON.stringify(copia));
      return copia;
    });
  }, []);

  const avisar = useCallback((texto, error = false) => {
    setAviso({ texto, error, visible: true });
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 3000);
  }, []);

  const iniciarSesion = useCallback((id) => { escribir(CLAVE_SESION, String(id)); setIdSesion(id); }, []);
  const cerrarSesion = useCallback(() => { escribir(CLAVE_SESION, null); setIdSesion(null); }, []);
  const restablecer = useCallback(() => {
    escribir(CLAVE_BD, null); escribir(CLAVE_SESION, null);
    setBd(structuredClone(DB_INICIAL)); setIdSesion(null);
  }, []);

  const usuario = useMemo(() => bd.usuarios.find((u) => u.id_usuario === idSesion) || null, [bd, idSesion]);

  const valor = {
    bd, modificar, usuario, iniciarSesion, cerrarSesion, restablecer,
    aviso, avisar, modal,
    abrirLogin: (pestana = "login") => setModal({ tipo: "login", pestana }),
    verQR: (idReserva) => setModal({ tipo: "qr", idReserva }),
    cerrarModal: () => setModal(null),
  };
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export const useBD = () => useContext(Ctx);
