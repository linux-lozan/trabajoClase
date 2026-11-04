<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tracker = 'event_api_schema_tables';
        if (! Schema::hasTable($tracker)) {
            Schema::create($tracker, function (Blueprint $table): void {
                $table->string('table_name')->primary();
            });
            DB::table($tracker)->insert(['table_name' => $tracker]);
        }

        if (! Schema::hasTable('roles')) {
            Schema::create('roles', function (Blueprint $table): void {
                $table->increments('id_rol');
                $table->string('nombre', 50)->unique();
                $table->string('descripcion')->nullable();
            });
            DB::table($tracker)->insert(['table_name' => 'roles']);
        }

        if (! Schema::hasTable('salas')) {
            Schema::create('salas', function (Blueprint $table): void {
                $table->increments('id_sala');
                $table->string('nombre', 100);
                $table->string('ubicacion')->nullable();
                $table->unsignedInteger('capacidad');
            });
            DB::table($tracker)->insert(['table_name' => 'salas']);
        }

        if (! Schema::hasTable('ponentes')) {
            Schema::create('ponentes', function (Blueprint $table): void {
                $table->increments('id_ponente');
                $table->string('nombre', 100);
                $table->string('apellidos', 150);
                $table->string('email', 150)->nullable()->unique();
                $table->text('biografia')->nullable();
                $table->string('especialidad')->nullable();
                $table->string('cargo')->nullable();
                $table->unsignedSmallInteger('experiencia')->nullable();
                $table->text('especializacion')->nullable();
                $table->json('temas')->nullable();
                $table->json('tecnologias')->nullable();
            });
            DB::table($tracker)->insert(['table_name' => 'ponentes']);
        }

        if (! Schema::hasTable('usuarios')) {
            Schema::create('usuarios', function (Blueprint $table): void {
                $table->increments('id_usuario');
                $table->unsignedInteger('id_rol');
                $table->string('nombre', 100);
                $table->string('apellidos', 150);
                $table->string('email', 150)->unique();
                $table->string('password_hash');
                $table->dateTime('fecha_registro')->useCurrent();
                $table->boolean('activo')->default(true);
                $table->foreign('id_rol')->references('id_rol')->on('roles')->cascadeOnUpdate();
            });
            DB::table($tracker)->insert(['table_name' => 'usuarios']);
        }

        if (! Schema::hasTable('charlas')) {
            Schema::create('charlas', function (Blueprint $table): void {
                $table->increments('id_charla');
                $table->unsignedInteger('id_organizador');
                $table->unsignedInteger('id_sala');
                $table->string('titulo', 200);
                $table->text('descripcion')->nullable();
                $table->date('fecha')->index();
                $table->time('hora_inicio');
                $table->time('hora_fin');
                $table->unsignedInteger('aforo_maximo');
                $table->string('estado', 20)->default('borrador')->index();
                $table->foreign('id_organizador')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
                $table->foreign('id_sala')->references('id_sala')->on('salas')->cascadeOnUpdate();
            });
            DB::table($tracker)->insert(['table_name' => 'charlas']);
        }

        if (! Schema::hasTable('charla_ponente')) {
            Schema::create('charla_ponente', function (Blueprint $table): void {
                $table->unsignedInteger('id_charla');
                $table->unsignedInteger('id_ponente');
                $table->primary(['id_charla', 'id_ponente']);
                $table->foreign('id_charla')->references('id_charla')->on('charlas')->cascadeOnUpdate()->cascadeOnDelete();
                $table->foreign('id_ponente')->references('id_ponente')->on('ponentes')->cascadeOnUpdate()->cascadeOnDelete();
            });
            DB::table($tracker)->insert(['table_name' => 'charla_ponente']);
        }

        if (! Schema::hasTable('reservas')) {
            Schema::create('reservas', function (Blueprint $table): void {
                $table->increments('id_reserva');
                $table->unsignedInteger('id_usuario');
                $table->unsignedInteger('id_charla');
                $table->dateTime('fecha_reserva')->useCurrent();
                $table->string('estado', 20)->default('pendiente');
                $table->string('observaciones')->nullable();
                $table->index(['id_charla', 'estado']);
                $table->foreign('id_charla')->references('id_charla')->on('charlas')->cascadeOnUpdate();
                $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
            });
            DB::table($tracker)->insert(['table_name' => 'reservas']);
        }

        if (! Schema::hasTable('asistencias')) {
            Schema::create('asistencias', function (Blueprint $table): void {
                $table->increments('id_asistencia');
                $table->unsignedInteger('id_reserva')->unique();
                $table->unsignedInteger('id_usuario_validador');
                $table->dateTime('fecha_hora_acceso')->useCurrent();
                $table->string('resultado', 20)->default('valida');
                $table->string('observaciones')->nullable();
                $table->foreign('id_reserva')->references('id_reserva')->on('reservas')->cascadeOnUpdate();
                $table->foreign('id_usuario_validador')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
            });
            DB::table($tracker)->insert(['table_name' => 'asistencias']);
        }

        if (! Schema::hasTable('notificaciones_email')) {
            Schema::create('notificaciones_email', function (Blueprint $table): void {
                $table->increments('id_email');
                $table->unsignedInteger('id_reserva')->index();
                $table->string('destinatario', 150);
                $table->string('tipo', 20);
                $table->dateTime('fecha_envio')->nullable();
                $table->string('estado_envio', 20)->default('pendiente');
                $table->text('error')->nullable();
                $table->foreign('id_reserva')->references('id_reserva')->on('reservas')->cascadeOnUpdate();
            });
            DB::table($tracker)->insert(['table_name' => 'notificaciones_email']);
        }

        DB::table('roles')->insertOrIgnore([
            ['nombre' => 'administrador', 'descripcion' => 'Gestión completa del sistema'],
            ['nombre' => 'organizador', 'descripcion' => 'Crea y gestiona charlas'],
            ['nombre' => 'personal', 'descripcion' => 'Valida la entrada mediante QR'],
            ['nombre' => 'asistente', 'descripcion' => 'Usuario que reserva plaza en charlas'],
        ]);
    }

    public function down(): void
    {
        $tracker = 'event_api_schema_tables';
        if (! Schema::hasTable($tracker)) {
            return;
        }

        $ownedTables = DB::table($tracker)->pluck('table_name')->all();
        foreach (['notificaciones_email', 'asistencias', 'reservas', 'charla_ponente', 'charlas', 'usuarios', 'ponentes', 'salas', 'roles'] as $table) {
            if (in_array($table, $ownedTables, true)) {
                Schema::dropIfExists($table);
            }
        }

        if (in_array($tracker, $ownedTables, true)) {
            Schema::dropIfExists($tracker);
        }
    }
};
