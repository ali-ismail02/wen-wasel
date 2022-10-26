<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Trip;
use App\Models\SubTrip;
use App\Models\TripType;
use App\Models\TripInfo;

use Validator;

class PassengerController extends Controller
{
    public function passengerSignUp(Request $request){
        if(!$request->name || !$request->phone || !$request->email || !$request->password){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }
        $validator = Validator::make($request->all(), [
            'email'=>'email:rfc,dns',
            'password' => 'required|min:6',
            'phone' => 'required|min:8|max:8',
        ]);
        if($validator->fails()){
            return response()->json([
                "status" => "0",
                "message" => $validator->errors()
            ]);
        }

        if(User::where('email',$request['email'])->first()){
            return response()->json([
                "status" => "0",
                "message" => "Email taken"
            ]);
        }

        $user = new User();
        $user->name = $request->name;
        $user->phone = $request->phone;
        $user->user_type = 2;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->image = null;
        $user->save();

        return response()->json([
            "status" => "1",
            "message" => "User created successfully"
        ]);
    }

    public function addTrip(Request $request){

        if(!$request->trip_infos || !$request->directions || !$request->transport_types){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }
        
        $trip_infos = explode("@",$request->trip_infos);
        $directions = explode("@",$request->directions);
        $transport_types = explode("@",$request->transport_types);

        if(count($trip_infos) != count ($directions) || count($trip_infos) != count ($transport_types)){
            return response()->json([
                "status" => "0",
                "message" => "Unmatched trip info"
            ]);
        }

        $trip = new Trip();
        $trip->user_id = $request->user_data->id;
        $trip->save();

        for($i=0;$i<count($trip_infos);$i++){
            $trip_info_location = explode(",",$trip_infos[$i]);

            $trip_info = new TripInfo();
            $trip_info->start_location = $trip_info_location[0] . "," . $trip_info_location[1];
            $trip_info->end_location = $trip_info_location[2] . "," . $trip_info_location[3];
            $trip_info->departure_time = null;
            $trip_info->arrival_time = null;
            $trip_info->save();

            $sub_trip = new SubTrip();
            $sub_trip->trip_info_id = $trip_info->id;
            $sub_trip->directions = $directions[$i];
            $sub_trip->trip_type = $transport_types[$i];
            $sub_trip->trip_id = $trip->id;
            $sub_trip->save();
        }

        return response()->json([
            "status" => "1",
            "message" => "Trip added successfully",
            "trip_id" => $trip->id
        ]);
    }
}
