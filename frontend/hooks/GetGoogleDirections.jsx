import axios from "axios";
import { Google_API_Key } from "../constants/GoogleAPIKey";

const getDirections = async (start_location, end_location, trip_type = "driving") => {
    const config = {
        method: 'get',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${start_location}&destination=${end_location}&mode=${trip_type}&key=${Google_API_Key}`,
        headers: {}
    };

    return await axios.get(config.url, config.headers)
}

export default getDirections;