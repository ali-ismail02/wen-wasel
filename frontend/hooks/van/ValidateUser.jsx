import Post from "../Post";

const ValidateUser = (email,phone, password) => {
    const response = Post("van/validate", {email, phone, password});
    if(response.data.status == "Success"){
        return true;
    }
    return false;
}

export default ValidateUser;