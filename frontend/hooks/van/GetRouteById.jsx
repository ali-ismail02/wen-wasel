import Get from "../Get";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetRouteById = async (id) => {
    const JWT = await AsyncStorage.getItem('token');
    const response = await Get(`van/get-route/${id}`, JWT);
    if (response.data.status === "Success") {
        return response.data;
    }
    return false;
}

export default GetRouteById;