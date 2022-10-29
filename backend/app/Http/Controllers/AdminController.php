<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function getPassengers(Request $request)
    {
        $search = $request->search;
        $users = User::where('user_type', 1)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();
        return response()->json($passengers);
    }

    public function getVanDrivers(Request $request)
    {
        $drivers = [];
        $search = $request->search;
        $users = User::where('user_type', 3)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();
        foreach($users as $user){
            $driver = $user->drivers()->first();
            $drivers[] = [$user, $driver];
        }
        return response()->json([
            'status' => 1,
            'drivers' => $drivers
        ]);
    }
}
