<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('asistencias')) {
            return;
        }

        Schema::create('asistencias', function (Blueprint $table) {
            $table->unsignedInteger('id_asistencia')->primary()->autoIncrement();
            $table->unsignedInteger('id_reserva');
            $table->unsignedInteger('id_usuario_validador');
            $table->dateTime('fecha_hora_acceso')->useCurrent();
            $table->enum('resultado', ['valida'])->default('valida');
            $table->string('observaciones', 255)->nullable();

            $table->unique('id_reserva', 'uq_asistencias_reserva');
            $table->foreign('id_reserva')->references('id_reserva')->on('reservas')->cascadeOnUpdate();
            $table->foreign('id_usuario_validador')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
