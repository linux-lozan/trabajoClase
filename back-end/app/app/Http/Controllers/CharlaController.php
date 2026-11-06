<?php

namespace App\Http\Controllers;

use App\Models\Charla;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CharlaController extends Controller
{
    public function index()
    {
        return Charla::query()->with(['organizer', 'sala'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_organizador' => ['required', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'id_sala' => ['required', 'integer', Rule::exists('salas', 'id_sala')],
            'titulo' => ['required', 'string', 'max:200'],
            'descripcion' => ['nullable', 'string'],
            'fecha' => ['required', 'date'],
            'hora_inicio' => ['required', 'date_format:H:i'],
            'hora_fin' => ['required', 'date_format:H:i'],
            'aforo_maximo' => ['required', 'integer', 'min:1'],
            'estado' => ['sometimes', Rule::in(['borrador', 'publicada', 'cancelada', 'finalizada'])],
        ]);

        return response()->json(Charla::create($validated), 201);
    }

    public function show(Charla $charla)
    {
        return $charla->load(['organizer', 'sala']);
    }

    public function update(Request $request, Charla $charla)
    {
        $validated = $request->validate([
            'id_organizador' => ['sometimes', 'integer', Rule::exists('usuarios', 'id_usuario')],
            'id_sala' => ['sometimes', 'integer', Rule::exists('salas', 'id_sala')],
            'titulo' => ['sometimes', 'string', 'max:200'],
            'descripcion' => ['nullable', 'string'],
            'fecha' => ['sometimes', 'date'],
            'hora_inicio' => ['sometimes', 'date_format:H:i'],
            'hora_fin' => ['sometimes', 'date_format:H:i'],
            'aforo_maximo' => ['sometimes', 'integer', 'min:1'],
            'estado' => ['sometimes', Rule::in(['borrador', 'publicada', 'cancelada', 'finalizada'])],
        ]);

        $charla->fill($validated);
        $charla->save();

        return $charla;
    }

    public function destroy(Charla $charla)
    {
        $charla->delete();

        return response()->noContent();
    }
}
