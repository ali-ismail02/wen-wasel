import axios from 'axios';
let base_url = "http://192.168.1.50:8000/api/";
const Post = async (api_url, api_data, api_token = null) => {
    try {
        return await axios.post(
            base_url + api_url,
            api_data,
            {
                headers: {
                    'Authorization': api_token,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );
    } catch (error) {
        console.log("Error from POST API", error);
    }
};
export default Post