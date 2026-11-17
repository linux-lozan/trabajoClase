# Informe del alcance de AdiTech Events

**Fecha:** 6 de noviembre de 2026  
**Alcance:** estado del proyecto contrastado con el código disponible. La última
validación con Docker/MySQL fue el 5 de noviembre; hoy no se pudo repetir.

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
- Siete migraciones Laravel para las tablas del dominio y un seeder de
  desarrollo.
- Controladores CRUD con validaciones básicas y recursos API para roles, salas,
  usuarios, charlas, reservas, asistencias y notificaciones.
- Integración de la página de charlas con `/api/charlas` mediante el proxy de
  desarrollo de Vite.
- Retirada de los datos de prueba precargados del frontend y de las funciones
  locales de registro, inicio de sesión, reservas, paneles y envío de contacto.
- Conservación de las páginas y estilos informativos, con avisos donde la
  información depende de la conexión a la base de datos o de servicios aún no
  implementados.

## Fuera de alcance

- Las rutas CRUD recientes no se han vuelto a validar en ejecución. La
  conexión del navegador a través de Vite tampoco se ha probado de extremo a
  extremo.
- No se ha implementado autenticación/autorización ni los flujos completos de
  reservas, control de aforo, QR, asistencia o administración de charlas.
- Solo la página de charlas consume actualmente la API; las demás páginas
  todavía no están conectadas.
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

El 5 de noviembre se comprobó con Docker que Laravel conectaba a MySQL 8.4.13 y
que la base `sabitech` contenía las siete tablas. Los siete modelos pudieron
consultarlas; se inspeccionaron las tablas `charlas` y `reservas`, y
`GET /api/charlas` respondió HTTP 200 con una lista vacía. El 6 de noviembre se
añadieron migraciones y controladores CRUD; no se pudieron probar hoy porque el
motor Docker no estaba disponible y Windows bloqueó la ejecución de PHP. El SQL
de inicialización se ejecuta automáticamente solo al crear un volumen MySQL
vacío.

Consulta [INFORME_APARTADOS_REALIZADOS.md](./INFORME_APARTADOS_REALIZADOS.md) y
[INFORME_APARTADOS_PENDIENTES.md](./INFORME_APARTADOS_PENDIENTES.md) para el
estado por apartados.
