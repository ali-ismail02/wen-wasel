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
    public function passengerSignUp(Request $request){
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

        if(User::where('email',$request['email'])->first()){
            return response()->json([
                "status" => "0",
                "message" => "Email taken"
            ]);
        }

        $user = new User();
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->user_type = 2;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->image = null;
        $user->save();

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function addTrip(Request $request){

        if(!$request->trip_infos || !$request->directions || !$request->transport_types){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }
        
        $trip_infos = explode("@",$request->trip_infos);
        $directions = explode("@",$request->directions);
        $transport_types = explode("@",$request->transport_types);

        if(count($trip_infos) != count ($directions) || count($trip_infos) != count ($transport_types)){
            return response()->json([
                "status" => "0",
                "message" => "Unmatched trip info"
            ]);
        }

        $trip = new Trip();
        $trip->user_id = $request->user_data->id;
        $trip->save();

        for($i=0;$i<count($trip_infos);$i++){
            $trip_info_location = explode(",",$trip_infos[$i]);

            $trip_info = new TripInfo();
            $trip_info->start_location = $trip_info_location[0] . "," . $trip_info_location[1];
            $trip_info->end_location = $trip_info_location[2] . "," . $trip_info_location[3];
            $trip_info->departure_time = null;
            $trip_info->arrival_time = null;
            $trip_info->save();

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

    public function getTripById(Request $request){
        if(!$request->trip_id){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $trip = Trip::where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "0",
                "message" => "Trip not found"
            ]);
        }

        $sub_trips = SubTrip::where('trip_id',$trip->id)->get();
        $trip_infos = [];
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

    public function updateTrip(Request $request){
        if(!$request->trip_id){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $trip = Trip::where('id',$request->trip_id)->first();
        if(!$trip){
            return response()->json([
                "status" => "0",
                "message" => "Trip not found"
            ]);
        }

        $sub_trips = $trip->subTrips()->get();
        
        foreach($sub_trips as $sub_trip){
            $trip_info =  $sub_trip->tripInfo()->first();
            if($trip_info->departure_time && $trip_info->arrival_time == null){
                $trip_info->arrival_time = date("Y-m-d H:i:s");
                $trip_info->save();
                
                if($sub_trip == $sub_trips->last()){
                    return response()->json([
                        "status" => "2",
                        "message" => "Trip Completed"
                    ]);
                }

                break;
            }
        }

        foreach($sub_trips as $sub_trip){
            $trip_info =  $sub_trip->tripInfo()->first();
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

    public function getTrips(Request $request){
        if(!$request->user_data){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $trips = Trip::where('user_id',$request->user_data->id)->get();
        $trips_data = [];
        foreach($trips as $trip){
            $sub_trips = SubTrip::where('trip_id',$trip->id)->get();
            $trip_infos = [];
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
    
    public function getCurrentTrip(Request $request){
        if(!$request->user_data){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $trips = Trip::where('user_id',$request->user_data->id)->orderBy('id',"DESC")->get();
        $trips_data = [];
        $trip = $trips[0];
        $sub_trips = SubTrip::where('trip_id',$trip->id)->get();
        $trip_infos = [];
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
        $trips_data[] = [
            "trip_id" => $trip->id,
            "trip" => $trip_infos
        ];

        $current_trip = null;
        foreach($trips_data as $trip){
            foreach($trip['trip'] as $trip_info){
                if($trip_info['arrival_time'] == null){
                    $current_trip = $trip;
                    break;
                }
            }
        }

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

    public function addReservation(Request $request){
        if(!$request->user_data || !$request->route_id){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        if(!$route = Route::where('id',$request->route_id)->first()){
            return response()->json([
                "status" => "0",
                "message" => "Route not found"
            ]);
        }

        $driver = $route->driver()->first();

        if($driver->seats == 0){
            return response()->json([
                "status" => "0",
                "message" => "No seats available"
            ]);
        }

        $reservation = new Reservation;
        $reservation->user_id = $request->user_data->id;
        $reservation->route_id = $request->route_id;
        $reservation->status = 0;
        $reservation->save();

        $driver->seats = $driver->seats - 1;

        return response()->json([
            "status" => "1",
            "message" => "Reservation added successfully"
        ]);
    }
    
    public function getReservations(Request $request){
        if(!$request->user_data){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $reservations = Reservation::where('user_id',$request->user_data->id)->get();
        $reservations_data = [];
        foreach($reservations as $reservation){
            $route = Route::where('id',$reservation->route_id)->first();
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

    public function updateReservation(Requrest $request){
        if(!$request->reservation_id){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        if(!$reservation = Reservation::where('id',$request->reservation_id)->first()){
            return response()->json([
                "status" => "0",
                "message" => "Reservation not found"
            ]);
        }

        $reservation->status = 1;
        $reservation->save();

        $driver = $reservation->route()->first()->driver()->first();
        $driver->seats = $driver->seats + 1;
        $driver->save();

        return response()->json([
            "status" => "1",
            "message" => "Reservation updated successfully"
        ]);
    }

    // distance function

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
    
    // function to check if trip info is within 2 location points
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

        // check if distance between center and trip info start location is less than start location
        $distance = $this->distance($center_lat, $center_lng, $trip_info_start_lat, $trip_info_start_lng, "K");
        if($distance < $this->distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = $this->distance($center_lat, $center_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
            if($distance < $this->distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                $distance = $this->distance($end_lat, $end_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
                if($distance < $this->distance($end_lat, $end_lng, $trip_info_start_lat, $trip_info_start_lng, "K")){
                    return true;
                }
            }
        }
        return false;
    }

    // function to check if point is within 2 location points

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

        // get center of 2 location points
        $center_lat = ($start_lat + $end_lat) / 2;
        $center_lng = ($start_lng + $end_lng) / 2;

        // check if distance between center and trip info start location is less than start location
        $distance = $this->distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
        if($distance < $this->distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = $this->distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
            if($distance < $this->distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                return true;
            }
        }

        return false;
    }

    public function getPossibleRoutes(Request $request){
        if(!$request->start_location || !$request->end_location){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }

        $van_routes = Route::where('arrival_time','>=',date('Y-m-d H:i:s'))->orWhere('route_type',2)->get();
        $valid_van_routes = [];
        foreach($van_routes as $van_route){
            if($van_route->route_type == 2){
                $start_time = strtotime($van_route->presaved_route()->first()->start_time.' +'.$van_route->time_difference.' minutes');
                $start_time = date('Y-m-d H:i:s',$start_time);
                $van_route->arrival_time = $start_time;
                if($start_time > date('Y-m-d H:i:s') && $this->checkPoint($van_route->location,$request->start_location,$request->end_location)){
                    $valid_van_routes[] = $van_route;
                }
            }else if($this->checkPoint($van_route->location,$request->start_location,$request->end_location)){
                $valid_van_routes[] = $van_route;
            }
        }

        $trips = [];

        for($i = 0 ; $i < count($valid_van_routes) ; $i++){
            for($j = $i + 1 ; $j < count($valid_van_routes) ; $j++){
                if($valid_van_routes[$i]->driver()->first()->id == $valid_van_routes[$j]->driver()->first()->id){
                    if(($valid_van_routes[$i]->arrival_time < $valid_van_routes[$j]->arrival_time && $this->checkTripInfo($valid_van_routes[$i]->location,$valid_van_routes[$j]->location,$request->start_location,$request->end_location)) || ($valid_van_routes[$i]->arrival_time > $valid_van_routes[$j]->arrival_time && $this->checkTripInfo($valid_van_routes[$j]->location,$valid_van_routes[$i]->location,$request->start_location,$request->end_location))){
                            $trips["van"][] = [$valid_van_routes[$i], $valid_van_routes[$j]];
                    }
                }
            }
        }



        $service_trips = TripRecord::all();

        foreach($service_trips as $service_trip){
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
        $user = User::find($request->user_data->id);
        if(!$user){
            return response()->json([
                "status" => "0",
                "message" => "User Not Found"
            ]);
        }if($request->name){
            $user->name = $request->name;
        }
        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email:rfc,dns|unique:users'
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
        $user->save();

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 1,
            'message' => 'User updated',
            'user' => $user,
            'token' => $token
        ]);
    }
}
