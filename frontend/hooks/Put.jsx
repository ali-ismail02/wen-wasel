import axios from 'axios';
import { base_url } from '../constants/BaseURL';
const Put = async (api_url, api_data, api_token = null) => {
    try {
        return await axios.put(
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
        console.log(error);
        return false
    }
};
export default Put