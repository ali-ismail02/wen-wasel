<?php

namespace App\Http\Controllers\PassengerControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RouteController extends Controller
{

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
