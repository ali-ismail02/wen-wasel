import Post from "../Post";

const ValidateUser = async (email,phone, password) => {
    const response = await Post("van/validate", {email, phone, password});
    if(response.data.status == "Success"){
        return true;
    }
    return response.data;
}

export default ValidateUser;