import Post from "../Post";
import {vanJWT} from "../vanJWT";

const AddOneTimeRoute = async (location,date_time) => {
    const response = await Post('/api/van/addOneTimeRoute', {location,date_time}, vanJWT);
    if(response.data.status === "success") {
        return response.data.route.id;
    }
    return false;
}