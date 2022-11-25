import Post from "../Post";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddOneTimeRoute = async (location,date_time) => {
    const JWT = await AsyncStorage.getItem('token');
    // convert date_time to sql input format
    const date = new Date(date_time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const sqlDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    let loc = location.latitude + "," + location.longitude;
    const response = await Post('van/add-one-route', {location:loc,date_time:sqlDate}, JWT);
    if(response.data.status === "Success") {
        return response.data.route.id;
    }
    return false;
}

export default AddOneTimeRoute;