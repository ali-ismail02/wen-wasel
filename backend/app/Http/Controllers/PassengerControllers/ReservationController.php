<?php

namespace App\Http\Controllers\PassengerControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    //

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
            "message" => "Reservation added successfully",
            "reservation" => $reservation
        ]);
    }
}
