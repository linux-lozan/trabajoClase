<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('charlas')) {
            return;
        }

        Schema::create('charlas', function (Blueprint $table) {
            $table->unsignedInteger('id_charla')->primary()->autoIncrement();
            $table->unsignedInteger('id_organizador');
            $table->unsignedInteger('id_sala');
            $table->string('titulo', 200);
            $table->text('descripcion')->nullable();
            $table->date('fecha');
            $table->time('hora_inicio');
            $table->time('hora_fin');
            $table->unsignedInteger('aforo_maximo');
            $table->enum('estado', ['borrador', 'publicada', 'cancelada', 'finalizada'])->default('borrador');

            $table->index('fecha', 'idx_charlas_fecha');
            $table->foreign('id_organizador')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
            $table->foreign('id_sala')->references('id_sala')->on('salas')->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('charlas');
    }
};
