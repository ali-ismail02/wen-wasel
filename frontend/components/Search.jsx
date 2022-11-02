import React from "react";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Google_API_Key } from "../GoogleAPIKey";
import styles from "../styles/styles";

const Search = ({ onPlaceSelect }) => {
    <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder='Search'
        onPress={(data, details = null) => {
            onPlaceSelect(details)
        }}
        query={{
            key: Google_API_Key,
            language: 'en',
        }}
    />
}
export default Search;