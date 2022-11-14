import React, { useState } from "react";
import { View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "./CustomMap";
import Route from "./Routes";
import { centerScreen } from "../../hooks/CameraChange";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [allDestinations, setAllDestinations] = useState<LatLng[]>([]);
    const [path, setPath] = useState<LatLng[] | null>([]);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const mapRef = React.useRef<MapView>(null);

    const components = {
        none: <Route destination={destination} userState={userState} path={path} />,

    }

    const onPlaceSelect = (details) => {
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        setDestination(position);
        centerScreen(location, position, mapRef, 150);
        setCenterMap(false);
        setState("none");
    }

    const setState = (state) => {
        setUserState(state);
        setAllUserStates([...allUserStates, state]);
    }

    const setDestinations = (destination) => {
        setDestination(destination);
        setAllDestinations([...allDestinations, destination]);
        setState("destinationsSet");
        if(path != null && path.length > 0) {
            setPath([...path, destination]);
            setState("pathSet");
        }
    }

    return (
        <View>
            <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} path={path} setDestination={setDestination} userState={userState} onPlaceSelect={onPlaceSelect}/>
            {components[userState]}
        </View>
    );
};

export default Main;