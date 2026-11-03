import { Titular } from "./efectos.jsx";

export function CabPagina({ etiqueta, titulo, children }) {
  return (
    <section className="cab-pagina">
      <div className="contenedor">
        <p className="etiqueta">{etiqueta}</p>
        <Titular>{titulo}</Titular>
        <p>{children}</p>
      </div>
    </section>
  );
}
