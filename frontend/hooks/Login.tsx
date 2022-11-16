import Post from "./Post";

const Login = async (email, password) => {
    const response = await Post("auth/login", { email, password });
    if(response) {
        return response.data;
    }
    return null;
};

export default Login;