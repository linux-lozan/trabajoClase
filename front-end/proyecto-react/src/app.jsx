import { useEffect, useState } from 'react';
import { ApiError } from './api/ApiError.js';
import { getCurrentUser, login, logout } from './api/authApi.js';
import { InicioSesion } from './componentes/InicioSesion.jsx';
import { Listadocharlas } from './componentes/Listadocharlas.jsx';
import { Contacto, Inicio, Planes, Ponentes } from './componentes/Paginas.jsx';
import './estilos/inicio.css';
import './estilos/charlas.css';
import './estilos/ponentes.css';
import './estilos/planes.css';
import './estilos/contacto.css';
import './estilos/panel.css';

const secciones = ['inicio', 'charlas', 'ponentes', 'planes', 'contacto', 'panel'];

function leerSeccion() {
    const hash = window.location.hash.slice(1);
    return secciones.includes(hash) ? hash : 'inicio';
}

function Cabecera({ seccion }) {
    const enlaces = [
        ['inicio', 'Inicio'],
        ['charlas', 'Charlas'],
        ['ponentes', 'Ponentes'],
        ['planes', 'Planes'],
        ['contacto', 'Contacto'],
    ];

    return (
        <header className="cabecera">
            <a className="marca" href="#inicio" aria-label="AdiTech Events, inicio">
                <span className="marca-icono" aria-hidden="true">A</span>
                <span>AdiTech <span className="marca-secundaria">Events</span></span>
            </a>
            <nav className="navegacion" aria-label="Navegación principal">
                {enlaces.map(([ruta, nombre]) => (
                    <a key={ruta} href={`#${ruta}`} aria-current={seccion === ruta ? 'page' : undefined}>
                        {nombre}
                    </a>
                ))}
                <a
                    className="boton boton-nav"
                    href="#panel"
                    aria-current={seccion === 'panel' ? 'page' : undefined}
                >
                    Mi panel
                </a>
            </nav>
        </header>
    );
}

function Pie() {
    return (
        <footer className="pie">
            <a className="marca" href="#inicio">
                <span className="marca-icono" aria-hidden="true">A</span>
                <span>AdiTech <span className="marca-secundaria">Events</span></span>
            </a>
            <p>Prototipo visual · Proyecto académico</p>
        </footer>
    );
}

function EncabezadoPagina({ etiqueta, titulo, destacado, descripcion }) {
    return (
        <section className="encabezado-pagina">
            <p className="etiqueta">{etiqueta}</p>
            <h1>{titulo} <span>{destacado}</span></h1>
            <p>{descripcion}</p>
        </section>
    );
}

function PaginaCharlas() {
    const [estadoConexion, setEstadoConexion] = useState('cargando');

    return (
        <main>
            <EncabezadoPagina
                etiqueta="Agenda del evento"
                titulo="Charlas e ideas"
                destacado="para compartir."
                descripcion="Consulta las sesiones disponibles en la agenda del evento."
            />
            <section className="contenido-pagina">
                <div className="cabecera-lista">
                    <div>
                        <p className="etiqueta">Agenda del servidor</p>
                        <h2>Próximas sesiones</h2>
                    </div>
                    <span className="insignia" id="estado-conexion">
                        {estadoConexion === 'cargando' ? 'Conectando…' : estadoConexion === 'error' ? 'Sin conexión' : 'Conectado'}
                    </span>
                </div>
                <Listadocharlas onStatusChange={setEstadoConexion} />
            </section>
        </main>
    );
}

function PaginaPanel({ user, cargando, error, onIniciarSesion, onCerrarSesion, enviando }) {
    if (cargando) {
        return (
            <main className="panel__cargando">
                <p>Comprobando la sesión...</p>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="panel-autenticacion">
                <EncabezadoPagina
                    etiqueta="Área privada"
                    titulo="Tu evento,"
                    destacado="de un vistazo."
                    descripcion="Inicia sesión para acceder al área de gestión de AdiTech Events."
                />
                <InicioSesion onIniciarSesion={onIniciarSesion} error={error} cargando={enviando} />
            </main>
        );
    }

    return (
        <main className="panel">
            <header className="panel__cabecera">
                <div>
                    <h1>Hola, {user.nombre}</h1>
                    <p>Has iniciado sesión como {user.email}</p>
                </div>
                <button className="boton" type="button" onClick={onCerrarSesion}>Cerrar sesión</button>
            </header>
            {error && <p className="login__error panel__error" role="alert">{error}</p>}
            <section className="tarjeta-panel">
                <div className="cabecera-lista">
                    <div>
                        <p className="etiqueta">Agenda del servidor</p>
                        <h2>Charlas programadas</h2>
                    </div>
                </div>
                <Listadocharlas />
            </section>
        </main>
    );
}

function Contenido({ seccion, ...panelProps }) {
    switch (seccion) {
        case 'charlas':
            return <PaginaCharlas />;
        case 'ponentes':
            return <Ponentes />;
        case 'planes':
            return <Planes />;
        case 'contacto':
            return <Contacto />;
        case 'panel':
            return <PaginaPanel {...panelProps} />;
        default:
            return <Inicio />;
    }
}

export default function App() {
    const [seccion, setSeccion] = useState(leerSeccion);
    const [user, setUser] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        function cambiarSeccion() {
            const hash = window.location.hash.slice(1);
            const siguiente = leerSeccion();
            setSeccion(siguiente);

            if (secciones.includes(hash)) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }

        window.addEventListener('hashchange', cambiarSeccion);
        return () => window.removeEventListener('hashchange', cambiarSeccion);
    }, []);

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

    return (
        <>
            <Cabecera seccion={seccion} />
            <Contenido
                seccion={seccion}
                user={user}
                cargando={cargando}
                error={error}
                onIniciarSesion={iniciarSesion}
                onCerrarSesion={cerrarSesion}
                enviando={enviando}
            />
            <Pie />
        </>
    );
}
