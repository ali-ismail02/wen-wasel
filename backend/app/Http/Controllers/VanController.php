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
    public function vanSignUp(Request $request){

        $validator = Validator::make($request->all(), [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|min:8|max:8',
            'name' => 'required',
            'phone' => 'required',
            'license_plate' => 'required',
            'license' => 'required',
            'front_image' => 'required',
            'side_image' => 'required',
            'seats' => 'required',
            'make' => 'required',
            'model' => 'required',
            'year' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $images = [$request->license, $request->front_image, $request->side_image];
        $image_names = [];

        foreach($images as $img){
            // convert base64 to image and save it
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
            $file = public_path('images')."\\".$filee;
            $image_names[] = $filee;
            file_put_contents($file, $data);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->phone = $request->phone;
        $user->user_type = 3;
        $user->image = null;
        $user->save();

        $driver = new Driver();
        $driver->license_plate = $request->license_plate;
        $driver->seats = $request->seats;
        $driver->model = $request->model;
        $driver->make = $request->make;
        $driver->year = $request->year;
        $driver->license = $image_names[0];
        $driver->front_image = $image_names[1];
        $driver->side_image = $image_names[2];
        $driver->user_id = $user->id;
        $driver->save();

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
            'driver' => $driver
        ], 200);
    }

    public function addOneTimeRoute(Request $request){
        $validator = Validator::make($request->all(), [
            'location' => 'required',
            'date_time' => 'required',
            'user_data' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $route = new Route();
        $route->location = $request->location;
        $route->arrival_time = $request->date_time;
        $route->time_difference = null;
        $route->arrival_status = 0;
        $route->route_type = 1;
        $route->driver_id =$driver->id;
        $route->save();

        return response()->json([
            "status" => "1",
            "message" =>"Route added successfully",
            "route" => $route
        ]);
    }

    public function getOneTimeRoutes(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

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
            "status" => "1",
            "message" =>"Routes fetched successfully",
            "routes" => $routes_with_reservations
        ]);
    }

    public function getOneTimeRouteById(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if(!$request->route_id){
            return response()->json([
                "status" => "0",
                "message" =>"Route id is required",
            ]);
        }

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $route = $driver->routes()->where('route_type', 1)->where('id', $request->route_id)->first();
        $reservations = $route->reservations()->count();

        return response()->json([
            "status" => "1",
            "message" =>"Route fetched successfully",
            "route" => $route,
            "reservations" => $reservations
        ]);
    }

    public function addRecurringRoute(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'user_data' => 'required',
            'routes' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $routes = explode('@', $request->routes);

        $presaved_route = new PresavedRoute();
        $presaved_route->name = $request->name;
        $presaved_route->driver_id = $driver->id;
        $presaved_route->start_time = date('Y-m-d H:i:s');
        $presaved_route->save();

        $routes_id = [];
        foreach($routes as $route){
            $route = explode(',', $route);
            $r = new Route();
            $r->location = $route[0].','.$route[1];
            $r->time_difference = $route[2];
            $r->arrival_status = 0;
            $r->route_type = 2;
            $r->driver_id =$driver->id;
            $r->presaved_route_id = $presaved_route->id;
            $r->save();
            $routes_id[] = $r;
        }

        return response()->json([
            "status" => "1",
            "message" =>"Presaved route added successfully",
            "route" => $presaved_route,
            "routes" => $routes_id
        ]);
    }

    public function getRecurringRoutes(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $presaved_routes = $driver->presavedRoutes()->get();

        $routes = [];
        $routes_with_count= [];

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
            "status" => "1",
            "message" =>"Routes fetched successfully",
            "presaved_routes" => $routes
        ]);
    }

    public function getRecurringRouteById(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if(!$request->presaved_route_id){
            return response()->json([
                "status" => "0",
                "message" =>"Presaved route id is required",
            ]);
        }

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $presaved_route = $driver->presavedRoutes()->where('id', $request->presaved_route_id)->first();

        if(!$presaved_route){
            return response()->json([
                "status" => "0",
                "message" =>"Presaved route not found",
            ]);
        }

        $routes = $presaved_route->routes()->get();

        foreach($routes as $route){
            $routes_with_count[] = [
                "route" => $route,
                "reservations" => $route->reservations()->count()
            ];
        }

        return response()->json([
            "status" => "1",
            "message" =>"Route fetched successfully",
            "presaved_route" => $presaved_route,
            "routes" => $routes_with_count
        ]);
    }

    public function arriveAtRoute(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if(!$request->route_id){
            return response()->json([
                "status" => "0",
                "message" =>"Route id is required",
            ]);
        }

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $route = $driver->routes()->where('id', $request->route_id)->first();
        if(!$route){
            return response()->json([
                "status" => "0",
                "message" =>"Route not found",
            ]);
        }

        $route->arrival_status = 1;
        $route->save();

        return response()->json([
            "status" => "1",
            "message" =>"Route arrived successfully",
            'route' => $route
        ]);
    }

    public function departureFromRoute(Request $request){
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if(!$request->route_id){
            return response()->json([
                "status" => "0",
                "message" =>"Route id is required",
            ]);
        }

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $driver = Driver::find($request->user_data->id);
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found",
            ]);
        }

        $route = $driver->routes()->where('id', $request->route_id)->first();
        if(!$route){
            return response()->json([
                "status" => "0",
                "message" =>"Route not found",
            ]);
        }

        $route->arrival_status = 2;
        $route->save();

        return response()->json([
            "status" => "1",
            "message" =>"Route departed successfully",
            'route' => $route
        ]);
    }
}