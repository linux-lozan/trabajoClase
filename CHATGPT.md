Desde la carpeta back-end ejecuta:
docker compose up -d --build
docker compose exec web composer install
Después crea la clave de Laravel y limpia la configuración:
docker compose exec web php artisan key:generate
docker compose exec web php artisan config:clear
Comprueba que quedó instalado:
docker compose exec web ls -l vendor/autoload.php
Si aparece el archivo, recarga http://localhost:8080.

A partir de ahora, para manejar esta instancia usa siempre -p sabitech_clean, por ejemplo:
docker compose -p sabitech_clean down
docker compose -p sabitech_clean up -d

## Pasos para que otro compañero cargue los datos de demostración

Requisitos: tener Docker Desktop iniciado y una copia actualizada del proyecto.
Los comandos siguientes son para PowerShell. Ejecutarlos desde la carpeta
`trabajoClase\back-end`:

1. Crear la configuración local de Laravel si todavía no existe:

   ```powershell
   Copy-Item app\.env.example app\.env
   ```

   Si `app\.env` ya existe, no lo sobrescribas.

2. Construir e iniciar Laravel y MySQL:

   ```powershell
   docker compose -p sabitech_clean up -d --build
   ```

3. Instalar las dependencias de Laravel y generar la clave de la aplicación:

   ```powershell
   docker compose -p sabitech_clean exec web composer install
   docker compose -p sabitech_clean exec web php artisan key:generate
   docker compose -p sabitech_clean exec web php artisan config:clear
   ```

4. Crear/verificar las tablas y cargar los datos de demostración:

   ```powershell
   docker compose -p sabitech_clean exec web php artisan migrate
   docker compose -p sabitech_clean exec web php artisan db:seed
   ```

   El seeder carga los roles necesarios, un organizador, 3 salas y 5 charlas.
   Se puede ejecutar de nuevo sin duplicar esos datos.

5. Comprobar que la API responde abriendo estas direcciones en el navegador:

   - `http://localhost:8080/api/salas`
   - `http://localhost:8080/api/charlas`

Cada compañero tiene su propia base de datos local; estos pasos cargan los
datos en su propio entorno. No ejecutar `docker compose down -v`: la opción
`-v` elimina el volumen local de MySQL y los datos guardados en él.
