import { useEffect } from "react";

// Título de la pestaña del navegador para cada página.
export function useTitulo(titulo, completo = false) {
  useEffect(() => {
    document.title = completo ? titulo : `${titulo} · AdiTech Events`;
  }, [titulo, completo]);
}
