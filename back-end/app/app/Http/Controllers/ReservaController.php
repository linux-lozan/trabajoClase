<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
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
}
