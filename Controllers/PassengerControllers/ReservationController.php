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
    public function updateReservation(Request $request){
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
}
