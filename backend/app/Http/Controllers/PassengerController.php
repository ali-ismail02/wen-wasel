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
        return app("App\Http\Controllers\PassengerControllers\ProfileController")->passengerSignUp($request);
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
        return app("App\Http\Controllers\PassengerControllers\RouteController")->getPossibleRoutes($request);
    }

    // Api to update profile
    public function updateProfile(Request $request){
        return app("App\Http\Controllers\PassengerControllers\ProfileController")->updateProfile($request);
    }

    // Api to get fares
    public function getFares(Request $request){
        return app("App\Http\Controllers\PassengerControllers\ProfileController")->getFares($request);
    }
}
