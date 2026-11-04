# Informe del alcance de AdiTech Events

**Fecha:** 4 de noviembre de 2026  
**Alcance acordado:** configuración del back-end Docker/Laravel y de los modelos
Eloquent para el esquema SQL existente.

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

## Fuera de alcance

- No hay endpoints API funcionales implementados.
- El frontend no está conectado a Laravel y no se ha modificado para esta
  entrega. La web actual conserva su funcionamiento de demostración.
- No se ha implementado registro, autenticación, reserva persistente ni
  administración de charlas en el servidor.
- El SQL proporcionado no contiene tablas de ponentes, por lo que no se han
  añadido modelos o relaciones para ponentes.

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

La configuración de los modelos se debe validar contra el MySQL de Docker antes
de considerar comprobada la conexión. La importación automática del SQL solo se
produce al inicializar un volumen MySQL vacío.
