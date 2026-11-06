<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        return User::query()->with('role')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_rol' => ['required', 'integer', Rule::exists('roles', 'id_rol')],
            'nombre' => ['required', 'string', 'max:100'],
            'apellidos' => ['required', 'string', 'max:150'],
            'email' => ['required', 'email', 'max:150', 'unique:usuarios,email'],
            'password_hash' => ['required', 'string', 'min:8'],
            'fecha_registro' => ['nullable', 'date'],
            'activo' => ['sometimes', 'boolean'],
        ]);

        return response()->json(User::create($validated), 201);
    }

    public function show(User $user)
    {
        return $user->load('role');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'id_rol' => ['sometimes', 'integer', Rule::exists('roles', 'id_rol')],
            'nombre' => ['sometimes', 'string', 'max:100'],
            'apellidos' => ['sometimes', 'string', 'max:150'],
            'email' => ['sometimes', 'email', 'max:150', Rule::unique('usuarios', 'email')->ignore($user->id_usuario, 'id_usuario')],
            'password_hash' => ['sometimes', 'string', 'min:8'],
            'fecha_registro' => ['nullable', 'date'],
            'activo' => ['sometimes', 'boolean'],
        ]);

        $user->fill($validated);
        $user->save();

        return $user;
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->noContent();
    }
}
