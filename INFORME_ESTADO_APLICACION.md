# Informe del alcance de AdiTech Events

**Fecha:** 5 de noviembre de 2026  
**Alcance acordado:** configuración del back-end Docker/Laravel, modelos
Eloquent para el esquema SQL existente y limpieza de las funciones simuladas
del frontend.

## Realizado

- Configuración Docker para Laravel con Apache y PHP, incluyendo la extensión
  `pdo_mysql`.
- Servicio MySQL 8.4 en `back-end/compose.yaml`.
- Conexión de Laravel a MySQL por el nombre del servicio Docker (`db`), con la
  base `sabitech`.
- Montaje del archivo `data-base/sabitech_.sql` como script de inicialización
  del contenedor MySQL.
- Configuración de los modelos Eloquent con los nombres de tabla y claves
  primarias personalizados definidos por el esquema:
  - `Role` → `roles.id_rol`
  - `Sala` → `salas.id_sala`
  - `User` → `usuarios.id_usuario`
  - `Charla` → `charlas.id_charla`
  - `Reserva` → `reservas.id_reserva`
  - `Asistencia` → `asistencias.id_asistencia`
  - `NotificacionEmail` → `notificaciones_email.id_email`
- Relaciones entre usuarios, roles, charlas, salas, reservas, asistencias y
  notificaciones.
- Casts para fechas, capacidades, booleanos y hash de contraseña.
- Valores de desarrollo documentados en `app/.env.example` y pasos de arranque
  en `back-end/README.md`.
- Retirada de los datos de prueba precargados del frontend y de las funciones
  locales de registro, inicio de sesión, reservas, paneles y envío de contacto.
- Conservación de las páginas y estilos informativos, con avisos donde la
  información depende de la conexión a la base de datos o de servicios aún no
  implementados.

## Fuera de alcance

- Hay un endpoint de solo lectura `GET /api/charlas`; falta implementar el resto
  de operaciones de la API.
- La página de charlas del frontend consulta ese endpoint mediante el proxy de
  desarrollo de Vite. El resto del frontend todavía no está conectado.
- No se ha implementado registro, autenticación, reserva persistente ni
  administración de charlas en el servidor.
- El SQL proporcionado no contiene tablas de ponentes, por lo que no se han
  añadido modelos o relaciones para ponentes.
- El envío del formulario de contacto, los precios y las notificaciones reales
  no están configurados.

## Puesta en marcha

Desde `back-end`, copia `app/.env.example` a `app/.env`, inicia Docker y genera
la clave de Laravel:

```powershell
docker compose up -d --build
docker compose exec web php artisan key:generate
```

En un volumen MySQL nuevo, Docker ejecuta `data-base/sabitech_.sql` al iniciar
la base. En volúmenes inicializados con anterioridad, el script no se vuelve a
ejecutar automáticamente.

## Validación

Se comprobó con los contenedores Docker en ejecución que Laravel conecta a
MySQL 8.4.13 y a la base `sabitech`. Laravel detecta las siete tablas; los siete
modelos Eloquent pudieron consultar sus tablas. Se inspeccionaron las columnas,
índices y relaciones de `charlas` y `reservas`. El endpoint `GET /api/charlas`
respondió HTTP 200 con una lista vacía porque todavía no hay charlas cargadas.
El SQL de inicialización de Docker se ejecuta automáticamente solo al crear un
volumen MySQL nuevo.
