import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, View, Image, TouchableNativeFeedback, TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from "../styles/styles";
import Search from "./Search";

const Map = () => {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;
    const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
    const INITIAL_POSITION = { latitude: 33.872951, longitude: 35.514698, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };
    const [destination, setDestination] = useState<LatLng | null>();
    const [origin, setOrigin] = useState<LatLng | null>();
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [centerMap, setCenterMap] = useState(true);
    const [x, setX] = useState(0);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        getLocation();
    }, []);

    const getUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
    }

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
                    onPanDrag={() => setCenterMap(false)}
                    followsUserLocation={centerMap}
                    showsMyLocationButton={false}
                    userLocationUpdateInterval={1000}
                    onUserLocationChange={(coordinate) => {
                        centerMap === true && moveTo(coordinate.nativeEvent.coordinate);
                    }}
                    ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
                    {destination && <Marker coordinate={destination} />}
                </MapView> 
                <View style={styles.searchContainer}>
                    <Search onPlaceSelect={(details) => onPlaceSelect(details, "destination")} />
                </View>
                <TouchableHighlight style={styles.center} onPress={async () => {
                    moveTo(location?.coords);
                    setCenterMap(true)}
                    }>
                    <Image source={require('../assets/images/center.jpg')} style={styles.centerImage} />
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
};

export default Map; 