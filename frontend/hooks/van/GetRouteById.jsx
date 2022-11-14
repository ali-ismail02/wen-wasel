import Get from "../Get";
import { JWT } from "../../constants/vanJWT";

const GetRouteById = async (id) => {
    const response = await Get(`van/get-route/${id}`, JWT);
    if (response.data.status === "Success") {
        return response.data;
    }
    return false;
}

export default GetRouteById;