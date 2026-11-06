<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AsistenciaController extends Controller
{
    public function index()
    {
        return Asistencia::query()->with(['reserva', 'validator'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_reserva' => ['required', 'integer', Rule::exists('reservas', 'id_reserva')],
            'id_usuario_validador' => ['required', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'fecha_hora_acceso' => ['nullable', 'date'],
            'resultado' => ['sometimes', Rule::in(['valida'])],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(Asistencia::create($validated), 201);
    }

    public function show(Asistencia $asistencia)
    {
        return $asistencia->load(['reserva', 'validator']);
    }

    public function update(Request $request, Asistencia $asistencia)
    {
        $validated = $request->validate([
            'id_reserva' => ['sometimes', 'integer', Rule::exists('reservas', 'id_reserva')],
            'id_usuario_validador' => ['sometimes', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'fecha_hora_acceso' => ['nullable', 'date'],
            'resultado' => ['sometimes', Rule::in(['valida'])],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        $asistencia->fill($validated);
        $asistencia->save();

        return $asistencia;
    }

    public function destroy(Asistencia $asistencia)
    {
        $asistencia->delete();

        return response()->noContent();
    }
}
