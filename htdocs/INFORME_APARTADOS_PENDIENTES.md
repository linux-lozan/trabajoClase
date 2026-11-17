# Informe de apartados pendientes — AdiTech Events

**Fecha de revisión:** 6 de noviembre de 2026  
**Base de revisión:** inspección del código y documentación disponibles. La
última validación de Docker/MySQL y del endpoint se realizó el 5 de noviembre.
Hoy Docker no está disponible y Windows bloqueó la ejecución de PHP, por lo que
no se pudieron repetir las pruebas.

La numeración corresponde a los 15 apartados del enunciado. Hay recursos CRUD y
migraciones recientes, pero no se consideran terminados los flujos que carecen
de reglas de negocio o pruebas de ejecución.

## Trabajo pendiente

### 01. Definir SABITECH y sus reglas — Parcial

- Definir qué operaciones puede realizar cada perfil y aplicar autorización.
- Definir las reglas de publicación, modificación y cancelación de charlas.
- Definir las reglas de reserva, cancelación, aforo y asistencia.
- Aplicar esas reglas en los controladores y probarlas.

### 02. Crear la empresa y el plan de personal — Pendiente

- Documentar forma jurídica, puestos, responsabilidades, contratos, costes y
  viabilidad del plan.

### 03. Diseñar y crear la base de datos — Esquema hecho; validación de cambios pendiente

- La base SQL y siete migraciones están en el proyecto; la conexión y las siete
  tablas se validaron el 5 de noviembre.
- Comprobar el estado y la ejecución de las migraciones añadidas el 6 de
  noviembre, junto con el seeder, en Docker.
- Verificar que la inicialización SQL y las migraciones conviven como se espera
  tanto en una base existente como en una instalación nueva, sin borrar datos.
- La comprobación de hoy no fue posible porque el motor Docker no estaba
  disponible.

### 04. Conectar el catálogo a la API — Parcial

- Volver a probar las rutas después del cambio de endpoint sencillo a
  controladores CRUD.
- Probar en navegador el flujo completo Vite → Laravel → MySQL.
- Cargar datos de prueba para validar la respuesta con charlas reales; el
  endpoint devolvía una lista vacía en la última comprobación.
- Decidir si el catálogo público debe mostrar solo charlas publicadas y aplicar
  ese filtro; el controlador actual lista todas.
- Conectar las demás pantallas con la API si forman parte del alcance.

### 05. Identificar usuarios y guardar reservas — Parcial

- Implementar registro/inicio de sesión y cierre de sesión.
- Proteger recursos con autenticación y permisos por perfil.
- Evitar que una persona cree, consulte o modifique reservas de otros usuarios.
- Implementar los flujos de usuario y reserva desde el frontend.
- Definir estados y transiciones permitidos en vez de aceptar operaciones CRUD
  genéricas sin las reglas del proceso.

### 06. Cancelar y proteger el aforo — Parcial

- Comprobar el aforo disponible al crear una reserva y proteger la operación
  frente a solicitudes simultáneas.
- Implementar cancelación cambiando el estado según las reglas, preservando el
  historial; no limitarse a borrar la fila.
- Probar aforo completo, reserva duplicada, cancelación y nueva reserva.

### 07. Enviar el correo de confirmación — Parcial

- Integrar un proveedor/canal de correo y enviar el mensaje en el momento
  adecuado del flujo de reserva.
- Registrar resultado, destinatario y errores en la tabla de notificaciones.
- Probar envío correcto y fallido. El CRUD existente no envía correos.

### 08. Renovar y validar el QR cada 30 segundos — Pendiente

- Crear códigos de duración limitada y renovarlos con el intervalo requerido.
- Validar en el servidor identidad, reserva y charla; impedir reutilización.
- Añadir pruebas de caducidad, repetición y QR asociado a otra reserva.

### 09. Registrar y consultar la asistencia — Parcial

- Incorporar el escaneo/validación del QR y registrar el acceso solo si la
  reserva es válida.
- Autorizar al personal que valida entradas y ofrecer consulta de asistencia.
- Añadir pruebas de acceso válido, inválido y duplicado. El CRUD actual no
  implementa este flujo.

### 10. Revisar pantallas y accesibilidad — Parcial

- Revisar teclado, foco, nombres accesibles, contraste y lectores de pantalla.
- Probar los recorridos y diseños en móvil, tableta y ordenador.
- Registrar resultados y corregir los problemas encontrados.

### 11. Preparar el entorno y desplegar — Parcial

- Configurar un despliegue real con HTTPS, secretos fuera del repositorio,
  copias de seguridad y procedimiento de recuperación.
- Documentar instalación y actualización reproducibles.
- Verificar el funcionamiento en el entorno de despliegue; Docker local no
  equivale a producción.

### 12. Analizar digitalización y el uso de IA — Pendiente

- Documentar procesos manuales y digitales, tratamiento/protección de datos y
  cómo se verificará el uso de IA.

### 13. Investigar IA con vídeos en inglés — Pendiente

- Recoger ideas aprendidas, citas y bibliografía de los vídeos.
- Preparar la exposición y documentar la comprensión del material.

### 14. Mantener la memoria y las pruebas — Parcial

- Añadir pruebas específicas para CRUD, validaciones, permisos, reservas,
  capacidad, correo, QR y asistencia.
- Ejecutar las pruebas contra SQLite de tests y comprobar integración en MySQL.
- Registrar decisiones, incidencias y resultados. Las pruebas actuales son solo
  ejemplos de Laravel.
- Repetir las comprobaciones bloqueadas hoy cuando PHP y Docker estén disponibles.

### 15. Preparar las dos presentaciones — Pendiente

- Preparar la presentación de avances y la presentación final, incluyendo
  demostración, resultados, límites conocidos y material de apoyo.

## Prioridad sugerida

1. Levantar Docker y comprobar migraciones, rutas y API actualizadas.
2. Implementar autenticación/autorización, reservas y control de aforo.
3. Completar QR, asistencia y envío de correo.
4. Añadir pruebas de integración y revisar accesibilidad.
5. Preparar despliegue, análisis, investigación y presentaciones.

Consulta [INFORME_APARTADOS_REALIZADOS.md](./INFORME_APARTADOS_REALIZADOS.md)
para ver la evidencia de lo implementado.
