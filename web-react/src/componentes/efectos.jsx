/* =========================================================
   AdiTech Events - efectos de interfaz (solo presentación)
   · Preloader con contador y cortina entre páginas
   · Titulares que suben palabra a palabra
   · Aparición de bloques al hacer scroll
   · Cursor que reacciona a los enlaces
   ========================================================= */
import { Children, cloneElement, createContext, isValidElement, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

export const reducido = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const mem = (k, v) => { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch { /* sin almacenamiento */ } return null; };

// ---------- Preloader y cortina entre páginas ----------
const CtxTransicion = createContext({ retraso: 150, ir: () => {} });
const primeraVez = !mem("aditech-visto");

export function Transiciones({ children }) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  // fase: "carga" (contador inicial) | "entra" | "cubre" | "fuera" | null
  const [cortina, setCortina] = useState(() => (!reducido && primeraVez ? { fase: "carga", cuenta: 0 } : null));
  const [retraso, setRetraso] = useState(!reducido && primeraVez ? 1600 : 150);
  const destino = useRef(null);

  useEffect(() => { mem("aditech-visto", "1"); }, []);

  // Contador 0 → 100 con frenada final y salida de la cortina.
  const cargando = cortina?.fase === "carga";
  useEffect(() => {
    if (!cargando) return;
    const inicio = performance.now(), dur = 1300;
    let raf, t;
    const paso = (ahora) => {
      const x = Math.min(1, (ahora - inicio) / dur);
      setCortina({ fase: "carga", cuenta: Math.round(100 * (1 - Math.pow(1 - x, 3))) });
      if (x < 1) raf = requestAnimationFrame(paso);
      else t = setTimeout(() => setCortina({ fase: "fuera" }), 150);
    };
    raf = requestAnimationFrame(paso);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [cargando]);

  // La cortina "entra" desde abajo; en el siguiente frame la hacemos cubrir la pantalla.
  useEffect(() => {
    if (cortina?.fase !== "entra") return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setCortina({ fase: "cubre" })));
    return () => cancelAnimationFrame(raf);
  }, [cortina?.fase]);

  // Con la pantalla cubierta, cambiamos de página y la cortina sale por arriba.
  useEffect(() => {
    if (cortina?.fase !== "cubre") return;
    const t = setTimeout(() => {
      setRetraso(450);
      navigate(destino.current);
      window.scrollTo(0, 0);
      requestAnimationFrame(() => setCortina({ fase: "fuera" }));
    }, 750);
    return () => clearTimeout(t);
  }, [cortina?.fase, navigate]);

  useEffect(() => {
    if (cortina?.fase !== "fuera") return;
    const t = setTimeout(() => setCortina(null), 1200);
    return () => clearTimeout(t);
  }, [cortina?.fase]);

  const ir = useCallback((to) => {
    if (reducido || to === pathname + search) { navigate(to); window.scrollTo(0, 0); return; }
    destino.current = to;
    setCortina({ fase: "entra" });
  }, [navigate, pathname, search]);

  const clase = cortina && { carga: "cortina", entra: "cortina entra", cubre: "cortina entra cubre", fuera: "cortina fuera" }[cortina.fase];

  return (
    <CtxTransicion.Provider value={{ retraso, ir }}>
      {children}
      {cortina && (
        <div className={clase}>
          <span className="marca">AdiTech Events</span>
          {cortina.fase === "carga" && <span className="cuenta">{cortina.cuenta}</span>}
        </div>
      )}
    </CtxTransicion.Provider>
  );
}

export const useTransicion = () => useContext(CtxTransicion);

// Enlace interno: la cortina sube antes de cambiar de página.
export function Enlace({ to, onClick, ...props }) {
  const { ir } = useTransicion();
  return (
    <Link
      to={to}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        ir(to);
      }}
    />
  );
}

// ---------- Titulares palabra a palabra ----------
function textoPlano(nodo) {
  if (typeof nodo === "string" || typeof nodo === "number") return String(nodo);
  if (Array.isArray(nodo)) return nodo.map(textoPlano).join("");
  if (isValidElement(nodo)) return textoPlano(nodo.props.children);
  return "";
}

function partir(nodo, contador) {
  if (typeof nodo === "string" || typeof nodo === "number") {
    return String(nodo).split(/(\s+)/).filter(Boolean).map((t) =>
      /^\s+$/.test(t) ? t : (
        <span className="palabra" key={"p" + contador.n}>
          <span style={{ "--n": contador.n++ }}>{t}</span>
        </span>
      ));
  }
  if (isValidElement(nodo)) return cloneElement(nodo, { key: "e" + contador.n }, partir(nodo.props.children, contador));
  return Children.toArray(nodo).flatMap((h) => partir(h, contador));
}

export function Titular({ children, ...props }) {
  const { retraso } = useTransicion();
  if (reducido) return <h1 {...props}>{children}</h1>;
  return (
    <h1 {...props} aria-label={textoPlano(children).trim()} style={{ "--retraso": retraso + "ms" }}>
      {partir(children, { n: 0 })}
    </h1>
  );
}

// ---------- Aparición al hacer scroll ----------
const SELECTOR = [
  ".hero .lead", ".hero .acciones", ".hero-visual", ".stats > div", ".seccion h2", ".sub",
  ".rejilla-3 > *", ".rejilla-4 > *", ".ponentes-lista > *", ".contacto-info", ".formulario.caja",
  ".tabla-wrap", ".cab-pagina p:last-child", ".filtros",
].join(",");

export function useRevelar() {
  const { pathname } = useLocation();
  const { retraso } = useTransicion();
  useEffect(() => {
    const main = document.querySelector("main");
    if (reducido || !main || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visto");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    const preparar = (el) => {
      if (!el.classList.contains("revelar")) el.classList.add("revelar");
      if (!el.classList.contains("visto")) io.observe(el);
    };
    const aplicar = () => {
      main.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.closest(".cta")) return;
        if (!el.classList.contains("revelar")) {
          const hermanos = el.parentElement ? [...el.parentElement.children] : [];
          el.style.setProperty("--orden", Math.max(0, hermanos.indexOf(el)) % 4 + (el.closest(".hero") ? retraso / 80 : 0));
        }
        preparar(el);
      });
      const cta = main.querySelector(".cta");
      if (cta) preparar(cta);
    };
    aplicar();
    // Los elementos que React añade después (filtros, paneles...) también aparecen.
    const mo = new MutationObserver(aplicar);
    mo.observe(main, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname, retraso]);
}

// ---------- Cursor (solo ratón) ----------
export function Cursor() {
  const ref = useRef(null);
  const activo = !reducido && typeof matchMedia !== "undefined" && matchMedia("(pointer: fine)").matches;
  useEffect(() => {
    if (!activo) return;
    const cursor = ref.current;
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, raf;
    const mover = (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.remove("oculto-cursor");
      cursor.classList.toggle("grande", !!e.target.closest?.("a, button, .tarjeta, select, label"));
    };
    const salir = () => cursor.classList.add("oculto-cursor");
    const seguir = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(seguir);
    };
    addEventListener("pointermove", mover);
    document.addEventListener("pointerleave", salir);
    seguir();
    return () => { removeEventListener("pointermove", mover); document.removeEventListener("pointerleave", salir); cancelAnimationFrame(raf); };
  }, [activo]);
  return activo ? <div ref={ref} className="cursor oculto-cursor" /> : null;
}
