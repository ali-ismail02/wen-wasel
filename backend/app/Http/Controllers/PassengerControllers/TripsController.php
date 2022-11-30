<?php

namespace App\Http\Controllers\PassengerControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TripsController extends Controller
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
}
