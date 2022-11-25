import Post from "../Post";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookSeatsHook = async (route) => {
    const JWT = await AsyncStorage.getItem('token');
    const data = {
        "route_id": route.id,
    }
    const response = await Post("user/add-reservation", data, JWT);

    if (response.data.status == "success") {
        return response.data.reservation.id;
    }
    return false;
}

export default BookSeatsHook;