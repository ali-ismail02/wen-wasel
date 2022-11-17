import Put from "../Put";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SetTripArrived = async (id) => {
    const JWT = await AsyncStorage.getItem('token');
    console.log(JWT);
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