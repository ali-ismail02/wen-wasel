import { jwt } from "../../constants/JWT";
import Post from "../Post";

const BookSeatsHook = async (route) => {
    const data = {
        "route_id": route.id,
    }
    const response = await Post("user/add-reservation", data, jwt);

    if (response.data.status == "success") {
        return response.data.reservation.id;
    }
    return false;
}

export default BookSeatsHook;