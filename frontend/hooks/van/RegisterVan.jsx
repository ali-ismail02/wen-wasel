import Post from "../Post";

const RegisterVan = async (data) => {
    const response = await Post("van/signup", data);
    if(response){
        return response.data;
    }
    return null;
}

export default RegisterVan;