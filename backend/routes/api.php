<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PassengerController;
use App\Http\Controllers\VanController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AdminController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::get('images/{name}', [ImagesController::class, 'getImageByName']);

Route::group(['prefix' => 'user'], function () {
    Route::post('signup', [PassengerController::class, 'passengerSignUp']);
    Route::group(['middleware' => 'PassengerJWT'], function () {
        Route::post('add-trip', [PassengerController::class, 'addTrip']);
        Route::get('get-trip/{trip_id}', [PassengerController::class, 'getTripById']);
        Route::put('update-trip', [PassengerController::class, 'updateTrip']);
        Route::get('get-trips', [PassengerController::class, 'getTrips']);
        Route::get('get-current-trip', [PassengerController::class, 'getCurrentTrip']);
        Route::post('add-reservation', [PassengerController::class, 'addReservation']);
        Route::get('get-reservations', [PassengerController::class, 'getReservations']);
        Route::put('update-reservation', [PassengerController::class, 'updateReservation']);
    });
});

Route::group(['prefix' => 'van'], function() {
    Route::post('signup', [VanController::class, 'vanSignUp']);
    Route::group(['middleware' => 'VanJWT'], function() {
        Route::POST('add-one-route', [VanController::class, 'addOneTimeRoute']);
        Route::get('get-one-routes', [VanController::class, 'getOneTimeRoutes']);
        Route::get('get-route/{route_id}',[VanController::class, 'getOneTimeRouteById']);
        Route::post('add-recurring-route', [VanController::class, 'addRecurringRoute']);
        Route::get('get-recurring-routes', [VanController::class, 'getRecurringRoutes']);
        Route::get('get-recurring-route/{presaved_route_id}', [VanController::class, 'getRecurringRouteById']);
        Route::put('arrive-at-route', [VanController::class, 'arriveAtRoute']);
        Route::put('departure-from-route', [VanController::class, 'departureFromRoute']);
    });
});

Route::group(['prefix' => 'service'], function() {
    Route::post('signup', [ServiceController::class, 'serviceSignUp']);
    Route::group(['middleware' => 'ServiceJWT'], function() {
        Route::post('add-trip-record', [ServiceController::class, 'addTripRecord']);
        Route::put('end-trip', [ServiceController::class, 'endTrip']);
        Route::get('get-trips', [ServiceController::class, 'getTrips']);
    });
});

Route::group(['prefix' => 'admin'], function() {
    Route::group(['middleware' => 'AdminJWT'], function() {
        Route::get('get-passengers/{search?}', [AdminController::class, 'getPassengers']);
        Route::get('get-van-drivers/{search?}', [AdminController::class, 'getVanDrivers']);
        Route::get('get-service-drivers/{search?}', [AdminController::class, 'getServiceDrivers']);
        Route::get('get-user/{id}', [AdminController::class, 'getUserById']);
        Route::put('accept-reject-driver', [AdminController::class, 'acceptOrRejectDriver']);
        Route::put('update-passenger', [AdminController::class, 'updatePassenger']);
        Route::put('update-driver', [AdminController::class, 'updateDriver']);
        Route::get('get-presaved-routes', [AdminController::class, 'getPresavedRoutes']);
    });
});