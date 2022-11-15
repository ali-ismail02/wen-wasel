import Get from "../Get";
import { JWT } from "../../constants/vanJWT";

const GetRecurringRoute = async (id) => {
    const respone = await Get("van/get-recurring-route", JWT);
    if (respone.status === 200) {
        if(respone.data.presaved_routes.length > 0) {
            return respone.data.presaved_routes;
        }
        return null;
    }

    return false;
}

export default GetRecurringRoute;