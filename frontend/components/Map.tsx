import { BackHandler, SafeAreaView, View } from "react-native";
import { centerScreen, moveTo } from '../hooks/CameraChange';
import MapView, { LatLng } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import CenterMapButton from "./CenterMapButton";
import * as Location from 'expo-location';
import CustomSlider from './CustomSlider';
import styles from "../styles/styles";
import CustomMap from './CustomMap';
import Search from "./Search";

const Map = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [searchDirsplay, setSearchDisplay] = useState<boolean>(true);
    const [sliderDisplay, setSliderDisplay] = useState<boolean>(false);
    const [centerMapDisplay, setCenterMapDisplay] = useState<boolean>(true);
    const [destination, setDestination] = useState<LatLng | null>();
    const [sliderValue, setSliderValue] = useState(1);
    const [centerMap, setCenterMap] = useState(true);
    const mapRef = React.useRef<MapView>(null);

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

    const backPressed = () => {
        setDestination(null);
        setCenterMap(true);
        setSearchDisplay(true);
        setSliderDisplay(false);
        setCenterMapDisplay(true);
        return true;
    }

    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressed
    );

    const onPlaceSelect = (details) => {
        const set = setDestination;
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        set(position);
        centerScreen(location.coords, position, mapRef);
        setCenterMap(false);
        setSearchDisplay(false);
        setSliderDisplay(true);
        setCenterMapDisplay(false);
    }

    return (
        <SafeAreaView>
                <View>
                    <CustomMap setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} />
                    {centerMapDisplay == true && <View style={styles.searchContainer}>
                        <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                    </View>}
                    {centerMapDisplay == true && <CenterMapButton setCenterMap={setCenterMap} moveTo={moveTo} mapRef={mapRef} location={location}/>}
                    {sliderDisplay == true && <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />}
                </View>
        </SafeAreaView>
    );
};

export default Map; 