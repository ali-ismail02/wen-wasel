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
        Route::post('addtrip', [PassengerController::class, 'addTrip']);
        Route::post('gettrip', [PassengerController::class, 'getTripById']);
    });
});