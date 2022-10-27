<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use JWTFactory;
use Illuminate\Http\Request;

class ServiceJWT
{
    public function handle(Request $request, Closure $next)
    {
        JWTAuth::parseToken()->authenticate();
        $request['user_data'] = auth()->user();
        if($request['user_data']->user_type != 4){
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}
