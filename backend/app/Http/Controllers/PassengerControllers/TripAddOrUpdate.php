<?php

namespace App\Http\Controllers\PassengerControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TripAddOrUpdate extends Controller
{
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
}
