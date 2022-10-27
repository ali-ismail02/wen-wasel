<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use File;
use Response;

class ImagesController extends Controller
{
    public function getImageByName(Request $request){
        $path = public_path('images/').$request->name;
        if(!file_exists($path)){
            return response()->json(['message' => $path], 404);
            abort(404);
        }
        $file = File::get($path);
        $type = File::mimeType($path);
        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);
        return $response;
    }
}
