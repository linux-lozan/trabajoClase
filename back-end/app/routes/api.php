<?php

use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\CharlaController;
use App\Http\Controllers\NotificacionEmailController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::apiResource('roles', RoleController::class);
Route::apiResource('salas', SalaController::class);
Route::apiResource('usuarios', UserController::class);
Route::apiResource('charlas', CharlaController::class);
Route::apiResource('reservas', ReservaController::class);
Route::apiResource('asistencias', AsistenciaController::class);
Route::apiResource('notificaciones-email', NotificacionEmailController::class);
