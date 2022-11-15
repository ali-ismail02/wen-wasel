import React, { useState } from "react";
import { View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "./CustomMap";
import Routes from "./Routes";
import { centerScreen } from "../../hooks/CameraChange";
import AddingDestination from "./AddingDestination";
import DelayingDestinations from "./DelayingDestinations";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [allDestinations, setAllDestinations] = useState([]);
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

    const setDestinations = (destination, time) => {
        setDestination(null);
        setAllDestinations([...allDestinations, [destination, time]]);
        setState("destinationsSet");
    }

    const updateAllDestinations = (destinations) => {
        setAllDestinations(destinations);
    }

    const components = {
        destinationsSet: <Routes destination={destination} setState={setState} destinations= {allDestinations} setDestinations={updateAllDestinations}/>,
        addingRoute: <AddingDestination setDestinations={setDestinations} setState={setState} destination={destination}/>,
        delaying: <DelayingDestinations destinations={allDestinations} setDestinations={updateAllDestinations} setState={setState}/>,
    }

    return (
        <View>
            <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} setDestination={setDestination} userState={userState} onPlaceSelect={onPlaceSelect}/>
            {components[userState]}
        </View>
    );
};

export default Main;