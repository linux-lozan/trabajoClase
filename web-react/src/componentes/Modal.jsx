import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useBD } from "../datos/bd.jsx";
import { ahora, codigoReserva, formatoFecha, rolDe, sala, siguienteId } from "../datos/consultas.js";
import { QR } from "./QR.jsx";

export function Modal() {
  const { modal, cerrarModal } = useBD();

  useEffect(() => {
    const alPulsar = (e) => { if (e.key === "Escape") cerrarModal(); };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  });

  return (
    <div
      id="modal"
      className={"modal" + (modal ? "" : " oculto")}
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) cerrarModal(); }}
    >
      <div className="modal-caja">
        <button className="cerrar" aria-label="Cerrar" onClick={cerrarModal}>&times;</button>
        <div>
          {modal?.tipo === "login" && <Acceso key={modal.pestana} pestana={modal.pestana} />}
          {modal?.tipo === "qr" && <Entrada idReserva={modal.idReserva} />}
        </div>
      </div>
    </div>
  );
}

// ---------- Inicio de sesión y registro ----------
function Acceso({ pestana }) {
  const { bd, modificar, iniciarSesion, abrirLogin, cerrarModal, avisar } = useBD();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [msg, setMsg] = useState("");

  const irAlPanel = () => { cerrarModal(); navigate("/panel"); window.scrollTo(0, 0); };

  const login = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim().toLowerCase();
    const u = bd.usuarios.find((x) => x.email === email && x.password === form.password.value && x.activo);
    if (!u) return setMsg("Email o contraseña incorrectos");
    iniciarSesion(u.id_usuario);
    // El asistente sigue donde estaba (p. ej. reservando); el resto va a su panel
    if (rolDe(bd, u) === "asistente" && pathname === "/charlas") { cerrarModal(); avisar(`Bienvenido/a, ${u.nombre}`); }
    else irAlPanel();
  };

  const registro = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim().toLowerCase();
    if (!form.checkValidity()) return setMsg("Revisa los campos del formulario");
    if (bd.usuarios.some((u) => u.email === email)) return setMsg("Ese email ya está registrado");
    const id = siguienteId(bd, "usuarios", "id_usuario");
    modificar((b) => b.usuarios.push({
      id_usuario: id, id_rol: 4, nombre: form.nombre.value.trim(), apellidos: form.apellidos.value.trim(),
      email, password: form.password.value, activo: 1, fecha_registro: ahora()
    }));
    iniciarSesion(id);
    irAlPanel();
  };

  return (
    <>
      <div className="pestanas">
        <button className={pestana === "login" ? "activa" : ""} onClick={() => abrirLogin("login")}>Iniciar sesión</button>
        <button className={pestana === "registro" ? "activa" : ""} onClick={() => abrirLogin("registro")}>Registrarse</button>
      </div>
      {pestana === "login" ? (
        <>
          <form className="formulario" onSubmit={login}>
            <label>Email <input type="email" name="email" required /></label>
            <label>Contraseña <input type="password" name="password" required /></label>
            <button className="btn">Entrar</button>
            <p className={"msg-form" + (msg ? " ko" : "")}>{msg}</p>
          </form>
          <p className="ayuda">Usuarios de prueba: asistente@aditech.es / user123 · personal@aditech.es / staff123 · organizador@aditech.es / org123 · admin@aditech.es / admin123</p>
        </>
      ) : (
        <form className="formulario" onSubmit={registro}>
          <label>Nombre <input name="nombre" required /></label>
          <label>Apellidos <input name="apellidos" required /></label>
          <label>Email <input type="email" name="email" required /></label>
          <label>Contraseña (mín. 6 caracteres) <input type="password" name="password" minLength={6} required /></label>
          <button className="btn">Crear cuenta</button>
          <p className={"msg-form" + (msg ? " ko" : "")}>{msg}</p>
        </form>
      )}
    </>
  );
}

// ---------- Entrada con QR ----------
function Entrada({ idReserva }) {
  const { bd } = useBD();
  const r = bd.reservas.find((x) => x.id_reserva === idReserva);
  if (!r) return null;
  const c = bd.charlas.find((x) => x.id_charla === r.id_charla);
  const codigo = codigoReserva(r.id_reserva);
  return (
    <>
      <h3>Tu entrada</h3>
      <p>{c.titulo}</p>
      <p className="meta">{formatoFecha(c.fecha)} · {c.hora_inicio} · {sala(bd, c.id_sala).nombre}</p>
      <QR texto={codigo} />
      <p className="centrado codigo">{codigo}</p>
      <p className="ayuda centrado">Muestra este código en la entrada.</p>
    </>
  );
}
