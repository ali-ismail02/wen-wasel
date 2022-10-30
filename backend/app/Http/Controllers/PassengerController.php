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
use JWTAuth;
use Validator;

class PassengerController extends Controller
{
    // Api for passenger signup
    public function passengerSignUp(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8',
            'name' => 'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => $validator->errors()
            ]);
        }

        // Create new user
        $user = new User();
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->user_type = 2;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->image = null;
        $user->save();

        // Create a token for the user
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    // Api to add a trip
    public function addTrip(Request $request){
        // Validate the request
        if(!$request->trip_infos || !$request->directions || !$request->transport_types){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }
        
        // Trip info, direction, transport type should be sent as a string seoeated by "@"
        $trip_infos = explode("@",$request->trip_infos);
        $directions = explode("@",$request->directions);
        $transport_types = explode("@",$request->transport_types);
        // Check if the number of trip infos, directions and transport types are equal
        if(count($trip_infos) != count ($directions) || count($trip_infos) != count ($transport_types)){
            return response()->json([
                "status" => "0",
                "message" => "Unmatched trip info"
            ]);
        }

        // Create a new trip
        $trip = new Trip();
        $trip->user_id = $request->user_data->id;
        $trip->save();

        // loop through the trip infos, directions and transport types
        for($i=0;$i<count($trip_infos);$i++){
            $trip_info_location = explode(",",$trip_infos[$i]);

            // Create a new trip info
            $trip_info = new TripInfo();
            $trip_info->start_location = $trip_info_location[0] . "," . $trip_info_location[1];
            $trip_info->end_location = $trip_info_location[2] . "," . $trip_info_location[3];
            $trip_info->departure_time = null;
            $trip_info->arrival_time = null;
            $trip_info->save();

            // Create a new sub trip and attach the trip info and trip to it
            $sub_trip = new SubTrip();
            $sub_trip->trip_info_id = $trip_info->id;
            $sub_trip->directions = $directions[$i];
            $sub_trip->trip_type = $transport_types[$i];
            $sub_trip->trip_id = $trip->id;
            $sub_trip->save();
        }

        return response()->json([
            "status" => "1",
            "message" => "Trip added successfully",
            "trip_id" => $trip->id
        ]);
    }

    // Api to get trip by id
    public function getTripById(Request $request){
        // Validate the request
        if(!$request->trip_id){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();

        // Get the trip
        $trip = $user->trips()->where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "0",
                "message" => "Trip not found"
            ]);
        }

        $sub_trips = $trip->subTrips()->get();
        $trip_infos = [];

        // Get the trip info for each sub trip
        foreach($sub_trips as $sub_trip){
            $trip_info = TripInfo::where('id',$sub_trip->trip_info_id)->first();
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
            "status" => "1",
            "message" => "Trip found",
            "trip" => $trip_infos
        ]);
    }

    // Api to update trip info by id
    public function updateTrip(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'trip_id'=>'required',
            'user_data'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();

        // Get the trip
        $trip = $user->trips()->where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "0",
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
                    "status" => "1",
                    "message" => "Trip updated successfully"
                ]);

                break;
            }
        }

        return response()->json([
            "status" => "0",
            "message" => "Trip already completed"
        ]);
    }

    // Api to get all trips
    public function getTrips(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
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
            "status" => "1",
            "message" => "Trips found",
            "trips" => $trips_data
        ]);
    }
    
    // Api to get the cuurent trip if any
    public function getCurrentTrip(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
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
                "status" => "0",
                "message" => "No current trip"
            ]);
        }

        return response()->json([
            "status" => "1",
            "message" => "Trips found",
            "current_trip" => $current_trip
        ]);
    }

    // Api to add reservation
    public function addReservation(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data'=>'required',
            'route_id'=>'required'
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }

        if(!$route = Route::where('id',$request->route_id)->first()){
            return response()->json([
                "status" => "0",
                "message" => "Route not found"
            ]);
        }

        // Get the driver of the route
        $driver = $route->driver()->first();
        if(!$driver){
            return response()->json([
                "status" => "0",
                "message" => "Driver not found"
            ]);
        }
        // Make sure there are seats available
        if($driver->seats == 0){
            return response()->json([
                "status" => "0",
                "message" => "No seats available"
            ]);
        }

        // Add the reservation
        $reservation = new Reservation;
        $reservation->user_id = $request->user_data->id;
        $reservation->route_id = $request->route_id;
        $reservation->status = 0;
        $reservation->save();

        // Update the driver seats
        $driver->seats = $driver->seats - 1;
        $driver->save();

        return response()->json([
            "status" => "1",
            "message" => "Reservation added successfully"
        ]);
    }
    
    // Api to get the reservations
    public function getReservations(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data'=>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
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
            "status" => "1",
            "message" => "Reservations found",
            "reservations" => $reservations_data
        ]);
    }

    // Api to update reservation status to 1 (arrived)
    public function updateReservation(Requrest $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data'=>'required',
            'reservation_id'=>'required'
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => 'Validation Failed',
                "errors" => $validator->errors()
            ]);
        }
        
        $user = JWTAuth::parseToken()->authenticate();

        if(!$reservation = $user->reservations()->where('id',$request->reservation_id)->first()){
            return response()->json([
                "status" => "0",
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
            "status" => "1",
            "message" => "Reservation updated successfully"
        ]);
    }

    // Function to find the distance between two points
    public function distance($lat1, $lon1, $lat2, $lon2, $unit) {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }
        else {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);
            if ($unit == "K") {
                return ($miles * 1.609344);
            } else if ($unit == "N") {
                return ($miles * 0.8684);
            } else {
                return $miles;
            }
        }
    }
    
    // Function to check if trip info is within 2 location points
    public function checkTripInfo($trip_start_location, $trip_end_location, $start_location, $end_location){
        $start_location = explode(",",$start_location);
        $end_location = explode(",",$end_location);
        $trip_info_start_location = explode(",",$trip_start_location);
        $trip_info_end_location = explode(",",$trip_end_location);

        $start_lat = $start_location[0];
        $start_lng = $start_location[1];
        $end_lat = $end_location[0];
        $end_lng = $end_location[1];
        $trip_info_start_lat = $trip_info_start_location[0];
        $trip_info_start_lng = $trip_info_start_location[1];
        $trip_info_end_lat = $trip_info_end_location[0];
        $trip_info_end_lng = $trip_info_end_location[1];

        // get center of 2 location points
        $center_lat = ($start_lat + $end_lat) / 2;
        $center_lng = ($start_lng + $end_lng) / 2;

        $distance = $this->distance($center_lat, $center_lng, $trip_info_start_lat, $trip_info_start_lng, "K");
        // Check if the trip info is within 2 the location points with 1 km radius added
        if($distance < $this->distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = $this->distance($center_lat, $center_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
            if($distance < $this->distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                $distance = $this->distance($end_lat, $end_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
                // Check if the trip info end location is closer to the end location than the trip info start location
                if($distance < $this->distance($end_lat, $end_lng, $trip_info_start_lat, $trip_info_start_lng, "K")){
                    return true;
                }
            }
        }
        return false;
    }

    // Function to check if point is within 2 location points
    public function checkPoint($point, $start_location, $end_location){
        $start_location = explode(",",$start_location);
        $end_location = explode(",",$end_location);
        $point = explode(",",$point);

        $start_lat = $start_location[0];
        $start_lng = $start_location[1];
        $end_lat = $end_location[0];
        $end_lng = $end_location[1];
        $point_lat = $point[0];
        $point_lng = $point[1];

        // Get center of 2 location points
        $center_lat = ($start_lat + $end_lat) / 2;
        $center_lng = ($start_lng + $end_lng) / 2;

        // check if the distance to the point is less than the radius of the 2 location points
        $distance = $this->distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
        if($distance < $this->distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = $this->distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
            if($distance < $this->distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                return true;
            }
        }

        return false;
    }

    // Api to get all possible routes for a passenger to take
    public function getPossibleRoutes(Request $request){
        if(!$request->start_location || !$request->end_location){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
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
                if($start_time > date('Y-m-d H:i:s') && $this->checkPoint($van_route->location,$request->start_location,$request->end_location)){
                    $valid_van_routes[] = $van_route;
                }
            }// Else type 1(one time route) we just check time and validity directly
            else if($van_route->arrival_time > date('Y-m-d H:i:s') && $this->checkPoint($van_route->location,$request->start_location,$request->end_location)){
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
                    if(($valid_van_routes[$i]->arrival_time < $valid_van_routes[$j]->arrival_time && $this->checkTripInfo($valid_van_routes[$i]->location,$valid_van_routes[$j]->location,$request->start_location,$request->end_location)) || ($valid_van_routes[$i]->arrival_time > $valid_van_routes[$j]->arrival_time && $this->checkTripInfo($valid_van_routes[$j]->location,$valid_van_routes[$i]->location,$request->start_location,$request->end_location))){
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
            if($this->checkTripInfo($service_trip->tripInfo()->first()->start_location,$service_trip->tripInfo()->first()->end_location,$request->start_location,$request->end_location)){
                $trips["service"][] = [$service_trip, $service_trip->tripInfo()->first()];
            }
        }

        return response()->json([
            "status" => "1",
            "message" => "Success",
            "trips" => $trips
        ]);

    }

    // Api to update profile
    public function updateProfile(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data' => 'required'
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => "Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        if($request->name) $user->name = $request->name;

        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email:rfc,dns|unique:users' // Check if the email is unique and valid
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
                'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/' // at least 8 characters, 1 uppercase, 1 lowercase, 1 number
            ]);
            if($validator->fails()){
                return response()->json([
                    'status' => 0,
                    'message' => $validator->errors()->first()
                ]);
            }
            $user->password = bcrypt($request->password);
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
