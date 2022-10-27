<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Trip;
use App\Models\SubTrip;
use App\Models\TripType;
use App\Models\TripInfo;
use App\Models\Reservation;
use JWTAuth;
use Validator;

class PassengerController extends Controller
{
    public function passengerSignUp(Request $request){
        $validator = Validator::make($request->all(), [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:6',
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
}
