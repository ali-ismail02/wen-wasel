import Put from "./Put";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateProfile = async (image, name, email, password ,phone , type) => {
    const token = await AsyncStorage.getItem("token");
    let url = "";
    if(type == "user"){
        url = "user/update-profile";
    }
    if(type == "van"){
        url = "van/update-profile";
    }
    if(!image){
        if(!name || !email || !password){
            return false;       
        }
        const response = await Put(url, {name, email, password, phone}, token);
        if(response){
            return response.data;
        }
        return false;
    }
    const response = await Put(url, {image}, token);
    if(response){
        return response.data;
    }
    return false;
}

export default UpdateProfile;