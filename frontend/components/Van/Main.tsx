import React, { useState } from "react";
import { View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "./CustomMap";
import Routes from "./Routes";
import { centerScreen } from "../../hooks/CameraChange";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [allDestinations, setAllDestinations] = useState(null);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const mapRef = React.useRef<MapView>(null);

    const onPlaceSelect = (details) => {
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        setDestination(position);
        centerScreen(location, position, mapRef, 150);
        setCenterMap(false);
        setState("destinationsSet");
    }

    const setState = (state) => {
        setUserState(state);
        setAllUserStates([...allUserStates, state]);
    }

    const setDestinations = (destination: LatLng, time: string) => {
        setDestination(null);
        setAllDestinations([...allDestinations, [destination, time]]);
        setState("destinationsSet");
    }

    const components = {
        destinationsSet: <Routes destination={destination} setState={setState} destinations= {allDestinations}/>,
    }

    return (
        <View>
            <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} setDestination={setDestination} userState={userState} onPlaceSelect={onPlaceSelect}/>
            {components[userState]}
        </View>
    );
};

export default Main;