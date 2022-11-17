import Get from '../Get';
import AsyncStorage from "@react-native-async-storage/async-storage";

const GetFares = async (path) => {
    const JWT = await AsyncStorage.getItem('token');
    console.log(JWT);
    const response = await Get("user/get-fares", jwt);
    let price = 0;
    for (const trip of path) {
        if (trip.name != "end_location") {
            if (trip.name.includes("service") && trip.name.includes("start")) {
                price += response.data.fares[0].fare;
            } else if (trip.name.includes("van") && trip.name.includes("start")) {
                price += response.data.fares[1].fare;
            }
        }
    }

    return price;
}

export default GetFares;