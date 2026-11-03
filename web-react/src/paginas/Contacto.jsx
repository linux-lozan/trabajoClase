import { useState } from "react";
import { CabPagina } from "../componentes/CabPagina.jsx";
import { useTitulo } from "./useTitulo.js";

export default function Contacto() {
  const [msg, setMsg] = useState({ texto: "", ok: false });
  useTitulo("Contacto");

  function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;
    let ok = true;
    [...form.elements].forEach((el) => {
      if (el.name && el.required) {
        const valido = el.checkValidity() && el.value.trim() !== "";
        el.classList.toggle("invalido", !valido);
        ok = ok && valido;
      }
    });
    if (!ok) return setMsg({ texto: "Por favor, rellena correctamente todos los campos.", ok: false });
    setMsg({ texto: `¡Gracias, ${form.nombre.value.trim()}! Te responderemos lo antes posible.`, ok: true });
    form.reset();
  }

  return (
    <>
      <CabPagina etiqueta="Hablemos" titulo="Contacto">Cuéntanos qué evento preparas y te ayudamos a organizarlo.</CabPagina>
      <section className="seccion">
        <div className="contenedor contacto-grid">
          <div className="contacto-info">
            <h2>Estamos a tu disposición</h2>
            <p>¿Organizas un evento tecnológico? Te preparamos una demo personalizada de la plataforma sin compromiso.</p>
            <p>📧 info@aditech.es</p>
            <p>📞 +34 900 000 000</p>
            <p>📍 Proyecto final · 2º DAW</p>
          </div>
          <form className="formulario caja" noValidate onSubmit={enviar}>
            <label>Nombre <input type="text" name="nombre" required /></label>
            <label>Email <input type="email" name="email" required /></label>
            <label>Tipo de evento
              <select name="tipo">
                <option>Meetup</option><option>Congreso</option><option>Hackathon</option><option>Jornada universitaria</option><option>Otro</option>
              </select>
            </label>
            <label>Mensaje <textarea name="mensaje" rows={5} required /></label>
            <button className="btn" type="submit">Enviar mensaje</button>
            <p className={"msg-form" + (msg.texto ? (msg.ok ? " ok" : " ko") : "")}>{msg.texto}</p>
          </form>
        </div>
      </section>
    </>
  );
}
