import { useEffect, useState } from 'react';
import { ApiError } from './api/ApiError.js';
import { getCurrentUser, login, logout } from './api/authApi.js';
import { InicioSesion } from './componentes/InicioSesion.jsx';
import { Listadocharlas } from './componentes/Listadocharlas.jsx';

export default function App() {
    const [user, setUser] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch((requestError) => {
                if (!(requestError instanceof ApiError && requestError.isUnauthorized)) {
                    setError('No se pudo conectar con el servidor. Inténtalo de nuevo.');
                }
            })
            .finally(() => setCargando(false));
    }, []);

    async function iniciarSesion(email, password) {
        setEnviando(true);
        setError('');

        try {
            setUser(await login(email, password));
        } catch (requestError) {
            setError(
                requestError instanceof ApiError
                    ? requestError.message
                    : 'No se pudo conectar con el servidor. Inténtalo de nuevo.',
            );
        } finally {
            setEnviando(false);
        }
    }

    async function cerrarSesion() {
        setError('');

        try {
            await logout();
            setUser(null);
        } catch {
            setError('No se pudo cerrar la sesión. Inténtalo de nuevo.');
        }
    }

    if (cargando) {
        return <p className="login__cargando">Comprobando la sesión...</p>;
    }

    if (!user) {
        return <InicioSesion onIniciarSesion={iniciarSesion} error={error} cargando={enviando} />;
    }

    return (
        <main className="panel">
            <header className="panel__cabecera">
                <div>
                    <h1>Hola, {user.nombre}</h1>
                    <p>Has iniciado sesión como {user.email}</p>
                </div>
                <button type="button" onClick={cerrarSesion}>Cerrar sesión</button>
            </header>
            {error && <p className="login__error" role="alert">{error}</p>}
            <Listadocharlas />
        </main>
    );
}