import React from "react";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, ScrollView, SafeAreaView } from "react-native";
import styles from "../styles/styles";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Google_API_Key } from "../GoogleAPIKey";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA};

const Map = () => {
    return (
        <SafeAreaView>
            <View>
                    <MapView style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION} />
                    <View style={styles.searchContainer}>
                        <GooglePlacesAutocomplete
                            styles={{textInput: styles.input}}
                            placeholder='Search'
                            onPress={(data, details = null) => {
                            }}
                            query={{
                                key: Google_API_Key,
                                language: 'en',
                            }}
                        />
                    </View>
            </View>
        </SafeAreaView>
    );
};

export default Map; 