# Informe de apartados realizados — AdiTech Events

**Fecha de revisión:** 6 de noviembre de 2026  
**Base de revisión:** inspección del código y documentación disponibles. La
última validación de Docker/MySQL y del endpoint se realizó el 5 de noviembre.
Hoy Docker no está disponible y Windows bloqueó la ejecución de PHP, por lo que
no se pudieron repetir las pruebas.

Este informe diferencia funcionalidades implementadas, bases parciales y
aspectos pendientes. La numeración corresponde a los 15 apartados del enunciado.

## Apartados con trabajo implementado

### 01. Definir SABITECH y sus reglas — Parcial

- El esquema contempla los perfiles administrador, organizador, personal y
  asistente.
- Hay tablas para charlas, salas, reservas, asistencias y notificaciones, con
  estados, claves foráneas e índices.
- La base incluye una restricción que impide reservas activas duplicadas para
  el mismo usuario y charla.
- Faltan las reglas de negocio y permisos aplicados por la aplicación; véase el
  informe de pendientes.

### 03. Diseñar y crear la base de datos — Esquema implementado

- Existe el SQL de creación de las siete tablas del dominio y la configuración
  para inicializar MySQL con ese SQL en un volumen nuevo.
- Se añadieron siete migraciones Laravel para roles, salas, usuarios, charlas,
  reservas, asistencias y notificaciones, además de un seeder.
- El seeder incluye datos de desarrollo; no se ha ejecutado ni validado en la
  base activa tras su incorporación.
- Los siete modelos Eloquent mapean las tablas y claves del esquema y declaran
  relaciones y conversiones de tipos.
- El 5 de noviembre se comprobó que Laravel conectaba con MySQL 8.4.13, veía las
  siete tablas y que los modelos podían consultarlas.
- Las migraciones nuevas y el seeder no se han podido validar hoy en una base
  activa. La tabla `charlas` estaba vacía en la comprobación anterior.

### 04. Conectar el catálogo a la API — Parcial

- `routes/api.php` declara recursos API para roles, salas, usuarios, charlas,
  reservas, asistencias y notificaciones.
- Hay controladores CRUD con validación de los campos recibidos.
- La página de charlas usa `fetch('/api/charlas')`; Vite tiene un proxy hacia
  Laravel en `http://localhost:8080`.
- El endpoint de lectura respondió HTTP 200 el 5 de noviembre, antes de los
  cambios recientes de rutas/controladores. Hoy no se pudo volver a ejecutar.
- El frontend solo consume el catálogo de charlas; las demás páginas no usan
  estos recursos API.

### 05. Identificar usuarios y guardar reservas — CRUD parcial

- Hay recursos API y controladores CRUD para usuarios y reservas, además de sus
  tablas y modelos.
- La creación valida campos y referencias existentes.
- No hay flujo de inicio de sesión ni autorización; los endpoints no aplican
  propiedad de reserva ni reglas de acceso por perfil.

### 06. Cancelar y proteger el aforo — Protección parcial en base de datos

- El esquema previene reservas activas duplicadas del mismo usuario y charla.
- El controlador de reservas permite operaciones CRUD, pero no implementa el
  control de capacidad ni un flujo de cancelación con reglas de negocio.

### 07. Enviar el correo de confirmación — Registro parcial

- Existe un recurso API CRUD y un modelo para notificaciones asociadas a
  reservas, con destinatario, tipo y estado.
- El controlador solo administra registros; no envía correos.

### 09. Registrar y consultar la asistencia — CRUD parcial

- Existe un recurso API CRUD y un modelo para asistencias vinculadas a reservas
  y usuarios validadores.
- No hay validación de QR ni flujo de acceso con permisos.

### 10. Revisar pantallas y accesibilidad — Prototipo visual

- Hay páginas HTML/CSS para inicio, charlas, ponentes, planes, contacto y panel.
- Los estilos incluyen reglas adaptables a pantallas estrechas y movimiento
  reducido; la página de charlas anuncia estados de carga y error.
- No se ha documentado una auditoría de accesibilidad ni pruebas en dispositivos.

### 11. Preparar el entorno — Desarrollo local

- Hay configuración Docker para Laravel/Apache/PHP y MySQL, con guía de
  arranque local.
- No consta despliegue en un entorno de producción.

### 14. Mantener memoria y pruebas — Documentación y estructura inicial

- Existen documentación del back-end e informes de estado.
- Laravel contiene pruebas de ejemplo, pero no pruebas específicas para los
  recursos API ni las reglas de negocio.

## Apartados sin evidencias de implementación

- **02. Empresa y plan de personal:** no se encontró documentación del plan.
- **08. QR renovable cada 30 segundos:** no se encontró implementación.
- **12. Digitalización y uso de IA:** no se encontró análisis documentado.
- **13. Investigación de IA con vídeos en inglés:** no se encontró
  investigación, bibliografía ni presentación.
- **15. Dos presentaciones:** no se encontraron materiales de presentación.

Consulta [INFORME_APARTADOS_PENDIENTES.md](./INFORME_APARTADOS_PENDIENTES.md)
para los huecos y las siguientes tareas.
