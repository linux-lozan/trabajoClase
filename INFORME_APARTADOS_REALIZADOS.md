# Informe de apartados realizados — AdiTech Events

**Fecha de revisión:** 5 de noviembre de 2026  
**Base de revisión:** archivos del proyecto y comprobación con los contenedores
Docker en ejecución el 5 de noviembre de 2026.

Este informe recoge los entregables implementados, distinguiendo las bases
parciales de las funciones terminadas. La numeración corresponde a los 15
apartados del enunciado.

## Apartados realizados o con una base implementada

### 01. Definir SABITECH y sus reglas — Parcial

- El esquema contempla roles de administrador, organizador, personal y
  asistente.
- Las tablas definen charlas, salas, reservas, estados y registros de asistencia.
- Hay restricciones de base de datos para relaciones y para impedir reservas
  activas duplicadas del mismo usuario en una charla.
- La aplicación todavía no aplica todas las reglas de negocio, como el control
  de aforo o los permisos por perfil.

### 03. Diseñar y crear la base de datos — Implementado y validado

- Existe el esquema SQL para usuarios, roles, salas, charlas, reservas,
  asistencias y notificaciones por correo.
- Se incluyen claves foráneas, estados y restricciones de integridad.
- Docker configura MySQL 8.4 y monta el SQL para inicializar un volumen nuevo.
- Laravel cuenta con modelos Eloquent mapeados a las tablas y claves del
  esquema, con relaciones y conversiones de tipos.
- Se verificó la conexión de Laravel a MySQL 8.4.13, base `sabitech`, en Docker.
- Laravel detecta las siete tablas y todos los modelos Eloquent pudieron
  consultar su tabla.
- Se inspeccionaron las columnas, claves foráneas e índices de `charlas` y
  `reservas`; la base incluye la restricción única de reserva activa.
- Las tablas contienen los cuatro roles iniciales. Usuarios, salas, charlas,
  reservas, asistencias y notificaciones están vacíos actualmente.

### 04. Conectar el catálogo a la API — Primera versión implementada

- Laravel registra `GET /api/charlas`, que devuelve los campos básicos de las
  charlas.
- La página de charlas solicita `/api/charlas` y representa los datos recibidos.
- Vite tiene un proxy de desarrollo para reenviar `/api` a Laravel.
- Se consultó el endpoint con Laravel y MySQL en ejecución; respondió HTTP 200
  con una lista vacía, coherente con que no hay charlas cargadas.
- La integración a través del proxy del navegador no se probó de extremo a
  extremo y no hay endpoint de detalle.

### 05. Identificar usuarios y guardar reservas — Estructura parcial

- El esquema y los modelos contemplan usuarios y reservas, incluyendo su
  relación con las charlas.
- No existe todavía el flujo de autenticación ni un endpoint para crear y
  consultar reservas.

### 06. Cancelar y proteger el aforo — Restricción parcial

- La base contempla estados de reserva y una restricción contra reservas
  activas duplicadas.
- La aplicación aún no implementa cancelaciones ni valida el aforo máximo.

### 07. Enviar el correo de confirmación — Estructura parcial

- Existe una tabla y un modelo para registrar notificaciones asociadas a
  reservas, con estados de envío.
- No está implementado el proceso que envía el correo ni su confirmación.

### 09. Registrar y consultar la asistencia — Estructura parcial

- El esquema y el modelo contemplan asistencias vinculadas a una reserva y a un
  usuario validador.
- No hay endpoints ni pantallas funcionales para registrar o consultar accesos.

### 10. Revisar pantallas y accesibilidad — Interfaz visual inicial

- Hay páginas HTML y estilos para inicio, charlas, ponentes, planes, contacto y
  panel.
- La agenda de charlas ya tiene estados de carga, error y ausencia de resultados.
- No consta una auditoría de accesibilidad ni pruebas sistemáticas en móvil,
  tableta y ordenador.

### 11. Preparar el entorno — Desarrollo local configurado

- Hay una configuración Docker para Laravel con Apache/PHP y MySQL.
- El README del back-end describe los pasos de arranque local.
- No se ha configurado ni verificado un despliegue, HTTPS, copias de seguridad
  o recuperación.

### 14. Mantener memoria y pruebas — Base mínima

- Hay documentación de arranque y del mapeo de modelos.
- Laravel incluye la infraestructura de pruebas y pruebas de ejemplo.
- No se identifican pruebas específicas de los flujos de AdiTech ni un registro
  de decisiones y resultados de pruebas funcionales.

## Archivos de referencia

- `data-base/sabitech_.sql`
- `back-end/compose.yaml`
- `back-end/app/app/Models/`
- `back-end/app/routes/api.php`
- `front-end/proyecto-react/vite.config.js`
- `front-end/proyecto-react/public/assets/charlas.html`
- `front-end/proyecto-react/public/assets/js/charlas.js`

Consulta [INFORME_APARTADOS_PENDIENTES.md](./INFORME_APARTADOS_PENDIENTES.md)
para los trabajos pendientes y los aspectos que faltan en los apartados
parcialmente implementados.
