<?php
use Validator;
// Function to find the distance between two points
    function distance($lat1, $lon1, $lat2, $lon2, $unit) {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }
        else {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);
            if ($unit == "K") {
                return ($miles * 1.609344);
            } else if ($unit == "N") {
                return ($miles * 0.8684);
            } else {
                return $miles;
            }
        }
    }
    
    // Function to check if trip info is within 2 location points
    function checkTripInfo($trip_start_location, $trip_end_location, $start_location, $end_location){
        $start_location = explode(",",$start_location);
        $end_location = explode(",",$end_location);
        $trip_info_start_location = explode(",",$trip_start_location);
        $trip_info_end_location = explode(",",$trip_end_location);

        $start_lat = $start_location[0];
        $start_lng = $start_location[1];
        $end_lat = $end_location[0];
        $end_lng = $end_location[1];
        $trip_info_start_lat = $trip_info_start_location[0];
        $trip_info_start_lng = $trip_info_start_location[1];
        $trip_info_end_lat = $trip_info_end_location[0];
        $trip_info_end_lng = $trip_info_end_location[1];

        // get center of 2 location points
        $center_lat = ($start_lat + $end_lat) / 2;
        $center_lng = ($start_lng + $end_lng) / 2;

        $distance = distance($center_lat, $center_lng, $trip_info_start_lat, $trip_info_start_lng, "K");
        // Check if the trip info is within 2 the location points with 1 km radius added
        if($distance < distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = distance($center_lat, $center_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
            if($distance < distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                $distance = distance($end_lat, $end_lng, $trip_info_end_lat, $trip_info_end_lng, "K");
                // Check if the trip info end location is closer to the end location than the trip info start location
                if($distance < distance($end_lat, $end_lng, $trip_info_start_lat, $trip_info_start_lng, "K")){
                    return true;
                }
            }
        }
        return false;
    }

    // Function to check if point is within 2 location points
    function checkPoint($point, $start_location, $end_location){
        $start_location = explode(",",$start_location);
        $end_location = explode(",",$end_location);
        $point = explode(",",$point);

        $start_lat = $start_location[0];
        $start_lng = $start_location[1];
        $end_lat = $end_location[0];
        $end_lng = $end_location[1];
        $point_lat = $point[0];
        $point_lng = $point[1];

        // Get center of 2 location points
        $center_lat = ($start_lat + $end_lat) / 2;
        $center_lng = ($start_lng + $end_lng) / 2;

        // check if the distance to the point is less than the radius of the 2 location points
        $distance = distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
        if($distance < distance($center_lat, $center_lng, $start_lat, $start_lng, "K") + 1){
            $distance = distance($center_lat, $center_lng, $point_lat, $point_lng, "K");
            if($distance < distance($center_lat, $center_lng, $end_lat, $end_lng, "K") + 1 ){
                return true;
            }
        }

        return false;
    }

    // Function to validate values using Validator class
    function validate($data, $rules){
        $validate = Validator::make($data, $rules);
        if($validate->fails()){
            return $validate->errors();
        }
        return false;
    }