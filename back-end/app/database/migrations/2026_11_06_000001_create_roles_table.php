<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('roles')) {
            return;
        }

        Schema::create('roles', function (Blueprint $table) {
            $table->unsignedInteger('id_rol')->primary()->autoIncrement();
            $table->string('nombre', 50)->unique();
            $table->string('descripcion', 255)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
