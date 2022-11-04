<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use App\Models\Route;
use App\Models\PresavedRoute;
use App\Models\Fare;
use App\Models\TripRecord;
use DB;
use Validator;

class AdminController extends Controller
{
    // Spi to get all passengers
    public function getPassengers(Request $request){
        $search = $request->search;
        $users = User::where('user_type', 1)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();

        return response()->json([
            'status' => "Success",
            'message' => 'Passengers fetched successfully',
            'users' => $users
        ]);
    }

    // Api to get all van drivers
    public function getVanDrivers(Request $request){
        $drivers = [];
        $search = $request->search;
        $users = User::where('user_type', 3)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();
                    
        // Get the drivers for all the users
        foreach($users as $user){
            $driver = $user->drivers()->first();
            $drivers[] = [$user, $driver];
        }

        return response()->json([
            'status' => "Success",
            'message' => 'Van drivers fetched successfully',
            'drivers' => $drivers
        ]);
    }

    // Api to get all service drivers
    public function getServiceDrivers(Request $request){
        $drivers = [];
        $search = $request->search;
        $users = User::where('user_type', 4)->where(function ($query) use ($search) {
                        $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                    })->get();

        // Get the drivers for all the users
        foreach($users as $user){
            $driver = $user->drivers()->first();
            $drivers[] = [$user, $driver];
        }

        return response()->json([
            'status' => "Success",
            'message' => 'Service drivers fetched successfully',
            'drivers' => $drivers
        ]);
    }

    // Api to get user by id with driver info if he is a driver
    public function getUserById(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => "Failed",
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }
        // Get the user
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => "Failed",
                'message' => 'User not found'
            ]);
        }
        // Get the driver info if he is a driver
        if($user->user_type == 3 || $user->user_type == 4){
            $driver = $user->drivers()->first();
            return response()->json([
                'status' => "Success",
                'user' => $user,
                'driver' => $driver
            ]);
        }
        return response()->json([
            'status' => "Success",
            'user' => $user
        ]);
    }

    // Api to accept or reject driver
    public function acceptOrRejectDriver(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => "Failed",
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }

        // Get the user
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => "Failed",
                'message' => 'User not found'
            ]);
        }
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                'status' => "Failed",
                'message' => 'Driver not found'
            ]);
        }

        // Update the driver approval status
        $driver->approval_status = $request->status;
        $driver->save();

        return response()->json([
            'status' => "Success",
            'message' => 'Driver status updated',
            'user'=>$user,
            'driver'=>$driver
        ]);
    }

    // Api to update passenger
    public function updatePassenger(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => "Failed",
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }

        // Get the user
        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => "Failed",
                'message' => 'User not found'
            ]);
        }
        // Check if user is a passenger
        if($user->user_type != 2){
            return response()->json([
                'status' => "Failed",
                'message' => 'User is not a passenger'
            ]);
        }

        if($request->name) $user->name = $request->name;

        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email:rfc,dns|unique:users' // check if email is unique and valid
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => "Failed",
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
                        'status' => "Failed",
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
                    'status' => "Failed",
                    'message' => $validator->errors()->first()
                ]);
            }
            $user->password = bcrypt($request->password);
        }

        $user->save();

        return response()->json([
            'status' => "Success",
            'message' => 'Passenger updated',
            'user' => $user
        ]);
    }

    // Api to update van or service driver
    public function updateDriver(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => "Failed",
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }

        $user = User::find($request->id);
        if(!$user){
            return response()->json([
                'status' => "Failed",
                'message' => 'User not found'
            ]);
        }
        // check if user is a driver
        if($user->user_type != 3 && $user->user_type != 4){
            return response()->json([
                'status' => "Failed",
                'message' => 'User is not a driver'
            ]);
        }
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                'status' => "Failed",
                'message' => 'Driver not found'
            ]);
        }

        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email:rfc,dns|unique:users' // check if email is unique and valid
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => "Failed",
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
                        'status' => "Failed",
                        'message' => $validator->errors()->first()
                    ]);
                }
                $user->phone = $request->phone;
            }
        }

        if($request->password){
            // check if password is strong
            $validator = Validator::make($request->all(), [
                'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/' // at least 1 uppercase, 1 lowercase, 1 number
            ]);
            if($validator->fails()){
                return response()->json([
                    'status' => "Failed",
                    'message' => $validator->errors()->first()
                ]);
            }
            $user->password == bcrypt($request->password);
        }

        if($request->image){
            $img = $request->image;
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
            $file = public_path('images')."\\".$filee;
            $user->image = $filee;
            file_put_contents($file, $data);
        }

        if($request->name) $user->name = $request->name;

        if($request->make) $driver->make = $request->make;

        if($request->model) $driver->model = $request->model;

        if($request->year) $driver->year = $request->year;

        if($request->license_plate) $driver->license_plate = $request->license_plate;

        if($request->seats) $driver->seats = $request->seats;

        $user->save();
        $driver->save();

        return response()->json([
            'status' => "Success",
            'message' => 'Driver updated',
            'user' => $user,
            'driver' => $driver
        ]);
    }

    // Api to get all presaved routes
    public function getPresavedRoutes(){
        // Get all presaved routes
        $presaved = PresavedRoute::all();
        if($presaved == []){
            return response()->json([
                'status' => "Failed",
                'message' => 'No presaved routes found'
            ]);
        }
        $presaved_routes = [];
        foreach($presaved as $route){
            $routes = $route->routes()->get();
            $presaved_routes[] = [$route, $routes];
        }
        return response()->json([
            'status' => "Success",
            'message' => 'Presaved routes',
            'routes' => $presaved_routes
        ]);
    }

    // Api to get all one time routes
    public function getOneTimeRoutes(){
        // Get all one time routes
        $one_time = Route::where('route_type', 1)->get();
        if($one_time == []){
            return response()->json([
                'status' => "Failed",
                'message' => 'No one time routes found'
            ]);
        }
        return response()->json([
            'status' => "Success",
            'message' => 'One time routes',
            'routes' => $one_time
        ]);
    }

    // Api to get all fares
    public function getFares(){
        // Get all fares
        $fares = Fare::all();
        if($fares == []){
            return response()->json([
                'status' => "Failed",
                'message' => 'No fares found'
            ]);
        }
        return response()->json([
            'status' => "Success",
            'message' => 'Fares',
            'fares' => $fares
        ]);
    }

    // Api to update fare
    public function updateFare(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'fare' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => "Failed",
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ]);
        }

        $fare = Fare::find($request->id);
        if(!$fare){
            return response()->json([
                'status' => "Failed",
                'message' => 'Fare not found'
            ]);
        }

        $fare->fare = $request->fare;
        $fare->save();

        return response()->json([
            'status' => "Success",
            'message' => 'Fare updated',
            'fare' => $fare
        ]);
    }

    // Api to get popular routes

    public function getAnalytics(Request $request){
        $routes = Route::all();
        $countOfRoutes = [];
        foreach($routes as $route){
            $flag = 0;
            // foreach $countOfRoutes as key and value
            foreach($countOfRoutes as $key => $value){
                $route_corods = explode(',', $route->location);
                $key_corods = explode(',', $key);
                if(distance($route_corods[0], $route_corods[1], $key_corods[0], $key_corods[1], "k") < 0.1){
                    $countOfRoutes[$key] += 1;
                    $flag = 1;
                    break;
                }
            }
            if($flag){
                continue;
            }
            $countOfRoutes[$route->location] = 1;
        }

        $routes = Route::select(DB::raw('count(id) as total'), "driver_id")->where('route_type',1)->groupBy('driver_id')->get();

        $van_drivers = [];
        foreach($routes as $route){
            $driver = Driver::find($route->driver_id);
            $van_drivers[] = [$driver, $route->total];
        }

        $trip_records = TripRecord::select(DB::raw('count(id) as total'), "driver_id")->groupBy('driver_id')->get();

        $service_drivers = [];
        foreach($trip_records as $trip_record){
            $driver = Driver::find($trip_record->driver_id);
            $service_drivers[] = [$driver, $trip_record->total];
        }
        // sort van drivers by total
        usort($van_drivers, function($a, $b) {
            return $b[1] <=> $a[1];
        });
        // take top 5 van drivers
        $van_drivers = array_slice($van_drivers, 0, 5);
        // sort service drivers by total
        usort($service_drivers, function($a, $b) {
            return $b[1] <=> $a[1];
        });
        // take top 5 service drivers
        $service_drivers = array_slice($service_drivers, 0, 5);
        // Sort countOfRoutes by value
        arsort($countOfRoutes);
        $most_popular = array_slice($countOfRoutes, 0, 5, true);
        $least_popular = array_slice($countOfRoutes, -5, 5, true);
        $least_popular = array_reverse($least_popular, true);


        return response()->json([
            'status' => "Success",
            'message' => 'Most and least popular routes',
            'most_popular_routes' => $most_popular,
            'least_popular_routes' => $least_popular,
            'most_active_van_drivers' => $van_drivers,
            'most_active_service_drivers' => $service_drivers   
        ]);
    }
}
