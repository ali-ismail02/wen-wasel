<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    // api to get all passengers

    public function getPassengers(Request $request)
    {
        $search = $request->search;
        $users = User::where('user_type', 1)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();
        return response()->json($passengers);
    }

    // api to get all van drivers

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

    // api to get all service drivers

    public function getServiceDrivers(Request $request)
    {
        $drivers = [];
        $search = $request->search;
        $users = User::where('user_type', 4)->where(function ($query) use ($search) {
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

    // api to get user by id with driver info if he is a driver

    public function getUserById(Request $request)
    {
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => 0,
                'message' => 'User not found'
            ]);
        }
        if($user->user_type == 3 || $user->user_type == 4){
            $driver = $user->drivers()->first();
            return response()->json([
                'status' => 1,
                'user' => $user,
                'driver' => $driver
            ]);
        }
        return response()->json([
            'status' => 1,
            'user' => $user
        ]);
    }

    // api to accept or reject driver

    public function acceptOrRejectDriver(Request $request)
    {
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => 0,
                'message' => 'User not found'
            ]);
        }
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                'status' => 0,
                'message' => 'Driver not found'
            ]);
        }
        $driver->approval_status = $request->status;
        $driver->save();
        return response()->json([
            'status' => 1,
            'message' => 'Driver status updated'
        ]);
    }
}
