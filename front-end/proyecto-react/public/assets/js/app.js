/* =========================================================
   AdiTech Events - lógica común a todas las páginas
   Catálogo, sesión y reservas proceden de la API de Laravel.
   ========================================================= */

const PAGINA = document.body.dataset.pagina;
let bd = {
  roles: [], usuarios: [], salas: [], ponentes: [], charlas: [],
  charla_ponente: [], reservas: [], asistencias: [], notificaciones_email: []
};
let usuarioSesion = null;

// ---------- Utilidades ----------
const $ = (sel) => document.querySelector(sel);

function esc(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function formatoFecha(iso) {
  return new Date(iso + "T00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}
function codigoReserva(id) { return "ADI-" + String(id).padStart(5, "0"); }

function aviso(texto, error = false) {
  const el = $("#aviso");
  el.textContent = texto;
  el.className = "aviso visible" + (error ? " error" : "");
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => el.classList.remove("visible"), 3000);
}

// ---------- Consultas (equivalentes a SELECT/JOIN) ----------
const sala = (id) => bd.salas.find((s) => s.id_sala === id);
const rolDe = (u) => u?.role?.nombre ?? bd.roles.find((r) => r.id_rol === u?.id_rol)?.nombre ?? "";
const ponentesDe = (idCharla) => bd.charla_ponente
  .filter((cp) => cp.id_charla === idCharla)
  .map((cp) => bd.ponentes.find((p) => p.id_ponente === cp.id_ponente))
  .filter(Boolean);
const charlasDe = (idPonente) => bd.charla_ponente
  .filter((cp) => cp.id_ponente === idPonente)
  .map((cp) => bd.charlas.find((c) => c.id_charla === cp.id_charla))
  .filter(Boolean);
const reservasActivas = (idCharla) => bd.reservas.filter((r) => r.id_charla === idCharla && r.estado !== "cancelada");
const plazasLibres = (c) => c.aforo_maximo - (c.reservas_activas_count ?? reservasActivas(c.id_charla).length);

function usuarioActual() {
  return usuarioSesion;
}

async function cargarDatosServidor() {
  const [charlas, ponentes, salas, usuario] = await Promise.all([
    AditechApi.getTalks(),
    AditechApi.getSpeakers(),
    AditechApi.getRooms(),
    AditechApi.getCurrentUser()
  ]);
  usuarioSesion = usuario;
  bd.charlas = charlas;
  bd.ponentes = ponentes;
  bd.salas = salas;
  bd.usuarios = usuario ? [usuario] : [];
  bd.roles = usuario?.role ? [usuario.role] : [];
  bd.charla_ponente = ponentes.flatMap((ponente) =>
    (ponente.charlas || []).map((charla) => ({
      id_charla: charla.id_charla,
      id_ponente: ponente.id_ponente
    }))
  );
  bd.reservas = usuario ? await AditechApi.getMyReservations() : [];
  for (const reservation of bd.reservas) {
    if (reservation.charla && !bd.charlas.some((talk) => talk.id_charla === reservation.id_charla)) {
      bd.charlas.push(reservation.charla);
    }
  }
  bd.asistencias = bd.reservas
    .filter((reserva) => reserva.asistencia)
    .map((reserva) => ({ id_reserva: reserva.id_reserva }));
}

// ---------- Cabecera, pie, modal y aviso (comunes a todas las páginas) ----------
const MENU = [
  ["inicio", "index.html", "Inicio"],
  ["charlas", "charlas.html", "Charlas"],
  ["ponentes", "ponentes.html", "Ponentes"],
  ["planes", "planes.html", "Planes"],
  ["contacto", "contacto.html", "Contacto"]
];

function pintarEstructura() {
  const u = usuarioActual();
  const enlaces = MENU.map(([id, url, txt]) => `<a href="${url}" class="${PAGINA === id ? "activo" : ""}">${txt}</a>`).join("");

  $("#cabecera").innerHTML = `
    <div class="contenedor nav">
      <a href="index.html" class="logo"><img src="Imagen1.png" alt="Logo AdiTech" />ADITECH<span>EVENTS</span></a>
      <button class="menu-btn" id="menuBtn" aria-label="Abrir menú">&#9776;</button>
      <nav id="menu">
        ${enlaces}
        ${u ? `<a href="panel.html" class="${PAGINA === "panel" ? "activo" : ""}">Mi panel</a>
               <a href="#" id="btnSalir" class="btn btn-sec btn-peq">Salir</a>`
            : `<a href="#" id="btnAcceder" class="btn btn-peq">Acceder</a>`}
      </nav>
    </div>`;

  $("#pie").innerHTML = `
    <div class="contenedor pie-grid">
      <a href="index.html" class="logo"><img src="Imagen1.png" alt="" />ADITECH<span>EVENTS</span></a>
      <nav>${MENU.map(([, url, txt]) => `<a href="${url}">${txt}</a>`).join("")}</nav>
      <p>© ${new Date().getFullYear()} AdiTech Events · Proyecto final 2º DAW</p>
    </div>`;

  if (!$("#modal")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div id="modal" class="modal oculto" role="dialog" aria-modal="true">
        <div class="modal-caja"><button class="cerrar" id="cerrarModal" aria-label="Cerrar">&times;</button><div id="modalContenido"></div></div>
      </div>
      <div id="aviso" class="aviso"></div>`);
  }
}

// ---------- INICIO: estadísticas animadas ----------
function pintarStats() {
  const datos = {
    statCharlas: bd.charlas.filter((c) => c.estado === "publicada").length,
    statPonentes: bd.ponentes.length,
    statSalas: bd.salas.length,
    statPlazas: bd.charlas.reduce((t, c) => t + c.aforo_maximo, 0)
  };
  for (const [id, valor] of Object.entries(datos)) {
    let n = 0;
    const paso = Math.max(1, Math.ceil(valor / 40));
    const intervalo = setInterval(() => {
      n = Math.min(valor, n + paso);
      document.getElementById(id).textContent = n;
      if (n === valor) clearInterval(intervalo);
    }, 25);
  }
}

// ---------- CHARLAS ----------
function rellenarFiltros() {
  const fechas = [...new Set(bd.charlas.map((c) => c.fecha))].sort();
  $("#filtroFecha").innerHTML = '<option value="">Todas las fechas</option>' +
    fechas.map((f) => `<option value="${f}">${formatoFecha(f)}</option>`).join("");
  $("#filtroSala").innerHTML = '<option value="">Todas las salas</option>' +
    bd.salas.map((s) => `<option value="${s.id_sala}">${esc(s.nombre)}</option>`).join("");
}

function pintarCharlas() {
  const texto = $("#buscador").value.trim().toLowerCase();
  const fecha = $("#filtroFecha").value;
  const idSala = Number($("#filtroSala").value);
  const usuario = usuarioActual();

  const lista = bd.charlas
    .filter((c) => c.estado === "publicada")
    .filter((c) => !fecha || c.fecha === fecha)
    .filter((c) => !idSala || c.id_sala === idSala)
    .filter((c) => {
      const nombres = ponentesDe(c.id_charla).map((p) => p.nombre + " " + p.apellidos).join(" ");
      return (c.titulo + " " + nombres).toLowerCase().includes(texto);
    })
    .sort((a, b) => (a.fecha + a.hora_inicio).localeCompare(b.fecha + b.hora_inicio));

  $("#sinResultados").classList.toggle("oculto", lista.length > 0);

  $("#listaCharlas").innerHTML = lista.map((c) => {
    const libres = plazasLibres(c);
    const ocupacion = Math.round(((c.aforo_maximo - libres) / c.aforo_maximo) * 100);
    const yaReservada = usuario && reservasActivas(c.id_charla).some((r) => r.id_usuario === usuario.id_usuario);
    let boton;
    if (yaReservada) boton = '<span class="chip ok">Reservada ✔</span>';
    else if (libres <= 0) boton = '<button class="btn btn-peq" disabled>Completo</button>';
    else boton = `<button class="btn btn-peq" data-reservar="${c.id_charla}">Reservar</button>`;

    return `
      <article class="tarjeta charla">
        <span class="chip">${formatoFecha(c.fecha)} · ${c.hora_inicio}–${c.hora_fin}</span>
        <h3>${esc(c.titulo)}</h3>
        <p>${esc(c.descripcion)}</p>
        <p class="meta">🎤 ${ponentesDe(c.id_charla).map((p) => `<a href="ponentes.html#ponente-${p.id_ponente}">${esc(p.nombre + " " + p.apellidos)}</a>`).join(", ")}</p>
        <p class="meta">📍 ${esc(sala(c.id_sala)?.nombre ?? "Sala no disponible")} (${esc(sala(c.id_sala)?.ubicacion ?? "")})</p>
        <div class="barra ${libres <= 0 ? "llena" : ""}"><span style="width:${ocupacion}%"></span></div>
        <div class="charla-pie"><span class="meta">${Math.max(libres, 0)} de ${c.aforo_maximo} plazas libres</span>${boton}</div>
      </article>`;
  }).join("");
}

async function reservar(idCharla) {
  const usuario = usuarioActual();
  if (!usuario) { aviso("Inicia sesión para reservar plaza", true); abrirLogin(); return; }

  try {
    const reserva = await AditechApi.createReservation(idCharla);
    await cargarDatosServidor();
    aviso(`Reserva confirmada: ${codigoReserva(reserva.id_reserva)}`);
    pintarEstructura();
    pintarCharlas();
  } catch (error) {
    aviso(error.message || "No se pudo guardar la reserva.", true);
  }
}

async function cancelarReserva(idReserva) {
  if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
  try {
    await AditechApi.cancelReservation(idReserva);
    await cargarDatosServidor();
    aviso("Reserva cancelada");
    pintarPanel();
  } catch (error) {
    aviso(error.message || "No se pudo cancelar la reserva.", true);
  }
}

// ---------- PONENTES (con desplegable) ----------
function pintarPonentes() {
  $("#listaPonentes").innerHTML = bd.ponentes.map((p) => {
    const charlas = charlasDe(p.id_ponente).filter((c) => c && c.estado === "publicada");
    return `
      <article class="tarjeta ponente" id="ponente-${p.id_ponente}">
        <div class="ponente-cab">
          <div class="avatar">${esc(p.nombre[0] + p.apellidos[0])}</div>
          <div>
            <h3>${esc(p.nombre)} ${esc(p.apellidos)}</h3>
            <p class="especialidad">${esc(p.especialidad || "")}</p>
            <p class="meta">${esc(p.cargo || "")}${p.experiencia ? ` · ${p.experiencia} años de experiencia` : ""}</p>
          </div>
        </div>
        <p>${esc(p.biografia)}</p>
        <button class="desplegar" aria-expanded="false" data-desplegar="${p.id_ponente}">
          Ver especialización <span class="flecha">▾</span>
        </button>
        <div class="detalle" id="detalle-${p.id_ponente}">
          <div class="detalle-int">
            <h4>Especialización</h4>
            <p>${esc(p.especializacion || "Información no disponible.")}</p>
            ${p.temas ? `<h4>Áreas que domina</h4><ul>${p.temas.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
            ${p.tecnologias ? `<h4>Tecnologías</h4><div class="etiquetas">${p.tecnologias.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : ""}
            <h4>Charlas en el evento</h4>
            ${charlas.length ? `<ul>${charlas.map((c) => `<li><a href="charlas.html">${esc(c.titulo)}</a> · ${formatoFecha(c.fecha)}, ${c.hora_inicio}</li>`).join("")}</ul>`
                             : "<p>Sin charlas programadas.</p>"}
          </div>
        </div>
      </article>`;
  }).join("");

  // Si se llega desde una charla (ponentes.html#ponente-3) se abre su ficha
  const id = location.hash.replace("#ponente-", "");
  if (id) { alternarDetalle(id, true); document.getElementById("ponente-" + id)?.scrollIntoView({ behavior: "smooth", block: "center" }); }
}

function alternarDetalle(id, abrir) {
  const boton = document.querySelector(`[data-desplegar="${id}"]`);
  const panel = document.getElementById("detalle-" + id);
  if (!boton || !panel) return;
  const abierto = abrir ?? boton.getAttribute("aria-expanded") !== "true";
  boton.setAttribute("aria-expanded", abierto);
  boton.firstChild.textContent = abierto ? "Ocultar especialización " : "Ver especialización ";
  panel.style.maxHeight = abierto ? panel.scrollHeight + "px" : "0";
}

// ---------- Modal de acceso ----------
function abrirModal(html) { $("#modalContenido").innerHTML = html; $("#modal").classList.remove("oculto"); }
function cerrarModal() { $("#modal").classList.add("oculto"); }

function abrirLogin(pestana = "login") {
  abrirModal(`
    <div class="pestanas">
      <button data-pestana="login" class="${pestana === "login" ? "activa" : ""}">Iniciar sesión</button>
      <button data-pestana="registro" class="${pestana === "registro" ? "activa" : ""}">Registrarse</button>
    </div>
    ${pestana === "login" ? `
      <form id="formLogin" class="formulario">
        <label>Email <input type="email" name="email" required /></label>
        <label>Contraseña <input type="password" name="password" required /></label>
        <button class="btn">Entrar</button>
        <p class="msg-form" id="msgLogin"></p>
      </form>`
    : `
      <form id="formRegistro" class="formulario">
        <label>Nombre <input name="nombre" required /></label>
        <label>Apellidos <input name="apellidos" required /></label>
        <label>Email <input type="email" name="email" required /></label>
        <label>Contraseña (mín. 8 caracteres) <input type="password" name="password" minlength="8" required /></label>
        <button class="btn">Crear cuenta</button>
        <p class="msg-form" id="msgRegistro"></p>
      </form>`}
  `);
}

async function login(form) {
  const msg = $("#msgLogin");
  try {
    await AditechApi.login({
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value
    });
    await cargarDatosServidor();
    cerrarModal();
    pintarEstructura();
    if (rolDe(usuarioActual()) === "asistente" && PAGINA === "charlas") {
      pintarCharlas();
      aviso(`Bienvenido/a, ${usuarioActual().nombre}`);
    } else {
      location.href = "panel.html";
    }
  } catch (error) {
    msg.textContent = error.message || "No se pudo iniciar sesión.";
    msg.className = "msg-form ko";
  }
}

async function registro(form) {
  const msg = $("#msgRegistro");
  if (!form.checkValidity()) { msg.textContent = "Revisa los campos del formulario"; msg.className = "msg-form ko"; return; }
  try {
    await AditechApi.register({
      nombre: form.nombre.value.trim(),
      apellidos: form.apellidos.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value
    });
    location.href = "panel.html";
  } catch (error) {
    msg.textContent = error.message || "No se pudo crear la cuenta.";
    msg.className = "msg-form ko";
  }
}

async function logout() {
  try {
    await AditechApi.logout();
    usuarioSesion = null;
    location.href = "index.html";
  } catch (error) {
    aviso(error.message || "No se pudo cerrar la sesión.", true);
  }
}

// ---------- QR simulado (patrón determinista a partir del código) ----------
function qrHTML(texto) {
  let semilla = [...texto].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const aleatorio = () => ((semilla = (semilla * 1103515245 + 12345) >>> 0) % 100) / 100;
  const ESQ = [[0, 0], [0, 14], [14, 0]];
  const enEsquina = (f, c) => ESQ.some(([y, x]) => f >= y && f <= y + 7 && c >= x && c <= x + 7);
  const marcaEsquina = (f, c) => ESQ.some(([y, x]) => {
    const dy = f - y, dx = c - x;
    if (dy < 0 || dy > 6 || dx < 0 || dx > 6) return false;
    return dy === 0 || dy === 6 || dx === 0 || dx === 6 || (dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4);
  });
  let celdas = "";
  for (let f = 0; f < 21; f++)
    for (let c = 0; c < 21; c++)
      celdas += `<i class="${(enEsquina(f, c) ? marcaEsquina(f, c) : aleatorio() > 0.5) ? "n" : ""}"></i>`;
  return `<div class="qr">${celdas}</div>`;
}

function verQR(idReserva) {
  const r = bd.reservas.find((x) => x.id_reserva === idReserva);
  const c = bd.charlas.find((x) => x.id_charla === r.id_charla);
  const codigo = codigoReserva(r.id_reserva);
  abrirModal(`<h3>Tu entrada</h3><p>${esc(c.titulo)}</p><p class="meta">${formatoFecha(c.fecha)} · ${c.hora_inicio} · ${esc(sala(c.id_sala)?.nombre ?? "Sala no disponible")}</p>
    ${qrHTML(codigo)}<p class="centrado codigo">${codigo}</p><p class="ayuda centrado">Muestra este código en la entrada.</p>`);
}

// ---------- PANEL según rol ----------
function pintarPanel() {
  const u = usuarioActual();
  if (!u) {
    $("#panelContenido").innerHTML = `<p class="centrado">Necesitas iniciar sesión para ver tu panel.</p><br>
      <p class="centrado"><button class="btn" id="btnAccederPanel">Iniciar sesión</button></p>`;
    return;
  }
  const rol = rolDe(u);
  $("#panelTitulo").textContent = `Hola, ${u.nombre}`;
  $("#panelSub").textContent = `Has accedido como ${rol}.`;

  let html = "";
  if (rol === "asistente") html = panelAsistente(u);
  if (rol === "personal") html = panelPersonal();
  if (rol === "organizador" || rol === "administrador") html = panelOrganizador();
  if (rol === "administrador") html += '<p>La administración de usuarios aún no está disponible en la API.</p>';
  $("#panelContenido").innerHTML = html;
}

function estadoChip(estado) {
  const clase = { confirmada: "ok", cancelada: "ko", pendiente: "pend", publicada: "ok", borrador: "pend", finalizada: "" }[estado] ?? "";
  return `<span class="chip ${clase}">${estado}</span>`;
}

function panelAsistente(u) {
  const mias = bd.reservas.filter((r) => r.id_usuario === u.id_usuario).sort((a, b) => b.id_reserva - a.id_reserva);
  if (!mias.length) return '<p class="centrado">Aún no tienes reservas.</p><br><p class="centrado"><a href="charlas.html" class="btn">Ver charlas</a></p>';
  return `<h3 class="panel-h3">Mis reservas</h3><div class="tabla-wrap"><table>
    <tr><th>Código</th><th>Charla</th><th>Fecha</th><th>Estado</th><th>Asistencia</th><th></th></tr>
    ${mias.map((r) => {
      const c = bd.charlas.find((x) => x.id_charla === r.id_charla);
      const asistio = bd.asistencias.some((a) => a.id_reserva === r.id_reserva);
      const acciones = r.estado === "cancelada" || asistio ? "" :
        `<button class="btn btn-peq" data-qr="${r.id_reserva}">Ver QR</button> <button class="btn btn-peq btn-peligro" data-cancelar="${r.id_reserva}">Cancelar</button>`;
      return `<tr><td class="codigo">${codigoReserva(r.id_reserva)}</td><td>${esc(c.titulo)}</td><td>${c.fecha} ${c.hora_inicio}</td>
        <td>${estadoChip(r.estado)}</td><td>${asistio ? '<span class="chip ok">Validada</span>' : "—"}</td><td>${acciones}</td></tr>`;
    }).join("")}
  </table></div>`;
}

function panelPersonal() {
  return '<h3 class="centrado panel-h3">Validación de entradas</h3><p class="centrado">La validación de entradas aún no está disponible en la API.</p>';
}

function panelOrganizador() {
  return `<h3 class="panel-h3">Ocupación de charlas</h3><div class="tabla-wrap"><table>
    <tr><th>Charla</th><th>Fecha</th><th>Sala</th><th>Reservas</th><th>Asistencias</th><th>Estado</th></tr>
    ${bd.charlas.map((c) => {
      const res = reservasActivas(c.id_charla);
      const asis = bd.asistencias.filter((a) => res.some((r) => r.id_reserva === a.id_reserva)).length;
      return `<tr><td>${esc(c.titulo)}</td><td>${c.fecha} ${c.hora_inicio}</td><td>${esc(sala(c.id_sala)?.nombre ?? "Sala no disponible")}</td>
        <td>${c.reservas_activas_count ?? res.length} / ${c.aforo_maximo}</td><td>${asis}</td><td>${estadoChip(c.estado)}</td></tr>`;
    }).join("")}
  </table></div>
  <h3 class="panel-h3">Gestión de charlas</h3>
  <p>La creación y edición de charlas aún no está disponible en la API.</p>`;
}

// ---------- CONTACTO ----------
function enviarContacto(e) {
  e.preventDefault();
  const form = e.target;
  const msg = $("#msgContacto");
  let ok = true;
  [...form.elements].forEach((el) => {
    if (el.name && el.required) { const valido = el.checkValidity() && el.value.trim() !== ""; el.classList.toggle("invalido", !valido); ok = ok && valido; }
  });
  if (!ok) { msg.textContent = "Por favor, rellena correctamente todos los campos."; msg.className = "msg-form ko"; return; }
  msg.textContent = `¡Gracias, ${form.nombre.value.trim()}! Te responderemos lo antes posible.`;
  msg.className = "msg-form ok";
  form.reset();
}

// ---------- Eventos (delegados, válidos para todas las páginas) ----------
document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a, #modal") || e.target;
  if (t.id === "btnAcceder" || t.id === "btnAccederPanel") { e.preventDefault(); abrirLogin(); }
  if (t.id === "btnSalir") { e.preventDefault(); void logout(); }
  if (t.id === "menuBtn") $("#menu").classList.toggle("abierto");
  if (t.dataset.reservar) void reservar(Number(t.dataset.reservar));
  if (t.dataset.cancelar) void cancelarReserva(Number(t.dataset.cancelar));
  if (t.dataset.qr) verQR(Number(t.dataset.qr));
  if (t.dataset.pestana) abrirLogin(t.dataset.pestana);
  if (t.dataset.desplegar) alternarDetalle(t.dataset.desplegar);
  if (e.target.id === "modal" || t.id === "cerrarModal") cerrarModal();
});

document.addEventListener("submit", (e) => {
  const id = e.target.id;
  if (id === "formContacto") return enviarContacto(e);
  e.preventDefault();
  if (id === "formLogin") void login(e.target);
  if (id === "formRegistro") void registro(e.target);
});

document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarModal(); });

// ---------- Arranque según la página ----------
async function iniciarPagina() {
  pintarEstructura();

  try {
    await cargarDatosServidor();
  } catch (error) {
    console.error("No se pudieron cargar los datos de la API.", error);
    aviso("No se pudo conectar con el servidor. Comprueba que Laravel y MySQL estén activos.", true);
  }

  pintarEstructura();
  if (PAGINA === "inicio") pintarStats();
  if (PAGINA === "charlas") {
    rellenarFiltros();
    pintarCharlas();
    ["#buscador", "#filtroFecha", "#filtroSala"].forEach((selector) => $(selector).addEventListener("input", pintarCharlas));
  }
  if (PAGINA === "ponentes") pintarPonentes();
  if (PAGINA === "panel") pintarPanel();
}

void iniciarPagina();
