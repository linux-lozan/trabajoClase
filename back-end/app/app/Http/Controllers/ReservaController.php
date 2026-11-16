<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Charla;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReservaController extends Controller
{
    public function index()
    {
        return Reserva::query()->with(['user', 'charla'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_usuario' => ['required', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'id_charla' => ['required', 'integer', Rule::exists('charlas', 'id_charla')],
            'fecha_reserva' => ['nullable', 'date'],
            'estado' => ['sometimes', Rule::in(['pendiente', 'confirmada', 'cancelada'])],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        // Verificar si el usuario ya tiene una reserva activa para esta charla
        $existingReservation = Reserva::where('id_usuario', $validated['id_usuario'])
            ->where('id_charla', $validated['id_charla'])
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->first();

        if ($existingReservation) {
            return response()->json(
                ['message' => 'Ya tienes una reserva activa para esta charla.'],
                409
            );
        }

        // Verificar el aforo de la charla
        $charla = Charla::findOrFail($validated['id_charla']);
        $reservasActuales = Reserva::where('id_charla', $charla->id_charla)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->count();

        if ($reservasActuales >= $charla->aforo_maximo) {
            return response()->json(
                ['message' => 'No se pudo completar la reserva. El aforo de la charla está completo.'],
                409
            );
        }

        return response()->json(Reserva::create($validated), 201);
    }

    public function show(Reserva $reserva)
    {
        return $reserva->load(['user', 'charla']);
    }

    public function update(Request $request, Reserva $reserva)
    {
        $validated = $request->validate([
            'id_usuario' => ['sometimes', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'id_charla' => ['sometimes', 'integer', Rule::exists('charlas', 'id_charla')],
            'fecha_reserva' => ['nullable', 'date'],
            'estado' => ['sometimes', Rule::in(['pendiente', 'confirmada', 'cancelada'])],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        $reserva->fill($validated);
        $reserva->save();

        return $reserva;
    }

    public function destroy(Reserva $reserva)
    {
        $reserva->delete();

        return response()->noContent();
    }

    /**
     * Obtener las reservas del usuario actual
     */
    public function getUserReservations($userId)
    {
        return Reserva::where('id_usuario', $userId)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->with(['charla'])
            ->get();
    }

    /**
     * Contar reservas activas para una charla
     */
    public function getReservationCountForCharla($charlaId)
    {
        $count = Reserva::where('id_charla', $charlaId)
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->count();

        return response()->json(['count' => $count]);
    }
}
