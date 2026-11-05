# Informe de apartados pendientes — AdiTech Events

**Fecha de revisión:** 5 de noviembre de 2026  
**Base de revisión:** archivos del proyecto y comprobación con los contenedores
Docker en ejecución el 5 de noviembre de 2026.

La numeración corresponde a los 15 apartados del enunciado. “Pendiente” indica
que no se encontró una implementación funcional; “parcial” indica que existe
una estructura o prototipo, pero falta completar y validar el comportamiento.

## Pendientes y trabajo restante

### 04. Conectar el catálogo a la API — Parcial

- Probar el recorrido completo desde la página servida por Vite con Laravel y
  MySQL activos; la API respondió HTTP 200 directamente, pero el proxy del
  navegador no se verificó en esta revisión.
- Añadir, si lo requiere el catálogo, consulta de detalle y tratamiento de
  estados de publicación.
- Cargar charlas de prueba para validar la representación de resultados no
  vacíos. Actualmente la tabla `charlas` está vacía.

### 05. Identificar usuarios y guardar reservas — Pendiente

- Implementar registro e inicio de sesión seguros.
- Proteger rutas y aplicar permisos según el perfil.
- Implementar creación y consulta persistente de reservas.
- Conectar las pantallas correspondientes con esos endpoints.

### 06. Cancelar y proteger el aforo — Pendiente

- Implementar cancelación de reservas y liberación de plazas.
- Rechazar reservas cuando se alcance el aforo.
- Evitar que operaciones simultáneas excedan la capacidad.
- Añadir pruebas para duplicados, cancelaciones y límites de capacidad.

### 07. Enviar el correo de confirmación — Pendiente

- Implementar el envío al reservar y registrar el resultado en
  `notificaciones_email`.
- Configurar un proveedor y destinatario de prueba.
- Probar los casos de éxito y error de envío.

### 08. Renovar y validar el QR cada 30 segundos — Pendiente

- No se encontró implementación de generación, renovación o validación de QR.
- Definir caducidad en el servidor y verificar identidad, charla y reutilización
  del código.

### 09. Registrar y consultar la asistencia — Pendiente

- Implementar lectura/validación del QR y registro del acceso.
- Aplicar permisos al personal y al panel de organización.
- Mostrar y consultar los registros de asistencia.

### 10. Revisar pantallas y accesibilidad — Parcial

- Probar todas las páginas en móvil, tableta y escritorio.
- Revisar navegación por teclado, etiquetas, foco, contraste y lectores de
  pantalla.
- Corregir los problemas encontrados y documentar los resultados.

### 11. Preparar el entorno y desplegar — Parcial

- Configurar el despliegue real, Git e instalación reproducible.
- Añadir HTTPS, gestión segura de credenciales, copias de seguridad y
  recuperación.
- Verificar el funcionamiento fuera del entorno local de Docker.

### 12. Analizar digitalización y el uso de IA — Pendiente

- No se encontró análisis documentado sobre gestión manual/digital, datos,
  protección ni verificación del uso de IA.

### 13. Investigar IA con vídeos en inglés — Pendiente

- No se encontró documentación de ideas comprendidas, citas, bibliografía,
  exposición ni evidencias de investigación.

### 14. Mantener la memoria y las pruebas — Parcial

- Registrar decisiones, incidencias y cambios relevantes del proyecto.
- Crear pruebas específicas para API, base de datos, autenticación, reservas,
  aforo, correos, QR y asistencia.
- Ejecutar y documentar pruebas funcionales e integración.

### 15. Preparar las dos presentaciones — Pendiente

- No se encontraron evidencias de las presentaciones de avances ni del producto
  completo.
- Preparar la presentación de noviembre y la presentación final prevista para
  febrero, con demostración y material de apoyo.

## Prioridad sugerida

1. Verificar Docker, la conexión MySQL y el endpoint de charlas.
2. Implementar autenticación, reservas, cancelación y control de aforo.
3. Añadir correo, QR y registro de asistencia.
4. Completar pruebas, accesibilidad y documentación.
5. Preparar despliegue, investigación y presentaciones.

Consulta [INFORME_APARTADOS_REALIZADOS.md](./INFORME_APARTADOS_REALIZADOS.md)
para el detalle de las estructuras y funcionalidades ya presentes.
