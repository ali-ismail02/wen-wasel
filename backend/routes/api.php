<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PassengerController;
use App\Http\Controllers\VanController;
use App\Http\Controllers\ImagesController;

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
    });
});