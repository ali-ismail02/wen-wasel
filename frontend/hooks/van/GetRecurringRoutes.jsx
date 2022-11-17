import Get from "../Get";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetRecurringRoute = async (id) => {
    const JWT = await AsyncStorage.getItem('token');
    console.log(JWT);
    const respone = await Get("van/get-recurring-routes", JWT);
    if (respone.status === 200) {
        if(respone.data.presaved_routes.length > 0) {
            return respone.data.presaved_routes;
        }
        return null;
    }

    return false;
}

export default GetRecurringRoute;