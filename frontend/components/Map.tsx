import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
<<<<<<< Updated upstream
import { Dimensions, SafeAreaView, View, Image, TouchableNativeFeedback, TouchableHighlight, BackHandler } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
=======
import { BackHandler, Dimensions, Image, SafeAreaView, TouchableHighlight, View } from "react-native";
>>>>>>> Stashed changes
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
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [centerMap, setCenterMap] = useState(true);
    const [searchDisplay, setSearchDisplay] = useState({})

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            setSearchDisplay({ display: 'flex' })
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

    const centerScreen = (origin, destination) => {
        mapRef.current?.fitToCoordinates([origin, destination], {
            edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
            animated: true,
        });
    }

    const backPressed = () => {
        setDestination(null);
        setCenterMap(true);
        setSearchDisplay({ display: 'flex' });
        return true;
    }
<<<<<<< Updated upstream
    
    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressed
      );
=======

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressed
    );
>>>>>>> Stashed changes

    const onPlaceSelect = (details) => {
        const set = setDestination;
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        set(position);
        centerScreen(location.coords, position);
        setCenterMap(false);
        setSearchDisplay({ display: 'none' });
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
<<<<<<< Updated upstream
                </MapView> 
=======
                </MapView>
>>>>>>> Stashed changes
                <View style={[styles.searchContainer, searchDisplay]}>
                    <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                </View>
                <TouchableHighlight style={styles.center} onPress={async () => {
                    moveTo(location?.coords);
<<<<<<< Updated upstream
                    setCenterMap(true)}
                    }>
=======
                    setCenterMap(true)
                }}>
>>>>>>> Stashed changes
                    <Image source={require('../assets/images/center.jpg')} style={styles.centerImage} />
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
};

export default Map; 