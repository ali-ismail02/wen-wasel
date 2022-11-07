import React from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Google_API_Key } from "../constants/GoogleAPIKey";
import styles from "../styles/styles";

const Search = ({ onPlaceSelect }) => {
    return (
    <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder='Search'
        fetchDetails
        onPress={(data, details = null) => {
            onPlaceSelect(details)
        }}
        query={{
            key: Google_API_Key,
            language: 'en',
        }}
    />);
}
export default Search;