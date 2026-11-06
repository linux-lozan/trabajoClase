<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('notificaciones_email')) {
            return;
        }

        Schema::create('notificaciones_email', function (Blueprint $table) {
            $table->unsignedInteger('id_email')->primary()->autoIncrement();
            $table->unsignedInteger('id_reserva');
            $table->string('destinatario', 150);
            $table->enum('tipo', ['confirmacion', 'cancelacion', 'recordatorio']);
            $table->dateTime('fecha_envio')->nullable();
            $table->enum('estado_envio', ['pendiente', 'enviado', 'error'])->default('pendiente');
            $table->text('error')->nullable();

            $table->index('id_reserva', 'idx_notif_reserva');
            $table->foreign('id_reserva')->references('id_reserva')->on('reservas')->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notificaciones_email');
    }
};
