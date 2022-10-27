<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use JWTAuth;
use JWTFactory;

class PassengerJWT
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        JWTAuth::parseToken()->authenticate();
        $request['user_data'] = auth()->user();
        if($request['user_data']->user_type != 2){
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}
