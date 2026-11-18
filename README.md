# Sabitech - Plataforma de gestión de charlas

Este repositorio contiene el proyecto completo de una aplicación web para gestionar un evento tecnológico con agenda de charlas, reservas, usuarios y panel de administración. La solución está dividida en tres partes principales:

- Backend en Laravel para la API REST y la autenticación.
- Frontend en React + Vite para la experiencia de usuario.
- Base de datos MySQL con esquema inicial y datos de prueba.

La app permite consultar la programación de charlas, iniciar sesión, reservar plazas y gestionar los recursos del evento desde un panel web.

## Objetivo del proyecto

Desarrollar una plataforma para un evento de tecnología donde los usuarios puedan:

- ver la agenda de charlas y sus detalles,
- consultar salas, aforo y disponibilidad,
- iniciar sesión con usuario/administrador,
- reservar plazas en sesiones concretas,
- consultar sus reservas personales,
- acceder a un panel de gestión con datos del evento.

## Stack tecnológico

- PHP 8.3 + Laravel 13
- React 19 + Vite
- MySQL 8.4
- Docker + Docker Compose
- HTML/CSS/JS moderno

## Estructura del repositorio

```text
trabajoClase/
├── README.md                     # Documentación general del proyecto
├── web.zip                       # Backup / copia del proyecto web
├── back-end/                     # API Laravel + Docker + configuración del backend
│   ├── Dockerfile
│   ├── compose.yaml
│   ├── README.md
│   ├── app/                      # Proyecto Laravel
│   └── docker/
├── data-base/                    # Script SQL base de datos y datos iniciales
│   ├── sabitech_.sql
│   ├── basedatos
│   └── usuarioADMIN
├── front-end/
│   └── proyecto-react/           # Frontend React + Vite
├── htdocs/                       # Proyecto web estático / prototipos y documentación
└── .git/
```

## Funcionalidades principales

- API REST con endpoints para roles, salas, usuarios, charlas, reservas, asistencias y notificaciones.
- Autenticación con sesión Laravel mediante `/api/login`, `/api/logout` y `/api/user`.
- Frontend con navegación de secciones como inicio, charlas, ponentes, planes, contacto y panel.
- Carga dinámica de charlas desde la API.
- Sistema de reservas y control de aforo por charla.
- Base de datos inicializada con SQL y seeders para entorno local.

## Requisitos previos

Antes de arrancar el proyecto, asegúrate de tener instalado:

- Docker Desktop o Docker Engine
- Docker Compose
- Node.js 18+ y npm
- PHP 8.3 y Composer (si quieres ejecutar Laravel fuera de Docker)

## Puesta en marcha rápida con Docker

Desde la carpeta `back-end`, prepara el entorno y arranca los tres servicios:

```powershell
if (!(Test-Path .\app\.env)) {
  Copy-Item .\app\.env.example .\app\.env
}
docker compose up --build -d
```

El contenedor del frontend ejecuta `npm run dev` automáticamente. La aplicación
queda disponible en `http://localhost:5173`, Laravel en `http://localhost:8080`
y MySQL dentro de la red Docker.

La primera vez, inicializa Laravel y los datos de demostración:

```powershell
docker compose exec web php artisan key:generate
docker compose exec web php artisan migrate
docker compose exec web php artisan db:seed
```

Para ver los mensajes de Vite:

```powershell
docker compose logs -f frontend
```

Si prefieres ejecutar el frontend fuera de Docker, desde `front-end/proyecto-react`:

```powershell
npm install
npm run dev
```

## Variables de entorno

### Backend

Se usa `.env` dentro de `back-end/app`.

Puedes copiar el ejemplo:

```bash
cp .env.example .env
```

Archivo base:

- `DB_HOST=db`
- `DB_DATABASE=sabitech`
- `DB_USERNAME=ADI_user`
- `DB_PASSWORD=change-me`

### Frontend

Al usar Docker Compose, Vite recibe la dirección interna del backend
(`http://web:80`) automáticamente. Para ejecutar el frontend fuera de Docker,
puedes usar `.env` dentro de `front-end/proyecto-react`.

Ejemplo:

```bash
cp .env.example .env
```

Configuración relevante:

- `VITE_API_URL=/api`
- `API_PROXY_TARGET=http://localhost:8080`

## Credenciales por defecto

Datos de prueba disponibles tras ejecutar los seeders:

- Administrador: `admin@gmail.com` / `1234`
- Usuario normal: `usuario@gmail.com` / `1234`
- Organizador: `organizador@gmail.com` / `1234`

## Endpoints principales de la API

La API está definida en `back-end/app/routes/api.php` y ofrece rutas para:

- `GET /api/csrf-cookie`
- `POST /api/login`
- `GET /api/user`
- `POST /api/logout`
- `GET /api/charlas`
- `GET /api/reservas`
- `POST /api/reservas`
- `GET /api/usuarios`
- `GET /api/salas`
- `GET /api/roles`
- `GET /api/asistencias`
- `GET /api/notificaciones-email`

## Comandos útiles

### Backend

```bash
docker compose exec web php artisan test

docker compose exec web php artisan migrate:fresh --seed
```

### Frontend

```bash
npm run build
npm run preview
npm run lint
```

## Documentación adicional

- Backend: `back-end/README.md`
- Frontend: `front-end/proyecto-react/README.md`
- Base de datos: `data-base/sabitech_.sql`

## Nota importante

Este proyecto está orientado a entorno de desarrollo local. Si se va a desplegar en otro entorno, conviene:

- cambiar credenciales por defecto,
- revisar permisos y autenticación,
- proteger rutas CRUD con autorización adecuada,
- configurar variables de entorno y dominio real.

## Resumen

`trabajoClase` es un proyecto completo de gestión de un evento tecnológico con arquitectura full-stack, pensado para demostrar integración entre frontend, backend, base de datos y Docker en un entorno realista de desarrollo web.
