import React, { useState, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Google_API_Key } from "../constants/GoogleAPIKey";
import styles from "../styles/styles";
import { Appearance } from 'react-native';

const Search = ({ onPlaceSelect }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);
    return (
    <GooglePlacesAutocomplete
        styles={{ textInput: style.input }}
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