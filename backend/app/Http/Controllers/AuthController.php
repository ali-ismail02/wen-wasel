<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Facades\JWTFactory;
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
        $user = User::where('email', request(['email']))->first();
        if($user->user_type == 3 || $user->user_type == 4){
            $driver = $user->drivers()->first();
            return response()->json([
                'access_token' => $token,
                'user' => $user,
                'driver' => $driver,
                'expires_in' => auth()->factory()->getTTL() * 60
            ]);
        }
        return response()->json([
            'access_token' => $token,
            'user' => $user,
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}