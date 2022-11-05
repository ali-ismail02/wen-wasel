// Calculate distance between two geo points in many units 
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number, unit: string) => {
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * lat1/180;
        const radlat2 = Math.PI * lat2/180;
        const theta = lon1-lon2;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === "K") { dist = dist * 1.609344 }
        if (unit === "N") { dist = dist * 0.8684 }
        return dist;
    }
}

// Function to check if trip info is within 2 location points
const checkTripInfo = (trip_start_location: string, trip_end_location: string, start_location: string, end_location: string) => {
    const start_location_array = start_location.split(",");
    const end_location_array = end_location.split(",");
    const trip_info_start_location_array = trip_start_location.split(",");
    const trip_info_end_location_array = trip_end_location.split(",");

    const start_lat = parseFloat(start_location_array[0]);
    const start_lng = parseFloat(start_location_array[1]);
    const end_lat = parseFloat(end_location_array[0]);
    const end_lng = parseFloat(end_location_array[1]);
    const trip_info_start_lat = parseFloat(trip_info_start_location_array[0]);
    const trip_info_start_lng = parseFloat(trip_info_start_location_array[1]);
    const trip_info_end_lat = parseFloat(trip_info_end_location_array[0]);
    const trip_info_end_lng = parseFloat(trip_info_end_location_array[1]);

    // get center of 2 location points
    const center_lat = (start_lat + end_lat) / 2;
    const center_lng = (start_lng + end_lng) / 2;

    let distance = calculateDistance(center_lat, center_lng, trip_info_start_lat, trip_info_start_lng, "K");
    // Check if the trip info is within 2 the location points with 1 km radius added
    if(distance < calculateDistance(center_lat, center_lng, start_lat, start_lng, "K") + 1){
        distance = calculateDistance(center_lat, center_lng, trip_info_end_lat, trip_info_end_lng, "K");
        if(distance < calculateDistance(center_lat, center_lng, end_lat, end_lng, "K") + 1 ){
            distance = calculateDistance(end_lat, end_lng, trip_info_end_lat, trip_info_end_lng, "K");
            // Check if the trip info end location is closer to the end location than the trip info start location
            if(distance < calculateDistance(end_lat, end_lng, trip_info_start_lat, trip_info_start_lng, "K")){
                return true;
            }
        }
    }
    return false;
}

// // Function to check if point is within 2 location points
const checkPoint = (point: string, start_location: string, end_location: string) => {
    const start_location_array = start_location.split(",");
    const end_location_array = end_location.split(",");
    const point_array = point.split(",");
    
    const start_lat = parseFloat(start_location_array[0]);
    const start_lng = parseFloat(start_location_array[1]);
    const end_lat = parseFloat(end_location_array[0]);
    const end_lng = parseFloat(end_location_array[1]);
    const point_lat = parseFloat(point_array[0]);
    const point_lng = parseFloat(point_array[1]);

    // Get center of 2 location points
    const center_lat = (start_lat + end_lat) / 2;
    const center_lng = (start_lng + end_lng) / 2;

    // check if the distance to the point is less than the radius of the 2 location points
    let distance = calculateDistance(center_lat, center_lng, point_lat, point_lng, "K");
    if(distance < calculateDistance(center_lat, center_lng, start_lat, start_lng, "K") + 1){
        distance = calculateDistance(center_lat, center_lng, point_lat, point_lng, "K");
        if(distance < calculateDistance(center_lat, center_lng, end_lat, end_lng, "K") + 1 ){
            return true;
        }
    }

    return false;
}


export default {calculateDistance, checkTripInfo}; 