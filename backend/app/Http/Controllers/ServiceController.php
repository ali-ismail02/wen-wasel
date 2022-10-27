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
    public function serviceSignup(Request $request){
        $validator = Validator::make($request->all(), [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:6',
            'phone' => 'required|min:8|max:8',
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

        if(User::where('phone', $request->phone)->exists()){
            return response()->json([
                "status" => "0",
                "message" =>"Phone number already exists"
            ]);
        }

        $images = [$request->license, $request->front_image, $request->side_image];
        $image_names = [];

        foreach($images as $img){
            // convert base64 to image and save it
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

    public function addTripRecord(Request $request){
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

        $driver = Driver::where('user_id', $request->user_data->id)->first();

        $trip_info = new TripInfo();
        $trip_info->departure_time = date('Y-m-d H:i:s');
        $trip_info->start_location = $request->start_location;
        $trip_info->arrival_time = null;
        $trip_info->end_location = null;
        $trip_info->save();
        
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
}
