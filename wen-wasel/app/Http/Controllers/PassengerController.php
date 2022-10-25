<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class PassengerController extends Controller
{
    public function passengerSignUp(Request $request){
        if(!$request->name || !$request->phone || !$request->email || !$request->password){
            return response()->json([
                "status" => "0",
                "message" => "Missing Fields"
            ]);
        }
        if($user->where('email',$request['email'])->first()){
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
}
