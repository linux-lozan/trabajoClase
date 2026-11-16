import { useEffect, useState } from "react";
import { list } from "../api/charlasApi.js";
import {
  createReservation,
  getReservationCountForCharla,
} from "../api/reservasApi.js";
import { Notificacion } from "./Notificacion.jsx";
import { ApiError } from "../api/ApiError.js";

function formatearFecha(fecha) {
  if (!fecha) return "Fecha por confirmar";

  const fechaCorta = String(fecha).slice(0, 10);
  const fechaParseada = new Date(`${fechaCorta}T00:00:00`);
  if (Number.isNaN(fechaParseada.getTime())) return String(fecha);

  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(
    fechaParseada,
  );
}

export function Listadocharlas({
  onStatusChange,
  usuarioActual,
  soloReservadas = false,
}) {
  const [charlas, setCharlas] = useState([]);
  const [estado, setEstado] = useState("sin_cargar");
  const [error, setError] = useState("");
  const [notificacion, setNotificacion] = useState(null);
  const [reservasConteo, setReservasConteo] = useState({});
  const [reservandoId, setReservandoId] = useState(null);
  const [reservasUsuario, setReservasUsuario] = useState(new Set());
  const [reservasUsuarioCargadas, setReservasUsuarioCargadas] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarCharlas = async () => {
    setCargando(true);
    setError("");
    setEstado("cargando");

    try {
      const resultado = await list();
      setCharlas(resultado);
      setEstado("conectado");

      // Cargar conteo de reservas para cada charla
      resultado.forEach((charla) => {
        cargarConteoReservas(charla.id_charla);
      });
    } catch (requestError) {
      console.error("No se pudieron cargar las charlas:", requestError);
      setError(
        "No se pudo cargar la agenda. Comprueba que el servidor esté disponible.",
      );
      setEstado("error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuarioActual?.id_usuario) {
      cargarReservasUsuario();
    } else {
      setReservasUsuario(new Set());
      setReservasUsuarioCargadas(false);
    }
  }, [usuarioActual]);

  async function cargarConteoReservas(charlaId) {
    try {
      const conteo = await getReservationCountForCharla(charlaId);
      setReservasConteo((prev) => ({
        ...prev,
        [charlaId]: conteo.count || 0,
      }));
    } catch (err) {
      console.error("Error al cargar conteo de reservas:", err);
    }
  }

  async function cargarReservasUsuario() {
    try {
      const response = await fetch(
        `/api/reservas/usuario/${usuarioActual.id_usuario}`,
        {
          headers: { Accept: "application/json" },
        },
      );

      if (response.ok) {
        const reservas = await response.json();
        const ids = new Set(reservas.map((r) => r.id_charla));
        setReservasUsuario(ids);
        setReservasUsuarioCargadas(true);
        return;
      }

      setReservasUsuario(new Set());
      setReservasUsuarioCargadas(false);
    } catch (err) {
      console.error("Error al cargar reservas del usuario:", err);
      setReservasUsuario(new Set());
      setReservasUsuarioCargadas(false);
    }
  }

  async function manejarReserva(charla) {
    if (!usuarioActual?.id_usuario) {
      setNotificacion({
        tipo: "error",
        mensaje: "Debes iniciar sesión para reservar una charla.",
      });
      return;
    }

    const conteoActual = reservasConteo[charla.id_charla] || 0;

    if (conteoActual >= charla.aforo_maximo) {
      setNotificacion({
        tipo: "error",
        mensaje: `No se pudo reservar. El aforo está completo (${charla.aforo_maximo}/${charla.aforo_maximo}).`,
      });
      return;
    }

    setReservandoId(charla.id_charla);

    try {
      await createReservation(usuarioActual.id_usuario, charla.id_charla);

      setNotificacion({
        tipo: "exito",
        mensaje: "¡Reserva confirmada! Se ha guardado correctamente.",
      });

      // Actualizar conteo y reservas del usuario
      cargarConteoReservas(charla.id_charla);
      cargarReservasUsuario();
    } catch (err) {
      console.error("Error al crear reserva:", err);

      let mensaje = "No se pudo completar la reserva. Intenta de nuevo.";

      if (err instanceof ApiError) {
        mensaje = err.message;
      } else if (err.message) {
        mensaje = err.message;
      }

      setNotificacion({
        tipo: "error",
        mensaje,
      });
    } finally {
      setReservandoId(null);
    }
  }

  useEffect(() => {
    onStatusChange?.(estado);
  }, [estado, onStatusChange]);

  if (estado === "sin_cargar") {
    return (
      <div className="contenedor-carga-charlas">
        <p className="mensaje-carga">Pulsa para cargar las charlas.</p>
        <button
          className="boton boton-actualizar"
          onClick={cargarCharlas}
          disabled={cargando}
        >
          {cargando ? "Cargando charlas…" : "Cargar charlas"}
        </button>
      </div>
    );
  }

  if (estado === "cargando") {
    return (
      <p className="aviso-pagina" role="status">
        Cargando charlas…
      </p>
    );
  }

  if (estado === "error") {
    return (
      <div className="contenedor-error-charlas">
        <p className="aviso-pagina" role="alert">
          {error}
        </p>
        <button
          className="boton boton-actualizar"
          onClick={cargarCharlas}
          disabled={cargando}
        >
          {cargando ? "Reintentando…" : "Reintentar"}
        </button>
      </div>
    );
  }

  const charlasMostradas = soloReservadas
    ? charlas.filter((charla) => reservasUsuario.has(charla.id_charla))
    : charlas;

  if (!charlas.length) {
    return (
      <p className="aviso-pagina" role="status">
        No hay charlas disponibles.
      </p>
    );
  }

  if (soloReservadas && usuarioActual?.id_usuario && !reservasUsuarioCargadas) {
    return (
      <p className="aviso-pagina" role="status">
        Cargando tus reservas…
      </p>
    );
  }

  if (soloReservadas && !charlasMostradas.length) {
    return (
      <p className="aviso-pagina" role="status">
        No tienes ninguna charla reservada aún.
      </p>
    );
  }

  return (
    <>
      {notificacion && (
        <Notificacion
          tipo={notificacion.tipo}
          mensaje={notificacion.mensaje}
          onClose={() => setNotificacion(null)}
        />
      )}
      <div className="cabecera-charlas">
        <div className="info-charlas">
          <span className="total-charlas">
            {charlasMostradas.length} charla
            {charlasMostradas.length !== 1 ? "s" : ""} cargada
            {charlasMostradas.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          className="boton boton-actualizar-lista"
          onClick={cargarCharlas}
          disabled={cargando}
          title="Actualizar lista de charlas"
        >
          {cargando ? "⟳ Actualizando…" : "⟳ Actualizar"}
        </button>
      </div>
      <div className="lista-charlas" aria-live="polite">
        {charlasMostradas.map((charla, indice) => {
          const conteoActual = reservasConteo[charla.id_charla] || 0;
          const aforoLleno = conteoActual >= charla.aforo_maximo;
          const yaReservada = reservasUsuario.has(charla.id_charla);

          return (
            <article
              className="fila-charla"
              key={charla.id_charla ?? `${charla.titulo}-${indice}`}
            >
              <time
                className="hora-charla"
                dateTime={charla.hora_inicio || undefined}
              >
                {charla.hora_inicio?.slice(0, 5) || "--:--"}
              </time>
              <div className="detalle-charla">
                <span className="categoria">
                  {formatearFecha(charla.fecha)}
                </span>
                <h3>{charla.titulo || "Charla sin título"}</h3>
                <p>{charla.descripcion || "Sin descripción disponible."}</p>
              </div>
              <div className="acciones-charla">
                <span className="aforo-charla">
                  {charla.aforo_maximo == null
                    ? "Aforo no indicado"
                    : `Aforo: ${conteoActual}/${charla.aforo_maximo}`}
                </span>
                {usuarioActual && (
                  <button
                    className={`boton boton-reserva ${aforoLleno ? "boton-deshabilitado" : ""} ${yaReservada ? "boton-reservado" : ""}`}
                    onClick={() => manejarReserva(charla)}
                    disabled={
                      aforoLleno ||
                      yaReservada ||
                      reservandoId === charla.id_charla
                    }
                    aria-busy={reservandoId === charla.id_charla}
                  >
                    {reservandoId === charla.id_charla
                      ? "Reservando..."
                      : yaReservada
                        ? "Ya reservada"
                        : aforoLleno
                          ? "Aforo completo"
                          : "Reservar"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
