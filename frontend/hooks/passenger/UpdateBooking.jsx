import {jwt} from "../../constants/JWT";
import Put from "../Put";

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