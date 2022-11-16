<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Driver;
use App\Models\User;
use App\Models\Van;
use App\Models\Route;
use App\Models\PresavedRoute;
use App\Models\Reservation;

use Validator;
use JWTAuth;

class VanController extends Controller
{

    public function validateUser(Request $request){
        // Validate the request
        $rules = [
            'email' => 'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8|unique:users',
        ];
        
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        return response()->json([
            "status" => "Success",
            "message" => "Validation Success"
        ]);

    }

    // Api to signup van driver
    public function vanSignUp(Request $request){
        // Validate the request
        $rules = [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8|unique:users',
            'name' => 'required',
            'phone' => 'required',
            'license_plate' => 'required',
            'license' => 'required',
            'front_image' => 'required',
            'side_image' => 'required',
            'make' => 'required',
            'model' => 'required',
            'year' => 'required',
        ];

        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        // Converting the base64 images to images and saving them
        $images = [$request->license, $request->front_image, $request->side_image];
        $image_names = [];

        foreach($images as $img){
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
            $file = public_path('images')."\\".$filee;
            $image_names[] = $filee;
            file_put_contents($file, $data);
        }

        // Creating the user
        $user = User::create([ // ====================================================================
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'name' => $request->name,
            'user_type' => 3,
            'image' => 'default.png',
        ]);
        if(!$user){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to create user"
            ]);
        }

        $driver = Driver::create([
            'user_id' => $user->id,
            'license_plate' => $request->license_plate,
            'license' => $image_names[0],
            'front_image' => $image_names[1],
            'side_image' => $image_names[2],
            'make' => $request->make,
            'model' => $request->model,
            'year' => $request->year,
            'seats' => 0
        ]);
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to create driver"
            ]);
        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
            'driver' => $driver
        ], 200);
    }

    // Add a one time route

    public function addOneTimeRoute(Request $request){
        // Validate the request
        $rules = [
            'location' => 'required',
            'date_time' => 'required',
            'user_data' => 'required',
        ];

        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        $route = Route::create([
            'location' => $request->location,
            'date_time' => $request->date_time,
            'driver_id' => $driver->id,
            'time_difference' => null,
            'arrival_status' => 0,
            'route_type' => 1,
        ]);
        if(!$route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Failed to create route",
            ]);
        }

        return response()->json([
            "status" => "Success",
            "message" =>"Route added successfully",
            "route" => $route
        ]);
    }

    // Get one time routes
    public function getOneTimeRoutes(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get all routes for the driver of type one time
        $routes = $driver->routes()->where('route_type', 1)->get();

        $routes_with_reservations = [];

        foreach($routes as $route){
            $reservations = $route->reservations()->count();
            $routes_with_reservations[] = [
                "route" => $route,
                "reservations" => $reservations
            ];
        }

        return response()->json([
            "status" => "Success",
            "message" =>"Routes fetched successfully",
            "routes" => $routes_with_reservations
        ]);
    }

    // Get one time route by id
    public function getRouteById(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get route for the driver of type one time by id
        $route = $driver->routes()->where('id', $request->route_id)->first();
        $reservations = $route->reservations()->count();

        return response()->json([
            "status" => "Success",
            "message" =>"Route fetched successfully",
            "route" => $route,
            "reservations" => $reservations
        ]);
    }

    public function updateOneTimeRoute(Request $request){
        // Validate the request
        $rules = [
            'date_time' => 'required',
            'user_data' => 'required',
            'route_id' => 'required'
        ];

        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        $route = $driver->routes()->where('route_type', 1)->where('id', $request->route_id)->first();
        if(!$route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Route not found",
            ]);
        }

        $route->arrival_time = $request->date_time;
        $route->save();

        return response()->json([
            "status" => "Success",
            "message" =>"Route updated successfully",
            "route" => $route
        ]);
    }

    // Add a recurring route
    public function addRecurringRoute(Request $request){
        // Validate the request
        $rules = [
            'name' => 'required',
            'user_data' => 'required',
            'routes' => 'required',
        ];

        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Routes should be sent as a string seperated by '@'
        $routes = explode('@', $request->routes);

        $presaved_route = PresavedRoute::create([
            'name' => $request->name,
            'driver_id' => $driver->id,
            "start_time" => date('Y-m-d H:i:s')
        ]);
        if(!$presaved_route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Failed to create presaved route",
            ]);
        }

        // Save all routes
        $routes_id = [];
        foreach($routes as $route){
            $route = explode(',', $route);
            $r = Route::create([
                'location' => $route[0].','.$route[1],
                'date_time' => $route[1],
                'driver_id' => $driver->id,
                'time_difference' => $route[2],
                'arrival_status' => 0,
                'route_type' => 2,
            ]);
            if(!$r){
                return response()->json([
                    "status" => "Failed",
                    "message" =>"Failed to create route",
                ]);
            }
            $routes_id[] = $r;
        }

        return response()->json([
            "status" => "Success",
            "message" =>"Presaved route added successfully",
            "route" => $presaved_route,
            "routes" => $routes_id
        ]);
    }

    // Api to get all recurring routes
    public function getRecurringRoutes(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get all presaved routes
        $presaved_routes = $driver->presavedRoutes()->get();

        $routes = []; // Array to hold all presaved routes with their routes
        $routes_with_count= []; // Array to hold routes with their reservations count

        // Get all routes for each presaved route
        foreach($presaved_routes as $presaved_route){
            $routes_with_count= [];
            $presaved_route_routes = $presaved_route->routes()->get();
            foreach($presaved_route_routes as $route){
                $routes_with_count[]= [
                    "route" => $route,
                    "reservations" => $route->reservations()->count()
                ];
            }
            $routes[] = [
                "presaved_route" => $presaved_route,
                "routes" => $routes_with_count
            ];
        }

        return response()->json([
            "status" => "Success",
            "message" =>"Routes fetched successfully",
            "presaved_routes" => $routes
        ]);
    }

    // Api to get one recurring route by id
    public function getRecurringRouteById(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get presaved route by id
        $presaved_route = $driver->presavedRoutes()->where('id', $request->presaved_route_id)->first();

        if(!$presaved_route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Presaved route not found",
            ]);
        }

        // Get all routes for the presaved route
        $routes = $presaved_route->routes()->get();

        $routes_with_count = [];

        foreach($routes as $route){
            $routes_with_count[] = [
                "route" => $route,
                "reservations" => $route->reservations()->count()
            ];
        }

        return response()->json([
            "status" => "Success",
            "message" =>"Route fetched successfully",
            "presaved_route" => $presaved_route,
            "routes" => $routes_with_count
        ]);
    }

    // Api to set route's arrival status to 1 (arrived)
    public function arriveAtRoute(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get the route
        $route = $driver->routes()->where('id', $request->route_id)->first();
        if(!$route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Route not found",
            ]);
        }

        // Update the route's arrival status to 1 (arrived)
        $route->arrival_status = 1;
        $route->save();

        return response()->json([
            "status" => "Success",
            "message" =>"Route arrived successfully",
            'route' => $route
        ]);
    }

    // Api to set route's arrival status to 2 (departed)
    public function departureFromRoute(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" =>"Driver not found",
            ]);
        }

        // Get the route
        $route = $driver->routes()->where('id', $request->route_id)->first();
        if(!$route){
            return response()->json([
                "status" => "Failed",
                "message" =>"Route not found",
            ]);
        }

        // Update the route arrival status to 2 (departed)
        $route->arrival_status = 2;
        $route->save();

        return response()->json([
            "status" => "Success",
            "message" =>"Route departed successfully",
            'route' => $route
        ]);
    }

    // api to update van driver's profile
    public function updateProfile(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                'status' => 0,
                'message' => 'Driver not found'
            ]);
        }

        if($request->email){
            if($request->email != $user->email){
                if($error = validate($request->all(), ["email" => "required|email:rfc,dns|unique:users"])){
                    return response()->json([
                        'status' => "Failed",
                        'message' => 'Validation error',
                        'errors' => $error
                    ]);
                }
                $user->email = $request->email;
            }
        }

        if($request->phone){
            // check if phone number is unique and 8 characters long
            if($request->phone != $user->phone){
                if($error = validate($request->all(), ["phone" => "required|numeric|digits:8|unique:users"])){
                    return response()->json([
                        'status' => "Failed",
                        'message' => 'Validation error',
                        'errors' => $error
                    ]);
                }
                $user->phone = $request->phone;
            }
        }

        if($request->password){
            // check if password is strong
            if($error = validate($request->all(), ["password" => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'])){
                return response()->json([
                    'status' => "Failed",
                    'message' => 'Validation error',
                    'errors' => $error
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
            'status' => 1,
            'message' => 'Driver updated',
            'user' => $user,
            'driver' => $driver
        ]);
    }
}
