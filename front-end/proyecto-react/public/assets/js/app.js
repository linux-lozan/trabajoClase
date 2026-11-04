const PAGINA = document.body.dataset.pagina;

const MENU = [
  ["inicio", "index.html", "Inicio"],
  ["charlas", "charlas.html", "Charlas"],
  ["ponentes", "ponentes.html", "Ponentes"],
  ["planes", "planes.html", "Planes"],
  ["contacto", "contacto.html", "Contacto"]
];

const menuHTML = MENU.map(([id, url, texto]) =>
  `<a href="${url}" class="${PAGINA === id ? "activo" : ""}">${texto}</a>`
).join("");

document.querySelector("#cabecera").innerHTML = `
  <div class="contenedor nav">
    <a href="index.html" class="logo"><img src="Imagen1.png" alt="Logo AdiTech" />ADITECH<span>EVENTS</span></a>
    <button class="menu-btn" id="menuBtn" aria-label="Abrir menú">&#9776;</button>
    <nav id="menu">${menuHTML}</nav>
  </div>`;

document.querySelector("#pie").innerHTML = `
  <div class="contenedor pie-grid">
    <a href="index.html" class="logo"><img src="Imagen1.png" alt="" />ADITECH<span>EVENTS</span></a>
    <nav>${MENU.map(([, url, texto]) => `<a href="${url}">${texto}</a>`).join("")}</nav>
    <p>© ${new Date().getFullYear()} AdiTech Events · Proyecto final 2º DAW</p>
  </div>`;

document.querySelector("#menuBtn").addEventListener("click", () => {
  document.querySelector("#menu").classList.toggle("abierto");
});
