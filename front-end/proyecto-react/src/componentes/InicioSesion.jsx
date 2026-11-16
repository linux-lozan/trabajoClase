import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export function InicioSesion({ onIniciarSesion, error, cargando }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);

    async function enviarFormulario(event) {
        event.preventDefault();
        await onIniciarSesion(email, password);
    }

    return (
        <section className="login" aria-label="Formulario de inicio de sesión">
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
                <div className="password-input-wrapper">
                    <input
                        id="password"
                        name="password"
                        type={mostrarPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setMostrarPassword(!mostrarPassword)}
                        aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {mostrarPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                </div>

                {error && <p className="login__error" role="alert">{error}</p>}

                <button type="submit" disabled={cargando}>
                    {cargando ? 'Comprobando...' : 'Entrar'}
                </button>
            </form>
        </section>
    );
}
