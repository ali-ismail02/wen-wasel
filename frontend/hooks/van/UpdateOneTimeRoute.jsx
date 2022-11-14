import Put from "../Put";
import { JWT } from "../../constants/vanJWT";

const UpdateOneTimeRoute = async (id, date_time) => {
    // convert date_time to sql input format
    const date = new Date(date_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const sqlDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    const response = await Put('van/update-one-route', { route_id: id, date_time:sqlDate }, JWT);
    if (response.data.status === "Success") {
        return true;
    }
    return false;
}

export default UpdateOneTimeRoute;