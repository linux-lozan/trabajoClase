<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function (): void {
    Route::get('/csrf-token', fn (Request $request) => response()->json([
        'data' => ['token' => $request->session()->token()],
    ]));
    Route::get('/charlas', [ApiController::class, 'talks']);
    Route::get('/ponentes', [ApiController::class, 'speakers']);
    Route::get('/salas', [ApiController::class, 'rooms']);
    Route::get('/user', [ApiController::class, 'currentUser']);
    Route::post('/login', [ApiController::class, 'login'])->middleware('throttle:10,1');
    Route::post('/register', [ApiController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/logout', [ApiController::class, 'logout']);

    Route::middleware('auth')->group(function (): void {
        Route::get('/reservas', [ApiController::class, 'reservations']);
        Route::post('/charlas/{talkId}/reservas', [ApiController::class, 'createReservation'])->whereNumber('talkId');
        Route::delete('/reservas/{reservationId}', [ApiController::class, 'cancelReservation'])->whereNumber('reservationId');
    });
});
