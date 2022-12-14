import axios from 'axios';
import { base_url } from '../constants/BaseURL';

const Delete = async (api_url, api_data, api_token = null) => {
    try {
        return await axios.delete(
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
export default Delete