# Preparar el proyecto y cargar los datos de demostración

Requisitos: Docker Desktop iniciado y una copia actualizada del proyecto. Los
comandos son para PowerShell.

## Primera instalación en un equipo

Desde la carpeta `trabajoClase\back-end`:

1. Crea `app\.env` solo si todavía no existe. No sobrescribas un `.env` ya
   configurado:

   ```powershell
   Copy-Item app\.env.example app\.env
   ```

2. Construye e inicia Laravel y MySQL:

   ```powershell
   docker compose up -d --build
   ```

3. Instala dependencias y genera la clave de Laravel. La clave se genera una
   sola vez para esta instalación; no la regeneres en cada arranque:

   ```powershell
   docker compose exec web composer install
   docker compose exec web php artisan key:generate
   ```

4. Prepara el esquema y carga los datos comunes:

   ```powershell
   docker compose exec web php artisan migrate
   docker compose exec web php artisan db:seed
   ```

   El seeder principal actualiza los cuatro roles y sus descripciones, crea el
   usuario de prueba `test@example.com` si falta y llama a
   `CharlasDemoSeeder`, que crea el organizador, 3 salas y 5 charlas si faltan.
   El organizador de prueba es `organizador@aditech.test` / `password`.

5. Comprueba los datos en el navegador:

   - `http://localhost:8080/api/roles`
   - `http://localhost:8080/api/salas`
   - `http://localhost:8080/api/charlas`

## Si ya tienen el proyecto instalado

No hace falta repetir `composer install`, `key:generate` ni `up -d --build`
cada vez. Desde `trabajoClase\back-end`, si los contenedores están detenidos:

```powershell
docker compose up -d
```

Después de recibir cambios de seeders, para aplicar los roles y datos de
demostración actualizados a la base local:

```powershell
docker compose exec web php artisan db:seed
```

`db:seed` puede repetirse: actualiza las descripciones de los roles y no crea
duplicados para los registros de demostración existentes. `migrate` se ejecuta
cuando hay migraciones nuevas o se prepara una base de datos nueva.

## Importante

- Usa consistentemente `docker compose` desde `back-end`. Añadir
  `-p sabitech_clean` selecciona otro proyecto Docker y, por tanto, puede usar
  otro contenedor y otro volumen de base de datos. Si ya iniciaron el proyecto
  con `-p sabitech_clean`, mantengan ese prefijo en todos los comandos; por
  ejemplo:

  ```powershell
  docker compose -p sabitech_clean up -d
  docker compose -p sabitech_clean exec web php artisan db:seed
  ```

  Si lo iniciaron sin `-p`, sigan usando los comandos sin ese prefijo. No
  cambien entre ambas formas.
- Cada compañero tiene su propia base de datos local; cargar estos datos no
  modifica las bases de datos de los demás.
- No ejecutes `docker compose down -v`: `-v` elimina el volumen local de MySQL
  y los datos guardados en él.
- El SQL `../data-base/sabitech_.sql` se importa al inicializar un volumen
  MySQL nuevo. Si el volumen ya existe, Docker no vuelve a importar ese SQL.
