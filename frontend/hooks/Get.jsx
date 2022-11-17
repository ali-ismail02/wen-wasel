import axios from 'axios';
import { base_url } from '../constants/BaseURL';
const Get = async (api_url, api_token = null) => {
    try {
        return await axios.get(
            base_url + api_url,
            {
                headers: {
                    'Authorization': api_token,
                    "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json"
                }
            }
        );
    } catch (error) {
        console.log(error);
        return false
    }
};
export default Get