import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Google_API_Key } from "../constants/GoogleAPIKey";

const Search = ({ onPlaceSelect, style }) => {
    return (
    <GooglePlacesAutocomplete
        styles={{ textInput: style.input, row: style.predefinedPlacesDescription,poweredContainer: {display:"none"}, description: style.predefinedPlacesDescription, separator: style.separator, container: {marginBottom:-5}}}
        textInputProps={{
            placeholderTextColor: "#888",
            returnKeyType: "search"
          }}
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