import Post from "./Post"
import { jwt } from "../constants/JWT";

const BookSeatsHook = async (route) => {
    const data = {
        "route_id": route.id,
    }
    const response = await Post("user/add-reservation", data, jwt);

    if (response.data.status == "success") {
        return true;
    }
    return false;
}

export default BookSeatsHook;