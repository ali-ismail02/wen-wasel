import React, {useState} from "react";
import { Dimensions, SafeAreaView, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import styles from "../styles/styles";
import Search from "./Search";
import { LatLng } from "react-native-maps";

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {latitude: LATITUDE, longitude: LONGITUDE, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA};


const Map = () => {
    const [destination, setDestination] = useState<LatLng | null>();
    const [origin, setOrigin] = useState<LatLng | null>();
    const mapRef = React.useRef<MapView>(null);
    

    const moveTo = async (position: LatLng) => {
        const camera = await mapRef.current?.getCamera();
        if(camera) {
            camera.center = position;
            mapRef.current?.animateCamera(camera, {duration: 1000});
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
                    <MapView ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION} />
                    <View style={styles.searchContainer}>
                        <Search onPlaceSelect={(details) => onPlaceSelect(details, "destination")} />
                    </View>
            </View>
        </SafeAreaView>
    );
};

export default Map; 