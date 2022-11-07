import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { BackHandler, Dimensions, Image, SafeAreaView, TouchableHighlight, View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import styles from "../styles/styles";
import CustomMap from './CustomMap';
import CustomSlider from './CustomSlider';
import Search from "./Search";

const Map = () => {
    const [destination, setDestination] = useState<LatLng | null>();
    const mapRef = React.useRef<MapView>(null);
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [centerMap, setCenterMap] = useState(true);
    const [searchDisplay, setSearchDisplay] = useState({})
    const [sliderValue, setSliderValue] = useState(1);

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
        centerScreen(location.coords, position);
        setCenterMap(false);
        setSearchDisplay({ display: 'none' });
    }

    return (
        <SafeAreaView>
            <View>
                <CustomMap setCenterMap = {setCenterMap} centerMap = {centerMap} mapRef = {mapRef} destination = {destination} moveTo = {moveTo}/>
                <View style={[styles.searchContainer, searchDisplay]}>
                    <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                </View>
                <TouchableHighlight style={styles.center} onPress={async () => {
                    moveTo(location?.coords);
                    setCenterMap(true)}
                    }>
                    <Image source={require('../assets/images/center.jpg')} style={styles.centerImage} />
                </TouchableHighlight>
                <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
            </View>
        </SafeAreaView>
    );
};

export default Map; 