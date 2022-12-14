import Post from "../Post";

const RegisterPassenger = async (name, phone, email, password) => {
    const data = { name, phone, email, password };
    const response = await Post("user/signup", data);
    if(response){
        return response.data;
    }
    return null;
}

export default RegisterPassenger;