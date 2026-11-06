<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::query()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => ['required', 'string', 'max:50', 'unique:roles,nombre'],
            'descripcion' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json(Role::create($validated), 201);
    }

    public function show(Role $role)
    {
        return $role;
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'nombre' => ['sometimes', 'string', 'max:50', 'unique:roles,nombre,' . $role->getKey() . ',id_rol'],
            'descripcion' => ['nullable', 'string', 'max:255'],
        ]);

        $role->fill($validated);
        $role->save();

        return $role;
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return response()->noContent();
    }
}
