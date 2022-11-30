<?php

namespace App\Http\Controllers;

use PassengerControllers\TripAddOrUpdate;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Trip;
use App\Models\SubTrip;
use App\Models\TripType;
use App\Models\TripInfo;
use App\Models\TripRecord;
use App\Models\Reservation;
use App\Models\Route;
use App\Models\Fare;
use Auth;
use JWTAuth;
use Validator;

class PassengerController extends Controller
{
    // Api for passenger signup
    public function passengerSignUp(Request $request){
        // Validate the request
        $rules = [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8',
            'name' => 'required',
        ];
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        // Create new user
        $user = User::create([ // ====================================================================
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'name' => $request->name,
            'user_type' => 2,
            'image' => 'default.png',
        ]);
        if(!$user){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to create user"
            ]);
        }

        // Create a token for the user to avoid another request for login
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }
    
    // Api to add a trip
    public function addTrip(Request $request){
        return app("App\Http\Controllers\PassengerControllers\TripsController")->addTrip($request);
    }

    // Api to update trip info by id
    public function updateTrip(Request $request){
        return app("App\Http\Controllers\PassengerControllers\TripsController")->updateTrip($request);
    }

    // Api to get trip by id
    public function getTripById(Request $request){
        return app("App\Http\Controllers\PassengerControllers\TripsController")->getTripById($request);
    }

    // Api to get all trips
    public function getTrips(Request $request){
        return app("App\Http\Controllers\PassengerControllers\TripsController")->getTrips($request);
    }
    
    // Api to get the cuurent trip if any
    public function getCurrentTrip(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        // Get the latest trip
        $trips = $user->trips()->orderBy('id',"DESC")->get();
        
        $trips_data = [];
        // Save the last trip in the trips array
        $trip = $trips[0];

        // Get the sub trips
        $sub_trips = $trip->subTrips()->get();
        $trip_infos = [];
        // Get the trip info for each sub trip
        foreach($sub_trips as $sub_trip){
            $trip_info = $sub_trip->tripInfo()->first();
            $trip_infos[] = [
                "trip_info_id" => $trip_info->id,
                "start_location" => $trip_info->start_location,
                "end_location" => $trip_info->end_location,
                "departure_time" => $trip_info->departure_time,
                "arrival_time" => $trip_info->arrival_time,
                "directions" => $sub_trip->directions,
                "trip_type" => $sub_trip->trip_type
            ];
        }
        $trips_data[] = [
            "trip_id" => $trip->id,
            "trip" => $trip_infos
        ];

        // Check if any sub trip has no arrival time
        $current_trip = null;
        foreach($trips_data as $trip){
            foreach($trip['trip'] as $trip_info){
                if($trip_info['arrival_time'] == null){
                    $current_trip = $trip;
                    break;
                }
            }
        }

        // If no current trip found
        if($current_trip == null){
            return response()->json([
                "status" => "Failed",
                "message" => "No current trip"
            ]);
        }

        return response()->json([
            "status" => "success",
            "message" => "Trips found",
            "current_trip" => $current_trip
        ]);
    }

    // Api to add reservation
    public function addReservation(Request $request){
        return app("App\Http\Controllers\PassengerControllers\ReservationController")->addReservation($request);
    }
    
    // Api to get the reservations
    public function getReservations(Request $request){
        return app("App\Http\Controllers\PassengerControllers\ReservationController")->getReservations($request);
    }

    // Api to update reservation status to 1 (arrived)
    public function updateReservation(Request $request){
        return app("App\Http\Controllers\PassengerControllers\ReservationController")->updateReservation($request);
    }

    // Api to get all possible routes for a passenger to take
    public function getPossibleRoutes(Request $request){
        if(!$request->start_location || !$request->end_location){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "error" => "Missing Fields"
            ]);
        }

        // Get all routes where the Van didn't arrive yet
        $van_routes = Route::where('arrival_time','>=',date('Y-m-d H:i:s'))->orWhere('route_type',2)->get();
        $valid_van_routes = [];
        foreach($van_routes as $van_route){
            if($van_route->route_type == 2){
                // for type 2 routes(presaved routes), the api needs to add the routes time difference to the main presaved route time 
                $start_time = strtotime($van_route->presaved_route()->first()->start_time.' +'.$van_route->time_difference.' minutes');
                $start_time = date('Y-m-d H:i:s',$start_time);
                $van_route->arrival_time = $start_time;
                // Check if the time is less than the current time and if the route is still valid
                if($start_time > date('Y-m-d H:i:s') && checkPoint($van_route->location,$request->start_location,$request->end_location)){
                    $valid_van_routes[] = $van_route;
                }
            }// Else type 1(one time route) we just check time and validity directly
            else if($van_route->arrival_time > date('Y-m-d H:i:s') && checkPoint($van_route->location,$request->start_location,$request->end_location)){
                $valid_van_routes[] = $van_route;
            }
        }

        $trips = [];

        // Get all trips that are still valid and loop over all combinations of the trips
        for($i = 0 ; $i < count($valid_van_routes) ; $i++){
            for($j = $i + 1 ; $j < count($valid_van_routes) ; $j++){
                // Check if the 2 routes are for the same driver
                if($valid_van_routes[$i]->driver()->first()->id == $valid_van_routes[$j]->driver()->first()->id){
                    // Check if the 2 routes are valid for the passenger's trip using checkTripInfo function
                    if(($valid_van_routes[$i]->arrival_time < $valid_van_routes[$j]->arrival_time && checkTripInfo($valid_van_routes[$i]->location,$valid_van_routes[$j]->location,$request->start_location,$request->end_location)) || ($valid_van_routes[$i]->arrival_time > $valid_van_routes[$j]->arrival_time && checkTripInfo($valid_van_routes[$j]->location,$valid_van_routes[$i]->location,$request->start_location,$request->end_location))){
                            $trips["van"][] = [$valid_van_routes[$i], $valid_van_routes[$j], $valid_van_routes[$i]->driver()->first()];
                    }
                }
            }
        }

        // Get all trip records for service drivers
        $service_trips = TripRecord::all();

        // Loop over all trips records and check if they are valid for the passenger's trip
        foreach($service_trips as $service_trip){
            // Check if the trip ended
            if(!$service_trip->tripInfo()->first()->end_location){
                continue;
            }
            if(checkTripInfo($service_trip->tripInfo()->first()->start_location,$service_trip->tripInfo()->first()->end_location,$request->start_location,$request->end_location)){
                $trips["service"][] = $service_trip->tripInfo()->first();
            }
        }

        return response()->json([
            "status" => "success",
            "message" => "Success",
            "trips" => $trips
        ]);

    }

    // Api to update profile
    public function updateProfile(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = Auth::user();

        if($request->name) $user->name = $request->name;

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
            // Convert the base64 image to a image file and save it
            $img = $request->image;
            $img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.jpeg';
            $file = public_path('images')."\\".$filee;
            $user->image = $filee;
            file_put_contents($file, $data);
        }

        $user->save();

        // Generate a new token for the user
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 1,
            'message' => 'User updated',
            'user' => $user,
            'token' => $token
        ]);
    }

    // Api to get fares

    public function getFares(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        // Get the fares for the distance
        if(!$fares = Fare::all()){
            return response()->json([
                "status" => "Failed",
                "message" => "No fares found"
            ]);
        }

        return response()->json([
            "status" => "success",
            "message" => "Success",
            "fares" => $fares
        ]);
    }
}
