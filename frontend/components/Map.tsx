import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from "../styles/styles";
import Search from "./Search";
import { LatLng } from "react-native-maps";
import * as Location from 'expo-location';
import MapViewDirections from "react-native-maps-directions";
import { Google_API_Key } from "../GoogleAPIKey";
import { TouchableOpacity } from "react-native-gesture-handler";


const Map = () => {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE = 33.872951;
    const LONGITUDE = 35.514698;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const INITIAL_POSITION = { latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };
    const [destination, setDestination] = useState<LatLng | null>();
    const [origin, setOrigin] = useState<LatLng | null>();
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [errorMsg, setErrorMsg] = useState("");
    const [view_directions, setViewDirections] = useState(true);

    const getUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            await getUserLocation();
            moveTo(location.coords)
        })();
    }, []);

    const moveTo = async (position: LatLng) => {
        const camera = await mapRef.current?.getCamera();
        if (camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, { duration: 1000 });
        }
    }

    const onPlaceSelect = (details, flag) => {
        const set = flag === "origin" ? setOrigin : setDestination;
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        set(position);
        moveTo(position);
    }
    return (
        <SafeAreaView>
            <View>
                <MapView
                    showsUserLocation={true}
                    onUserLocationChange={getUserLocation}
                    ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
                    {destination && <Marker coordinate={destination} />}
                    {location && destination && view_directions &&
                        <MapViewDirections
                            origin={location.coords}
                            destination={destination}
                            apikey={Google_API_Key}
                            strokeWidth={3}
                            strokeColor="hotpink" />}
                </MapView>
                <View style={styles.searchContainer}>
                    <Search onPlaceSelect={(details) => onPlaceSelect(details, "destination")} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Map; 