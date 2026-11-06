<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('reservas')) {
            return;
        }

        Schema::create('reservas', function (Blueprint $table) {
            $table->unsignedInteger('id_reserva')->primary()->autoIncrement();
            $table->unsignedInteger('id_usuario');
            $table->unsignedInteger('id_charla');
            $table->dateTime('fecha_reserva')->useCurrent();
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada'])->default('pendiente');
            $table->string('observaciones', 255)->nullable();
            $table->tinyInteger('reserva_activa')->storedAs("CASE WHEN `estado` IN ('pendiente','confirmada') THEN 1 ELSE NULL END")->nullable();

            $table->unique(['id_usuario', 'id_charla', 'reserva_activa'], 'uq_reserva_activa');
            $table->index(['id_charla', 'estado'], 'idx_reservas_charla');
            $table->foreign('id_charla')->references('id_charla')->on('charlas')->cascadeOnUpdate();
            $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
