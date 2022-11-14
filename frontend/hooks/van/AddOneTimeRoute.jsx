import Post from "../Post";
import { JWT } from "../../constants/vanJWT";

const AddOneTimeRoute = async (location,date_time) => {
    date_time = date_time.replace(/\//g, "-");
    let loc = location.latitude + "," + location.longitude;
    const response = await Post('van/add-one-route', {location:loc,date_time}, JWT);
    if(response.data.status === "Success") {
        return response.data.route.id;
    }
    return false;
}

export default AddOneTimeRoute;