import Put from "../Put";
import { JWT } from "../../constants/vanJWT";

const SetTripArrived = async (id) => {
    const data = {
        route_id: id,
    }
    const response = await Put(`van/arrive-at-route`, data, JWT);

    if (response.status === 200) {
        return true;
    }
    return false;
}

export default SetTripArrived;