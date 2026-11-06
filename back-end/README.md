# Configuración del back-end

## Alcance

Este back-end contiene la configuración Docker de Laravel y MySQL, los modelos
Eloquent correspondientes al esquema definido en `data-base/sabitech_.sql`,
migraciones para las tablas del dominio y recursos API CRUD para roles, salas,
usuarios, charlas, reservas, asistencias y notificaciones. La página de charlas
del frontend consume `/api/charlas` mediante el proxy de desarrollo de Vite.
La autenticación, autorización y reglas completas de negocio aún no están
implementadas.

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

## API disponible

Las rutas API se definen en `routes/api.php` usando recursos CRUD. Para
desarrollo, la configuración de Vite reenvía las peticiones `/api` a
`http://localhost:8080`. Inicia Laravel/MySQL con Docker y el frontend con
`npm run dev` desde `front-end/proyecto-react`. El endpoint de charlas respondió
correctamente en la comprobación del 5 de noviembre; las rutas/controladores
CRUD incorporados después requieren validación en ejecución. No hay
autenticación ni autorización configuradas para proteger los recursos.

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

El esquema puede inicializarse desde el SQL proporcionado o mediante las
migraciones del dominio. Estas migraciones omiten la creación de tablas que ya
existen, para evitar recrearlas sobre una base inicializada con el SQL. Comprueba
el estado de las migraciones antes de usarlas en una base con datos y conserva
el volumen existente.
