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
        return app("App\Http\Controllers\PassengerControllers\TripsController")->getCurrentTrip($request);
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
