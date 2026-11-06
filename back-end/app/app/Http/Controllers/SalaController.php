<?php

namespace App\Http\Controllers;

use App\Models\Sala;
use Illuminate\Http\Request;

class SalaController extends Controller
{
    public function index()
    {
        return Sala::query()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'capacidad' => ['required', 'integer', 'min:1'],
        ]);

        return response()->json(Sala::create($validated), 201);
    }

    public function show(Sala $sala)
    {
        return $sala;
    }

    public function update(Request $request, Sala $sala)
    {
        $validated = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:100'],
            'ubicacion' => ['nullable', 'string', 'max:255'],
            'capacidad' => ['sometimes', 'integer', 'min:1'],
        ]);

        $sala->fill($validated);
        $sala->save();

        return $sala;
    }

    public function destroy(Sala $sala)
    {
        $sala->delete();

        return response()->noContent();
    }
}
