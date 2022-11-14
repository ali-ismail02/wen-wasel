import Put from "./Put";
import jwt from "../constants/JWT";

const UpdateBooking = async (booking) => {
    const data = {
        reservation_id: booking
    }
    const response = await Put("user/update-reservation", data, jwt);

    if (response.data.status == "success") {
        return true;
    }
    return false;
}

export default UpdateBooking;