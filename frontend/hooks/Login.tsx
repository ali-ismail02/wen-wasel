import Post from "./Post";

const Login = async (email, password) => {
    const response = await Post("auth/login", { email, password });
    if(response.status === 200) {
        return response.data;
    }
    return null;
};

export default Login;