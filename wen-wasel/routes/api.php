<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PassengerController;

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::group(['prefix' => 'user'], function () {
    Route::post('signup', [PassengerController::class, 'passengerSignUp']);
    Route::group(['middleware' => 'PassengerJWT'], function () {
        Route::post('add-trip', [PassengerController::class, 'addTrip']);
        Route::post('get-trip', [PassengerController::class, 'getTripById']);
        Route::put('update-trip', [PassengerController::class, 'updateTrip']);
        Route::get('get-trips', [PassengerController::class, 'getTrips']);
    });
});