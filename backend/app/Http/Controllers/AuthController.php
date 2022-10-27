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
        if($user_data->user_type == 3 || $user_data->user_type == 4){
            $driver = $user_data->driver()->first();
            return response()->json([
                'access_token' => $token,
                'user_data' => $user_data,
                'driver_data' => $driver,
                'expires_in' => auth()->factory()->getTTL() * 60
            ]);
        }
        return response()->json([
            'access_token' => $token,
            'user_data' => $user_data,
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}