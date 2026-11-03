import { useEffect, useRef } from "react";
import { reducido } from "./efectos.jsx";

// Cara del logo. La frontal lleva degradados y detalles; las traseras son
// copias cada vez más oscuras que le dan grosor real.
function Cara({ fondo, estilo }) {
  return (
    <svg className={"capa " + (fondo ? "fondo" : "frente")} viewBox="0 0 200 220" aria-hidden="true" style={estilo}>
      {!fondo && (
        <defs>
          <linearGradient id="l3-cara" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a63e0" /><stop offset=".55" stopColor="#1a3fae" /><stop offset="1" stopColor="#122f8a" />
          </linearGradient>
          <linearGradient id="l3-luz" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".75" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="l3-forma" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="220">
            <path d="M88 16H112L152 128H126L100 58L74 128H48Z" fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
            <rect x="70" y="64" width="60" height="48" rx="7" fill="#fff" />
            <text x="100" y="178" textAnchor="middle" className="l3-adi" fill="#fff">ADI</text>
          </mask>
        </defs>
      )}
      <path className="s" d="M88 16H112L152 128H126L100 58L74 128H48Z" fill="url(#l3-cara)" stroke="url(#l3-cara)" strokeWidth="5" strokeLinejoin="round" />
      <rect className="s" x="70" y="64" width="60" height="48" rx="7" fill="#1e48c4" stroke="#fff" strokeWidth="3" />
      <g className="detalle">
        <rect x="70" y="64" width="60" height="12" rx="6" fill="#29b6f0" />
        <rect x="83" y="58" width="6" height="12" rx="3" fill="#0b1d55" /><rect x="111" y="58" width="6" height="12" rx="3" fill="#0b1d55" />
        <g fill="#fff">
          <rect x="77" y="81" width="9" height="9" rx="2" /><rect x="89.5" y="81" width="9" height="9" rx="2" /><rect x="102" y="81" width="9" height="9" rx="2" /><rect x="114.5" y="81" width="9" height="9" rx="2" />
          <rect x="77" y="94" width="9" height="9" rx="2" /><rect x="89.5" y="94" width="9" height="9" rx="2" /><rect x="102" y="94" width="9" height="9" rx="2" fill="#29b6f0" /><rect x="114.5" y="94" width="9" height="9" rx="2" />
        </g>
      </g>
      <text className="s l3-adi" x="100" y="178" textAnchor="middle" fill="url(#l3-cara)">ADI</text>
      <g className="brillo" mask="url(#l3-forma)"><rect className="barrido" x="-60" y="0" width="60" height="220" fill="url(#l3-luz)" /></g>
    </svg>
  );
}

const CAPAS = 14, PASO = 1.5;
const oscuro = [11, 29, 85], claro = [26, 63, 174];
const FONDOS = Array.from({ length: CAPAS }, (_, k) => {
  const i = CAPAS - k; // de la más lejana a la más cercana
  const t = i / CAPAS;
  const mezcla = claro.map((v, j) => Math.round(v + (oscuro[j] - v) * t));
  return { "--z": 12 - i * PASO + "px", "--c": `rgb(${mezcla})` };
});

export function Logo3D() {
  const logo = useRef(null);
  const tilt = useRef(null);

  // Inclinación siguiendo el ratón por todo el hero.
  useEffect(() => {
    if (reducido) return;
    const el = logo.current;
    const hero = el.closest(".hero") || el;
    const mover = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      tilt.current.style.setProperty("--ry", (dx * 40).toFixed(2) + "deg");
      tilt.current.style.setProperty("--rx", (-dy * 30).toFixed(2) + "deg");
    };
    const salir = () => { tilt.current.style.setProperty("--ry", "0deg"); tilt.current.style.setProperty("--rx", "0deg"); };
    hero.addEventListener("pointermove", mover);
    hero.addEventListener("pointerleave", salir);
    return () => { hero.removeEventListener("pointermove", mover); hero.removeEventListener("pointerleave", salir); };
  }, []);

  // Vuelta completa al pulsar.
  const girar = () => {
    if (reducido) return;
    const el = logo.current;
    el.classList.remove("gira");
    el.getBoundingClientRect();
    el.classList.add("gira");
  };

  return (
    <div className="logo3d" ref={logo} role="img" aria-label="Logo de ADITech" onClick={girar}>
      <div className="logo3d-tilt" ref={tilt}><div className="logo3d-giro"><div className="logo3d-cuerpo">
        {FONDOS.map((estilo, i) => <Cara key={i} fondo estilo={estilo} />)}
        <Cara />
        {/* «Tech», un poco por delante */}
        <svg className="capa tech" viewBox="0 0 200 220" aria-hidden="true">
          <line x1="30" y1="200" x2="66" y2="200" /><line x1="134" y1="200" x2="170" y2="200" />
          <text x="100" y="208" textAnchor="middle">Tech</text>
        </svg>
        {/* Red de nodos, flotando por delante del logo */}
        <svg className="capa red" viewBox="0 0 200 220" aria-hidden="true">
          <g className="enlaces">
            <path d="M146 30L166 16L186 28L178 50L156 54Z" /><path d="M146 30L168 35L186 28M166 16L168 35L178 50M156 54L168 35" />
          </g>
          <circle className="nodo" cx="146" cy="30" r="4.2" /><circle className="nodo" cx="166" cy="16" r="3.6" /><circle className="nodo" cx="186" cy="28" r="4.2" />
          <circle className="nodo" cx="178" cy="50" r="3.6" /><circle className="nodo" cx="156" cy="54" r="4" /><circle className="nodo central" cx="168" cy="35" r="5" />
        </svg>
      </div></div></div>
    </div>
  );
}
