function EncabezadoPagina({ etiqueta, titulo, destacado, descripcion }) {
    return (
        <section className="encabezado-pagina">
            <p className="etiqueta">{etiqueta}</p>
            <h1>{titulo} <span>{destacado}</span></h1>
            <p>{descripcion}</p>
        </section>
    );
}

export function Inicio() {
    return (
        <main id="inicio">
            <section className="portada">
                <div className="contenido-portada">
                    <p className="etiqueta"><span className="punto" aria-hidden="true" /> Prototipo visual · AdiTech Events</p>
                    <h1>Tu próximo evento tech, <span>mejor organizado.</span></h1>
                    <p className="introduccion">
                        Una propuesta sencilla para reunir la agenda, las salas y la información
                        de cada evento tecnológico en un solo lugar.
                    </p>
                    <div className="acciones-portada">
                        <a className="boton" href="#funciones">Conocer el proyecto <span aria-hidden="true">→</span></a>
                        <a className="enlace" href="#estado">Ver estado del desarrollo</a>
                    </div>
                </div>
                <aside className="tarjeta-agenda" aria-label="Vista previa de una agenda de ejemplo">
                    <div className="agenda-cabecera">
                        <div>
                            <p className="etiqueta etiqueta-oscura">Vista previa</p>
                            <h2>Agenda del evento</h2>
                        </div>
                        <span className="insignia">Ejemplo</span>
                    </div>
                    <div className="agenda-fila">
                        <time>09:30</time>
                        <div><strong>Recepción de asistentes</strong><span>Acceso principal</span></div>
                        <span className="agenda-punto" aria-hidden="true" />
                    </div>
                    <div className="agenda-fila">
                        <time>10:00</time>
                        <div><strong>Bienvenida</strong><span>Sala principal</span></div>
                        <span className="agenda-punto" aria-hidden="true" />
                    </div>
                    <div className="agenda-fila">
                        <time>11:00</time>
                        <div><strong>Charlas y talleres</strong><span>Programa por definir</span></div>
                        <span className="agenda-punto agenda-punto-azul" aria-hidden="true" />
                    </div>
                    <p className="nota-ejemplo">Contenido ilustrativo; la agenda real dependerá de la conexión con el back-end.</p>
                </aside>
                <div className="decoracion" aria-hidden="true" />
            </section>

            <section className="seccion" id="proyecto">
                <div className="seccion-titulo">
                    <p className="etiqueta">01 / El proyecto</p>
                    <h2>Menos caos. <span>Más evento.</span></h2>
                </div>
                <p className="seccion-texto">
                    AdiTech Events es una aplicación pensada para ayudar a organizar eventos
                    tecnológicos: desde la planificación de las charlas y las salas hasta la
                    asistencia de los participantes.
                </p>
            </section>

            <section className="seccion seccion-funciones" id="funciones">
                <div className="seccion-titulo">
                    <p className="etiqueta">02 / Lo que se está preparando</p>
                    <h2>Todo en su sitio.</h2>
                </div>
                <div className="rejilla-funciones">
                    <article className="tarjeta-funcion">
                        <span className="numero">01</span>
                        <h3>Charlas y salas</h3>
                        <p>Organización del programa, los espacios y la capacidad de cada sala.</p>
                    </article>
                    <article className="tarjeta-funcion">
                        <span className="numero">02</span>
                        <h3>Reservas</h3>
                        <p>Gestión de las plazas de los asistentes cuando esté disponible el servicio.</p>
                    </article>
                    <article className="tarjeta-funcion">
                        <span className="numero">03</span>
                        <h3>Control de acceso</h3>
                        <p>Preparación para validar la asistencia y agilizar la entrada al evento.</p>
                    </article>
                </div>
            </section>

            <section className="estado" id="estado">
                <div>
                    <p className="etiqueta etiqueta-oscura">03 / Estado actual</p>
                    <h2>La web es una maqueta visual.</h2>
                    <p>
                        La página de charlas ya consulta la agenda al back-end. Las reservas,
                        el inicio de sesión y el resto de funciones todavía no están conectados.
                    </p>
                </div>
                <span className="estado-insignia"><span className="punto" aria-hidden="true" /> Desarrollo en curso</span>
            </section>
        </main>
    );
}

export function Ponentes() {
    return (
        <main>
            <EncabezadoPagina
                etiqueta="Personas que inspiran"
                titulo="Voces con algo"
                destacado="que contar."
                descripcion="Un espacio preparado para presentar a las personas que participan en los eventos."
            />
            <section className="contenido-pagina">
                <div className="ponentes-aviso">
                    <span className="ponentes-aviso__icono" aria-hidden="true">01</span>
                    <div>
                        <p className="etiqueta">Apartado pendiente</p>
                        <h2>Estamos preparando este espacio.</h2>
                        <p>
                            El esquema actual de la base de datos no incluye información de ponentes.
                            Antes de publicar perfiles reales, será necesario definir y conectar esos datos.
                        </p>
                    </div>
                </div>
                <div className="rejilla-funciones ponentes-funciones">
                    <article className="tarjeta-funcion"><span className="numero">01</span><h3>Perfil profesional</h3><p>Nombre, biografía y especialidad de cada ponente, cuando los datos estén disponibles.</p></article>
                    <article className="tarjeta-funcion"><span className="numero">02</span><h3>Charlas relacionadas</h3><p>Vínculo entre las personas participantes y las sesiones del programa.</p></article>
                    <article className="tarjeta-funcion"><span className="numero">03</span><h3>Información verificada</h3><p>Los perfiles se mostrarán cuando el modelo de datos esté definido.</p></article>
                </div>
            </section>
        </main>
    );
}

export function Planes() {
    return (
        <main>
            <EncabezadoPagina
                etiqueta="Opciones para cada evento"
                titulo="Planes pensados"
                destacado="para crecer."
                descripcion="Una propuesta de estructura. Los precios, condiciones y la contratación todavía no están configurados."
            />
            <section className="contenido-pagina rejilla-planes">
                <article className="tarjeta-plan">
                    <p className="etiqueta">Para empezar</p><h2>Meetup</h2>
                    <p className="descripcion-plan">Una opción sencilla para encuentros y eventos pequeños.</p>
                    <p className="precio-plan">Por definir</p>
                    <ul><li>Información del evento</li><li>Programa de charlas</li><li>Gestión básica de salas</li></ul>
                    <a className="boton boton-claro" href="#contacto">Consultar propuesta <span aria-hidden="true">→</span></a>
                </article>
                <article className="tarjeta-plan plan-destacado">
                    <span className="insignia">Propuesta</span>
                    <p className="etiqueta">Para equipos</p><h2>Pro</h2>
                    <p className="descripcion-plan">Herramientas para coordinar jornadas con varias sesiones.</p>
                    <p className="precio-plan">Por definir</p>
                    <ul><li>Programa y organización de salas</li><li>Control de capacidad previsto</li><li>Gestión de asistentes por implementar</li></ul>
                    <a className="boton" href="#contacto">Consultar propuesta <span aria-hidden="true">→</span></a>
                </article>
                <article className="tarjeta-plan">
                    <p className="etiqueta">Para organizaciones</p><h2>Enterprise</h2>
                    <p className="descripcion-plan">Una propuesta adaptable a eventos y necesidades de mayor escala.</p>
                    <p className="precio-plan">Por definir</p>
                    <ul><li>Condiciones personalizadas</li><li>Integraciones por definir</li><li>Soporte por concretar</li></ul>
                    <a className="boton boton-claro" href="#contacto">Consultar propuesta <span aria-hidden="true">→</span></a>
                </article>
            </section>
            <p className="aviso-pagina aviso-centro">Estos planes son orientativos. No hay precios ni contratación disponibles en esta maqueta.</p>
        </main>
    );
}

export function Contacto() {
    return (
        <main>
            <EncabezadoPagina
                etiqueta="Hablemos de tu evento"
                titulo="¿Qué tienes"
                destacado="en mente?"
                descripcion="Este espacio está preparado para consultas sobre la plataforma y la organización de eventos."
            />
            <section className="contenido-pagina distribucion-contacto">
                <div className="contacto-texto">
                    <p className="etiqueta">Contacto</p>
                    <h2>Estamos preparando el canal de comunicación.</h2>
                    <p>Los datos de contacto y el envío de mensajes se definirán cuando se implemente el servicio correspondiente.</p>
                    <div className="contacto-nota"><span className="punto" aria-hidden="true" /><span>Proyecto académico · 2.º DAW</span></div>
                </div>
                <div className="tarjeta-formulario">
                    <p className="etiqueta">Formulario de ejemplo</p>
                    <h2>Envíanos un mensaje</h2>
                    <p className="aviso-formulario">Este formulario es solo una vista previa y no envía información.</p>
                    <form>
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" name="nombre" type="text" placeholder="Tu nombre" disabled />
                        <label htmlFor="correo">Correo electrónico</label>
                        <input id="correo" name="correo" type="email" placeholder="tu@correo.com" disabled />
                        <label htmlFor="mensaje">Mensaje</label>
                        <textarea id="mensaje" name="mensaje" rows="4" placeholder="Cuéntanos sobre tu evento" disabled />
                        <button className="boton" type="button" disabled>Envío no disponible</button>
                    </form>
                </div>
            </section>
        </main>
    );
}
