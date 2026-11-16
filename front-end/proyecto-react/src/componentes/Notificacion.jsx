import { useEffect, useState } from 'react';

export function Notificacion({ tipo, mensaje, duracion = 4000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!duracion) return;

        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duracion);

        return () => clearTimeout(timer);
    }, [duracion, onClose]);

    if (!visible) return null;

    const clases = `notificacion notificacion-${tipo}`;

    return (
        <div className={clases} role="alert" aria-live="polite">
            <span className="notificacion-icono" aria-hidden="true">
                {tipo === 'exito' && '✓'}
                {tipo === 'error' && '✕'}
                {tipo === 'info' && 'ℹ'}
            </span>
            <p className="notificacion-mensaje">{mensaje}</p>
        </div>
    );
}
