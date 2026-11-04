# Configuración del back-end

## Alcance

Este back-end contiene la configuración Docker de Laravel y MySQL y los modelos
Eloquent correspondientes al esquema definido en
`data-base/sabitech_.sql`. No incluye endpoints funcionales de API ni conecta la
interfaz web a Laravel.

## Arranque local

1. Copia `app/.env.example` a `app/.env`.
2. Desde esta carpeta, inicia los contenedores:

   ```powershell
   docker compose up -d --build
   ```

3. Genera la clave de Laravel dentro del contenedor:

   ```powershell
   docker compose exec web php artisan key:generate
   ```

MySQL inicializa el esquema desde `../data-base/sabitech_.sql` al crear por
primera vez el volumen de datos. El script de inicialización no se vuelve a
ejecutar si el volumen ya contiene una base inicializada. No borres ese volumen
si contiene datos que quieras conservar.

Los valores `change-me` son únicamente credenciales locales de desarrollo. Para
otros entornos, define contraseñas propias en las variables que usa Compose y en
`app/.env`.

## Modelos Eloquent

Los modelos están en `app/app/Models` y se mapean explícitamente a las tablas y
claves primarias del SQL:

| Modelo | Tabla | Clave primaria |
|---|---|---|
| `Role` | `roles` | `id_rol` |
| `Sala` | `salas` | `id_sala` |
| `User` | `usuarios` | `id_usuario` |
| `Charla` | `charlas` | `id_charla` |
| `Reserva` | `reservas` | `id_reserva` |
| `Asistencia` | `asistencias` | `id_asistencia` |
| `NotificacionEmail` | `notificaciones_email` | `id_email` |

Se declaran las relaciones Eloquent y los casts para fechas, valores booleanos,
capacidades y hashes de contraseña. El SQL no define tablas de ponentes ni una
tabla intermedia de ponentes, así que no hay modelos o relaciones Eloquent para
ellas.

El esquema de la base se crea con el SQL proporcionado; no se debe ejecutar una
migración de Laravel que intente recrear esas tablas.
