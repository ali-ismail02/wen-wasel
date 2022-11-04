<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Trip;
use App\Models\SubTrip;
use App\Models\TripType;
use App\Models\TripInfo;
use App\Models\TripRecord;
use App\Models\Reservation;
use App\Models\Route;
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

        // Validate the request
        $rules = [
            'trip_infos' => 'required',
            'directions' => 'required',
            'transport_types' => 'required',
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
        
        // Trip info, direction, transport type should be sent as a string seperated by "@"
        $trip_infos = explode("@",$request->trip_infos); 
        $directions = explode("@",$request->directions);
        $transport_types = explode("@",$request->transport_types);
        // Check if the number of trip infos, directions and transport types are equal
        if(count($trip_infos) != count ($directions) || count($trip_infos) != count ($transport_types)){
            return response()->json([
                "status" => "Failed",
                "message" => "Unmatched trip info"
            ]);
        }

        // Create a new trip
        $trip = Trip::create([
            'user_id' => $user->id,
        ]);
        if(!$trip){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to create trip"
            ]);
        }

        // loop through the trip infos, directions and transport types
        for($i=0;$i<count($trip_infos);$i++){
            $trip_info_location = explode(",",$trip_infos[$i]);

            // Create a new trip info
            $trip_info = TripInfo::create([
                'start_location' =>  $trip_info_location[0] . "," . $trip_info_location[1],
                'end_location' => $trip_info_location[2] . "," . $trip_info_location[3],
                'departure_time' => null,
                'arrival_time' => null,
            ]);
            if(!$trip_info){
                return response()->json([
                    "status" => "Failed",
                    "message" => "Failed to create trip info"
                ]);
            }

            // Create a new sub trip and attach the trip info and trip to it
            $sub_trip = SubTrip::create([
                'directions' => $directions[$i],
                'trip_info_id' => $trip_info->id,
                'trip_id' => $trip->id,
                'trip_type' => $transport_types[$i],
            ]);
            if(!$sub_trip){
                return response()->json([
                    "status" => "Failed",
                    "message" => "Failed to create sub trip"
                ]);
            }
        }

        return response()->json([
            "status" => "success",
            "message" => "Trip added successfully",
            "trip_id" => $trip->id
        ]);
    }

    // Api to get trip by id
    public function getTripById(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }
        if(!$request->trip_id){
            return response()->json([
                "status" => "Failed",
                "message" => "Trip id is required"
            ]);
        }

        $user = $request->user_data;

        // Get the trip
        $trip = $user->trips()->where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "Failed",
                "message" => "Trip not found"
            ]);
        }

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

        return response()->json([
            "status" => "success",
            "message" => "Trip found",
            "trip" => $trip_infos
        ]);
    }

    // Api to update trip info by id
    public function updateTrip(Request $request){
        // Validate the request
        $rules = [
            'trip_id'=>'required',
            'user_data'=>'required',
        ];
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;

        // Get the trip
        $trip = $user->trips()->where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "Failed",
                "message" => "Trip not found"
            ]);
        }

        // Get the sub trips
        $sub_trips_all = $trip->subTrips()->get();
        $sub_trips = [];

        // Get the trip info for each sub trip
        foreach($sub_trips_all as $sub_trip){
            $trip_info = $sub_trip->tripInfo()->first();
            $sub_trips[] = [$sub_trip, $trip_info];
        }
        
        // Get the trip info for each sub trip and update the arrival time for the first sub trip with departure time but no arrival time
        foreach($sub_trips as $sub_trip){
            $trip_info =  $sub_trip[1];
            if($trip_info->departure_time && $trip_info->arrival_time == null){
                $trip_info->arrival_time = date("Y-m-d H:i:s");
                $trip_info->save();
                
                if($sub_trip == $sub_trips[count($sub_trips)-1]){
                    return response()->json([
                        "status" => "2",
                        "message" => "Trip Completed"
                    ]);
                }

                break;
            }
        }

        // Get the trip info for each sub trip and update the departure time for the first sub trip with no departure time
        foreach($sub_trips as $sub_trip){
            $trip_info =  $sub_trip[1];
            if($trip_info->departure_time == null){
                $trip_info->departure_time = date("Y-m-d H:i:s");
                $trip_info->save();

                return response()->json([
                    "status" => "success",
                    "message" => "Trip updated successfully"
                ]);

                break;
            }
        }

        return response()->json([
            "status" => "Failed",
            "message" => "Trip already completed"
        ]);
    }

    // Api to get all trips
    public function getTrips(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        $trips = $user->trips()->get();

        $trips_data = [];
        // loop through each trip and get the trip info for each sub trip
        foreach($trips as $trip){
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
        }

        return response()->json([
            "status" => "success",
            "message" => "Trips found",
            "trips" => $trips_data
        ]);
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
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        if(!$route = Route::where('id',$request->route_id)->first()){
            return response()->json([
                "status" => "Failed",
                "message" => "Route not found"
            ]);
        }

        // Get the driver of the route
        $driver = $route->driver()->first();
        if(!$driver){
            return response()->json([
                "status" => "Failed",
                "message" => "Driver not found"
            ]);
        }
        // Make sure there are seats available
        if($driver->seats == 0){
            return response()->json([
                "status" => "Failed",
                "message" => "No seats available"
            ]);
        }

        // Add the reservation
        $reservation = Reservation::create([
            "user_id" => $request->user_data->id,
            "route_id" => $request->route_id,
            "status" => 0
        ]);
        if(!$reservation){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to add reservation"
            ]);
        }

        // Update the driver seats
        $driver->seats = $driver->seats - 1;
        $driver->save();

        return response()->json([
            "status" => "success",
            "message" => "Reservation added successfully"
        ]);
    }
    
    // Api to get the reservations
    public function getReservations(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = $request->user_data;
        // Get the reservations
        $reservations = $user->reservations()->get();

        $reservations_data = [];
        foreach($reservations as $reservation){
            $route = $reservation->route()->first();
            $driver = $route->driver()->first();
            $reservations_data[] = [
                "reservation_id" => $reservation->id,
                "route" => $route,
                "driver" => $driver,
                "status" => $reservation->status
            ];
        }

        return response()->json([
            "status" => "success",
            "message" => "Reservations found",
            "reservations" => $reservations_data
        ]);
    }

    // Api to update reservation status to 1 (arrived)
    public function updateReservation(Requrest $request){
        // Validate the request
        $rules = [
            'user_data'=>'required',
            'reservation_id'=>'required'
        ];
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }
        
        $user = $request->user_data;

        if(!$reservation = $user->reservations()->where('id',$request->reservation_id)->first()){
            return response()->json([
                "status" => "Failed",
                "message" => "Reservation not found"
            ]);
        }

        // Update the reservation status
        $reservation->status = 1;
        $reservation->save();

        // Add seat to the driver
        $driver = $reservation->route()->first()->driver()->first();
        $driver->seats = $driver->seats + 1;
        $driver->save();

        return response()->json([
            "status" => "success",
            "message" => "Reservation updated successfully"
        ]);
    }

    // Api to get all possible routes for a passenger to take
    public function getPossibleRoutes(Request $request){
        $rules = [
            'start_location'=>'required',
            'end_location'=>'required'
        ];
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
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
                            $trips["van"][] = [$valid_van_routes[$i], $valid_van_routes[$j]];
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
                $trips["service"][] = [$service_trip, $service_trip->tripInfo()->first()];
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
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
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
}
