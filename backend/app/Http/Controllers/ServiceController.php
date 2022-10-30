<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Driver;
use App\Models\TripRecord;
use App\Models\TripInfo;
use Validator;
use JWTAuth;

class ServiceController extends Controller
{
    // Api for service driver registration
    public function serviceSignup(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8|unique:users',
            'name' => 'required',
            'phone' => 'required',
            'license_plate' => 'required',
            'license' => 'required',
            'front_image' => 'required',
            'side_image' => 'required',
            'make' => 'required',
            'model' => 'required',
            'year' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        // Converting the base64 images to images and saving them
        $images = [$request->license, $request->front_image, $request->side_image];
        $image_names = [];

        foreach($images as $img){
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
            $file = public_path('images')."\\".$filee;
            $image_names[] = $filee;
            file_put_contents($file, $data);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->phone = $request->phone;
        $user->user_type = 4;
        $user->image = null;
        $user->save();

        $driver = new Driver();
        $driver->license_plate = $request->license_plate;
        $driver->seats = 0;
        $driver->model = $request->model;
        $driver->make = $request->make;
        $driver->year = $request->year;
        $driver->license = $image_names[0];
        $driver->front_image = $image_names[1];
        $driver->side_image = $image_names[2];
        $driver->user_id = $user->id;
        $driver->save();

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
            'driver' => $driver
        ], 200);
    }

    // Api to add a trip record
    public function addTripRecord(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
            'start_location' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $driver = $user->drivers()->first();
        if($driver == null){
            return response()->json([
                "status" => "0",
                "message" =>"You are not a driver"
            ]);
        }

        // Adding new trip info for the trip record
        $trip_info = new TripInfo();
        $trip_info->departure_time = date('Y-m-d H:i:s');
        $trip_info->start_location = $request->start_location;
        $trip_info->arrival_time = null;
        $trip_info->end_location = null;
        $trip_info->save();
        
        // Adding new trip record and assigning the trip info to it
        $trip_record = new TripRecord();
        $trip_record->driver_id = $driver->id;
        $trip_record->trip_info_id = $trip_info->id;
        $trip_record->save();

        return response()->json([
            'status' => '1',
            'message' => 'Trip record added successfully',
            'trip_record' => $trip_record,
            'trip_info' => $trip_info
        ], 200);
    }

    // Api to end a trip record by id
    public function endTrip(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
            'end_location' => 'required',
            'trip_record_id' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $driver = $user->drivers()->first();
        if($driver == null){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found"
            ]);
        }

        // Get the trip record by id
        $trip_record = $driver->tripRecords()->where('id', $request->trip_record_id)->first();
        if($trip_record == null){
            return response()->json([
                "status" => "0",
                "message" =>"Trip record not found"
            ]);
        }

        // Get the trip info of the trip record
        $trip_info = $trip_record->tripInfo()->first();
        if($trip_info == null){
            return response()->json([
                "status" => "0",
                "message" =>"Trip info not found"
            ]);
        }

        // Update the trip info
        $trip_info->arrival_time = date('Y-m-d H:i:s');
        $trip_info->end_location = $request->end_location;
        $trip_info->save();

        return response()->json([
            'status' => '1',
            'message' => 'Trip ended successfully',
            'trip_record' => $trip_record,
            'trip_info' => $trip_info
        ], 200);
    }

    // Api to get all the trip records of a driver
    public function getTrips(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $driver = $user->drivers()->first();
        if($driver == null){
            return response()->json([
                "status" => "0",
                "message" =>"Driver not found"
            ]);
        }

        // Get all the trip records of the driver with a trip info
        $trips = $driver->tripRecords()->with('tripInfo')->get();

        return response()->json([
            'status' => '1',
            'message' => 'Trips fetched successfully',
            'trips' => $trips
        ], 200);
    }

    // api to update van driver's profile
    public function updateProfile(Request $request){
        // Validate the request
        $validator = Validator::make($request->all(), [
            'user_data' => 'required',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" =>"Validation Failed",
                "errors" => $validator->errors()
            ]);
        }

        $user = JWTAuth::parseToken()->authenticate();
        $driver = $user->drivers()->first();
        if(!$driver){
            return response()->json([
                'status' => 0,
                'message' => 'Driver not found'
            ]);
        }

        if($request->email){
            if($request->email != $user->email){
                $validator = Validator::make($request->all(), [
                    'email' => 'required|email:rfc,dns|unique:users' // check if email is unique and valid
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => 0,
                        'message' => $validator->errors()->first()
                    ]);
                }
                $user->email = $request->email;
            }
        }

        if($request->phone){
            // check if phone number is unique and 8 characters long
            if($request->phone != $user->phone){
                $validator = Validator::make($request->all(), [
                    'phone' => 'required|numeric|digits:8|unique:users'
                ]);
                if($validator->fails()){
                    return response()->json([
                        'status' => 0,
                        'message' => $validator->errors()->first()
                    ]);
                }
                $user->phone = $request->phone;
            }
        }

        if($request->password){
            // check if password is strong
            $validator = Validator::make($request->all(), [
                'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/' // at least 1 uppercase, 1 lowercase, 1 number
            ]);
            if($validator->fails()){
                return response()->json([
                    'status' => 0,
                    'message' => $validator->errors()->first()
                ]);
            }
            $user->password == bcrypt($request->password);
        }

        if($request->image){
            $img = $request->image;
            $img = str_replace('data:image/png;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.png';
            $file = public_path('images')."\\".$filee;
            $user->image = $filee;
            file_put_contents($file, $data);
        }

        if($request->name) $user->name = $request->name;

        if($request->make) $driver->make = $request->make;

        if($request->model) $driver->model = $request->model;

        if($request->year) $driver->year = $request->year;

        if($request->license_plate) $driver->license_plate = $request->license_plate;

        if($request->seats) $driver->seats = $request->seats;

        $user->save();
        $driver->save();

        return response()->json([
            'status' => 1,
            'message' => 'Driver updated',
            'user' => $user,
            'driver' => $driver
        ]);
    }
}
