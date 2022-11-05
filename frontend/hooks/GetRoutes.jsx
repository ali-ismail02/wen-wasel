import React, { useEffect } from "react";
import Get from "./Get";
import axios from "axios";
import checkPoint from "./HelperFunctions";
import calculateDistance from "./HelperFunctions";
import checkTripInfo from "./HelperFunctions";
import {Google_API_Key} from "../GoogleAPIKey";

const getDirections = async (start_location, end_location) => {
    const config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${start_location}&destination=${end_location}&mod=${trip_type}&key=${Google_API_Key}`,
        headers: { }
      };
      
      axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
}

// function to get routes from the backend
const getRoutes = async (start_location, end_location, trip_type) => {
    const [res, setResponse] = React.useState(null);
    const [x, setX] = React.useState(null);
    const [trips, setTrips] = React.useState([]);
    // get the routes from the backend
    const jwt = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE2Njc2NjUyMTIsImV4cCI6MTY2ODI3MDAxMiwibmJmIjoxNjY3NjY1MjEyLCJqdGkiOiJXOXFnNmRSajJoZFBLd0xtIiwic3ViIjoiMTUiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.i0O4BNcw8weGbhw81RDanJcpvXsde1xa1A2_uSsLtX8"
    useEffect(() => {
        const getTrips = async () => {
            const response = await Get("user/get-possible-routes/" + start_location + "/" + end_location, jwt);
            setResponse(response);
        }
        getTrips();
    }, [res===null]);
    
    if(res == null) {
        return null;
    }
    let flag = 1

    if(trip_type == 1){
    }
    if(trip_type == 2){
    }
    if(trip_type == 3){
    }

    console.log(min_trip)
    return min_trip

}

export default getRoutes;