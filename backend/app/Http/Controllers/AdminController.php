<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getPassengers(Request $request)
    {
        $passengers = User::where('user_type', 2)->get();
        return response()->json([
            'status' => 'success',
            'passengers' => $passengers
        ]);
    }
}
