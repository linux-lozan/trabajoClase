/* =========================================================
   AdiTech Events - efectos de interfaz (solo presentación)
   · Preloader con contador y cortina entre páginas (A24, G. Colombel)
   · Titulares que suben palabra a palabra
   · Aparición de bloques al hacer scroll
   · Cabecera que se esconde al bajar
   · Cursor que reacciona a los enlaces
   Se carga después de app.js y no cambia su lógica.
   ========================================================= */
(() => {
  const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mem = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch {} return null; };

  // ---------- Preloader / cortina ----------
  let retrasoTitular = 150;
  const primeraVez = !mem("aditech-visto");
  const vieneDeEnlace = mem("aditech-transicion") === "1";
  mem("aditech-transicion", "0");

  if (!reducido && (primeraVez || vieneDeEnlace)) {
    const cortina = document.createElement("div");
    cortina.className = "cortina";
    cortina.innerHTML = primeraVez
      ? '<span class="marca">AdiTech Events</span><span class="cuenta">0</span>'
      : '<span class="marca">AdiTech Events</span>';
    document.body.appendChild(cortina);
    const quitar = () => {
      cortina.classList.add("fuera");
      setTimeout(() => cortina.remove(), 1200);
    };
    if (primeraVez) {
      // Contador 0 → 100 con frenada final.
      const cuenta = cortina.querySelector(".cuenta");
      const inicio = performance.now(), dur = 1300;
      const paso = (t) => {
        const x = Math.min(1, (t - inicio) / dur);
        cuenta.textContent = Math.round(100 * (1 - Math.pow(1 - x, 3)));
        if (x < 1) requestAnimationFrame(paso); else setTimeout(quitar, 150);
      };
      requestAnimationFrame(paso);
      retrasoTitular = 1600;
    } else {
      requestAnimationFrame(() => requestAnimationFrame(quitar));
      retrasoTitular = 450;
    }
  }
  mem("aditech-visto", "1");

  // Al pulsar un enlace interno, la cortina sube antes de cambiar de página.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.getAttribute("href").startsWith("#") || reducido || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$/.test(url.pathname) || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    const c = document.createElement("div");
    c.className = "cortina entra";
    c.innerHTML = '<span class="marca">AdiTech Events</span>';
    document.body.appendChild(c);
    c.getBoundingClientRect();
    c.classList.add("cubre");
    mem("aditech-transicion", "1");
    setTimeout(() => { location.href = a.href; }, 750);
  });
  // Volver atrás desde la caché del navegador: sin cortinas pegadas.
  addEventListener("pageshow", (e) => { if (e.persisted) document.querySelectorAll(".cortina").forEach((c) => c.remove()); });

  // ---------- Titulares palabra a palabra ----------
  function partir(el) {
    let n = 0;
    const recorrer = (nodo) => {
      [...nodo.childNodes].forEach((hijo) => {
        if (hijo.nodeType === Node.TEXT_NODE) {
          const trozos = hijo.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          trozos.forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(t); return; }
            const caja = document.createElement("span");
            caja.className = "palabra";
            const dentro = document.createElement("span");
            dentro.textContent = t;
            dentro.style.setProperty("--n", n++);
            caja.append(dentro);
            frag.append(caja);
          });
          hijo.replaceWith(frag);
        } else if (hijo.nodeType === Node.ELEMENT_NODE) {
          recorrer(hijo);
        }
      });
    };
    el.setAttribute("aria-label", el.textContent.trim());
    recorrer(el);
    el.style.setProperty("--retraso", retrasoTitular + "ms");
  }
  if (!reducido) document.querySelectorAll(".hero h1, .cab-pagina h1").forEach(partir);

  // ---------- Aparición al hacer scroll ----------
  const SELECTOR = [
    ".hero .lead", ".hero .acciones", ".hero-visual", ".stats > div", ".seccion h2", ".sub",
    ".rejilla-3 > *", ".rejilla-4 > *", ".ponentes-lista > *", ".contacto-info", ".formulario.caja",
    ".tabla-wrap", ".cab-pagina p:last-child", ".filtros",
  ].join(",");
  if (!reducido && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visto");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(SELECTOR).forEach((el) => {
      if (el.closest(".cta")) return;
      const hermanos = el.parentElement ? [...el.parentElement.children] : [];
      el.style.setProperty("--orden", Math.max(0, hermanos.indexOf(el)) % 4 + (el.closest(".hero") ? retrasoTitular / 80 : 0));
      el.classList.add("revelar");
      io.observe(el);
    });
    const cta = document.querySelector(".cta");
    if (cta) { cta.classList.add("revelar"); io.observe(cta); }
  }

  // ---------- Logo 3D: volumen, inclinación con el ratón y vuelta al pulsar ----------
  const logo = document.getElementById("logo3d");
  if (logo) {
    const cuerpo = logo.querySelector(".logo3d-cuerpo");
    const frente = logo.querySelector(".frente");
    // Clonamos la cara frontal hacia atrás, cada vez más oscura: así tiene grosor real.
    const CAPAS = 14, PASO = 1.5;
    const oscuro = [11, 29, 85], claro = [26, 63, 174];
    for (let i = 1; i <= CAPAS; i++) {
      const c = frente.cloneNode(true);
      c.classList.replace("frente", "fondo");
      c.querySelector("defs")?.remove();
      const t = i / CAPAS, mezcla = claro.map((v, k) => Math.round(v + (oscuro[k] - v) * t));
      c.style.setProperty("--z", (12 - i * PASO) + "px");
      c.style.setProperty("--c", `rgb(${mezcla})`);
      cuerpo.insertBefore(c, cuerpo.firstChild);
    }
    const tilt = logo.querySelector(".logo3d-tilt");
    const hero = logo.closest(".hero") || logo;
    if (!reducido) {
      hero.addEventListener("pointermove", (e) => {
        const r = logo.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        tilt.style.setProperty("--ry", (dx * 40).toFixed(2) + "deg");
        tilt.style.setProperty("--rx", (-dy * 30).toFixed(2) + "deg");
      });
      hero.addEventListener("pointerleave", () => { tilt.style.setProperty("--ry", "0deg"); tilt.style.setProperty("--rx", "0deg"); });
      logo.addEventListener("click", () => {
        logo.classList.remove("gira"); logo.getBoundingClientRect(); logo.classList.add("gira");
      });
    }
  }

  // ---------- Cabecera que se esconde al bajar ----------
  let ultimoY = scrollY;
  addEventListener("scroll", () => {
    const cab = document.getElementById("cabecera");
    const menuAbierto = document.querySelector("#menu.abierto");
    if (!cab) return;
    const y = scrollY;
    cab.classList.toggle("escondida", y > ultimoY && y > 140 && !menuAbierto);
    ultimoY = y;
  }, { passive: true });

  // ---------- Cursor (solo ratón) ----------
  if (!reducido && matchMedia("(pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "cursor oculto-cursor";
    document.body.appendChild(cursor);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener("pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.remove("oculto-cursor");
      cursor.classList.toggle("grande", !!e.target.closest("a, button, .tarjeta, select, label"));
    });
    document.addEventListener("pointerleave", () => cursor.classList.add("oculto-cursor"));
    const seguir = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(seguir);
    };
    seguir();
  }
})();
