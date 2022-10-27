<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use JWTAuth;
use JWTFactory;
use App\Models\User;

class AuthController extends Controller
{
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        JWTAuth::parseToken()->authenticate();
        $user_data = auth()->user();
        return response()->json([
            'access_token' => $token,
            'user_data' => $user_data,
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}