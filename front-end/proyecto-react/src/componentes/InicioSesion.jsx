import { useState } from 'react';

export function InicioSesion({ onIniciarSesion, error, cargando }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function enviarFormulario(event) {
        event.preventDefault();
        await onIniciarSesion(email, password);
    }

    return (
        <main className="login">
            <form className="login__formulario" onSubmit={enviarFormulario}>
                <h1>Iniciar sesión</h1>
                <p>Introduce tu correo y contraseña para continuar.</p>

                <label htmlFor="email">Correo electrónico</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && <p className="login__error" role="alert">{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Comprobando...' : 'Entrar'}
                </button>
            </form>
        </main>
    );
}
