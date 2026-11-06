Desde la carpeta back-end ejecuta:
docker compose up -d --build
docker compose exec web composer install
Después crea la clave de Laravel y limpia la configuración:
docker compose exec web php artisan key:generate
docker compose exec web php artisan config:clear
Comprueba que quedó instalado:
docker compose exec web ls -l vendor/autoload.php
Si aparece el archivo, recarga http://localhost:8080.
