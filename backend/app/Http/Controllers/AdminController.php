<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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
