<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Validator;

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

    // api to update passenger

    public function updatePassenger(Request $request)
    {
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => 0,
                'message' => 'User not found'
            ]);
        }
        // check if user is a passenger
        if($user->user_type != 2){
            return response()->json([
                'status' => 0,
                'message' => 'User is not a passenger'
            ]);
        }
        if($request->name){
            $user->name = $request->name;
        }
        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email|unique:users'
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => 0,
                        'message' => $validator->errors()->first()
                    ]);
                }
                $user->email = $request->email;
            }
        }
        if($request->phone){
            // check if phone number is unique and 8 characters long
            if($request->phone != $user->phone){
                $validator = Validator::make($request->all(), [
                    'phone' => 'required|numeric|digits:8|unique:users'
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => 0,
                        'message' => $validator->errors()->first()
                    ]);
                }
                $user->phone = $request->phone;
            }
        }
        if($request->password){
            // check if password is strong
            $validator = Validator::make($request->all(), [
                'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ]);
            if($validator->fails()){
                return response()->json([
                    'status' => 0,
                    'message' => $validator->errors()->first()
                ]);
            }
            $user->password = bcrypt($request->password);
        }
        $user->save();
        return response()->json([
            'status' => 1,
            'message' => 'Passenger updated',
            'user' => $user
        ]);
    }
}
