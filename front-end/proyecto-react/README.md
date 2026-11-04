# AdiTech Events

La interfaz está en `public/assets` y usa la API de Laravel para leer el
catálogo y guardar las cuentas y reservas. Ya no utiliza `localStorage` como
fuente de datos. El cliente HTTP está en `public/assets/js/api.js`.

## Desarrollo local

1. Desde `back-end`, inicia los servicios con `docker compose up -d --build`.
2. Crea el esquema y los roles iniciales con
   `docker compose exec web php artisan migrate --seed`.
3. Desde esta carpeta, ejecuta `npm run dev` y abre la URL indicada por Vite.
   Las llamadas a `/api` se reenvían al backend de `http://127.0.0.1:8080`.
   Puedes cambiar el destino con `VITE_API_PROXY_TARGET` en `.env.local`.

El `.env` de Laravel debe apuntar a MySQL (`DB_HOST=db` dentro de Compose).
El primer arranque no crea charlas de ejemplo: el catálogo muestra las charlas
publicadas que existan en la base de datos. La migración incluye las tablas de
ponentes y su relación con las charlas.

La API incluye `GET /api/charlas`, `GET /api/ponentes`, `GET /api/salas`,
`GET /api/user`, `POST /api/login`, `POST /api/register`, `POST /api/logout`,
`GET /api/reservas`, `POST /api/charlas/{id}/reservas` y
`DELETE /api/reservas/{id}`. La autenticación utiliza sesión de Laravel y
protección CSRF; las reservas se validan y persisten en MySQL.

Las operaciones de administración, creación de charlas y validación de
asistencia todavía no están expuestas por esta API.
