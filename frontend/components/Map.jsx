import React from "react";
import { Dimensions, View } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Google_API_Key } from "../GoogleAPIKey";
import styles from "../styles/styles";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = { latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };

const Map = () => {
    return (
        <View style={{ height: Dimensions.get("window").height }}>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION} />
            <View style={styles.searchContainer}>
                <GooglePlacesAutocomplete
                    styles={{ textInput: styles.input }}
                    placeholder='Search'
                    onPress={(data, details = null) => {
                    }}
                    query={{
                        key: { Google_API_Key },
                        language: 'en',
                    }}
                />
            </View>
        </View>
    );
};

export default Map; 