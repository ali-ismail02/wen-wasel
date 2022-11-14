import React, { useState } from "react";
import { View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "../van/CustomMap";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [searchResult, setSearchResult] = useState(undefined);
    const [destination, setDestination] = useState<LatLng | null>();
    const [allDestinations, setAllDestinations] = useState<LatLng[]>([]);
    const [path, setPath] = useState<LatLng[] | null>([]);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const mapRef = React.useRef<MapView>(null);

    const components = {
        none: <></>,
    }

    const setState = (state) => {
        setUserState(state);
        setAllUserStates([...allUserStates, state]);
    }

    const setDestinations = (destination) => {
        setDestination(destination);
        setAllDestinations([...allDestinations, destination]);
    }

    return (
        <View>
            <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} path={path} setDestinations={setDestinations} userState={userState} />
            {components[userState]}
        </View>
    );
};

export default Main;