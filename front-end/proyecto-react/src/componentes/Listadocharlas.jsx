import { useEffect, useState } from 'react';
import { list } from '../api/charlasApi.js';

function formatearFecha(fecha) {
    if (!fecha) return 'Fecha por confirmar';

    const fechaCorta = String(fecha).slice(0, 10);
    const fechaParseada = new Date(`${fechaCorta}T00:00:00`);
    if (Number.isNaN(fechaParseada.getTime())) return String(fecha);

    return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(fechaParseada);
}

export function Listadocharlas({ onStatusChange }) {
    const [charlas, setCharlas] = useState([]);
    const [estado, setEstado] = useState('cargando');
    const [error, setError] = useState('');

    useEffect(() => {
        let activo = true;

        list()
            .then((resultado) => {
                if (!activo) return;
                setCharlas(resultado);
                setEstado('conectado');
            })
            .catch((requestError) => {
                console.error('No se pudieron cargar las charlas:', requestError);
                if (!activo) return;
                setError('No se pudo cargar la agenda. Comprueba que el servidor esté disponible.');
                setEstado('error');
            });

        return () => {
            activo = false;
        };
    }, []);

    useEffect(() => {
        onStatusChange?.(estado);
    }, [estado, onStatusChange]);

    if (estado === 'cargando') {
        return <p className="aviso-pagina" role="status">Cargando charlas…</p>;
    }

    if (estado === 'error') {
        return <p className="aviso-pagina" role="alert">{error}</p>;
    }

    if (!charlas.length) {
        return <p className="aviso-pagina" role="status">No hay charlas disponibles.</p>;
    }

    return (
        <div className="lista-charlas" aria-live="polite">
            {charlas.map((charla, indice) => (
                <article className="fila-charla" key={charla.id ?? `${charla.titulo}-${indice}`}>
                    <time className="hora-charla" dateTime={charla.hora_inicio || undefined}>
                        {charla.hora_inicio?.slice(0, 5) || '--:--'}
                    </time>
                    <div className="detalle-charla">
                        <span className="categoria">{formatearFecha(charla.fecha)}</span>
                        <h3>{charla.titulo || 'Charla sin título'}</h3>
                        <p>{charla.descripcion || 'Sin descripción disponible.'}</p>
                    </div>
                    <span className="sala-charla">
                        {charla.aforo_maximo == null ? 'Aforo no indicado' : `Aforo máximo: ${charla.aforo_maximo}`}
                    </span>
                </article>
            ))}
        </div>
    );
}
