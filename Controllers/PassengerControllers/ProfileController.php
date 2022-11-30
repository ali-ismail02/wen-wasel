<?php

namespace App\Http\Controllers\PassengerControllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    // Api for passenger signup
    public function passengerSignUp(Request $request){
        // Validate the request
        $rules = [
            'email'=>'required|email:rfc,dns|unique:users',
            'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // at least 1 uppercase, 1 lowercase, 1 number
            'phone' => 'required|min:8|max:8',
            'name' => 'required',
        ];
        if($error = validate($request->all(), $rules)){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        // Create new user
        $user = User::create([ // ====================================================================
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'name' => $request->name,
            'user_type' => 2,
            'image' => 'default.png',
        ]);
        if(!$user){
            return response()->json([
                "status" => "Failed",
                "message" => "Failed to create user"
            ]);
        }

        // Create a token for the user to avoid another request for login
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    // Api to update profile
    public function updateProfile(Request $request){
        // Validate the request
        if($error = validate($request->all(), ['user_data' => 'required'])){
            return response()->json([
                "status" => "Failed",
                "message" => "Validation Failed",
                "errors" => $error
            ]);
        }

        $user = Auth::user();

        if($request->name) $user->name = $request->name;

        if($request->email){
            if($request->email != $user->email){
                if($error = validate($request->all(), ["email" => "required|email:rfc,dns|unique:users"])){
                    return response()->json([
                        'status' => "Failed",
                        'message' => 'Validation error',
                        'errors' => $error
                    ]);
                }
                $user->email = $request->email;
            }
        }

        if($request->phone){
            // check if phone number is unique and 8 characters long
            if($request->phone != $user->phone){
                if($error = validate($request->all(), ["phone" => "required|numeric|digits:8|unique:users"])){
                    return response()->json([
                        'status' => "Failed",
                        'message' => 'Validation error',
                        'errors' => $error
                    ]);
                }
                $user->phone = $request->phone;
            }
        }

        if($request->password){
            // check if password is strong
            if($error = validate($request->all(), ["password" => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'])){
                return response()->json([
                    'status' => "Failed",
                    'message' => 'Validation error',
                    'errors' => $error
                ]);
            }
            $user->password == bcrypt($request->password);
        }


        if($request->image){
            // Convert the base64 image to a image file and save it
            $img = $request->image;
            $img = str_replace('data:image/jpeg;base64,', '', $img);
            $img = str_replace(' ', '+', $img);
            $data = base64_decode($img);
            $filee = uniqid() . '.jpeg';
            $file = public_path('images')."\\".$filee;
            $user->image = $filee;
            file_put_contents($file, $data);
        }

        $user->save();

        // Generate a new token for the user
        $token = JWTAuth::fromUser($user);

        return response()->json([
            'status' => 1,
            'message' => 'User updated',
            'user' => $user,
            'token' => $token
        ]);
    }
}
