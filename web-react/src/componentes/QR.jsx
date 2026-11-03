// QR simulado: patrón determinista a partir del código de la reserva.
const ESQ = [[0, 0], [0, 14], [14, 0]];
const enEsquina = (f, c) => ESQ.some(([y, x]) => f >= y && f <= y + 7 && c >= x && c <= x + 7);
const marcaEsquina = (f, c) => ESQ.some(([y, x]) => {
  const dy = f - y, dx = c - x;
  if (dy < 0 || dy > 6 || dx < 0 || dx > 6) return false;
  return dy === 0 || dy === 6 || dx === 0 || dx === 6 || (dy >= 2 && dy <= 4 && dx >= 2 && dx <= 4);
});

function celdas(texto) {
  let semilla = [...texto].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
  const aleatorio = () => ((semilla = (semilla * 1103515245 + 12345) >>> 0) % 100) / 100;
  const lista = [];
  for (let f = 0; f < 21; f++)
    for (let c = 0; c < 21; c++)
      lista.push(enEsquina(f, c) ? marcaEsquina(f, c) : aleatorio() > 0.5);
  return lista;
}

export function QR({ texto }) {
  return <div className="qr">{celdas(texto).map((negra, i) => <i key={i} className={negra ? "n" : ""} />)}</div>;
}
