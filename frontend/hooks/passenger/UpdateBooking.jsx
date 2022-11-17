import Put from "../Put";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateBooking = async (booking) => {
    const JWT = await AsyncStorage.getItem('token');
    console.log(JWT);
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