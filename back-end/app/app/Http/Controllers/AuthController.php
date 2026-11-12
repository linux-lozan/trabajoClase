<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt([
            ...$credentials,
            'activo' => true,
        ])) {
            throw ValidationException::withMessages([
                'email' => ['El correo o la contraseña no son válidos.'],
            ]);
        }

        $request->session()->regenerate();

        return $request->user()->load('role');
    }

    public function user(Request $request)
    {
        return $request->user()->load('role');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
