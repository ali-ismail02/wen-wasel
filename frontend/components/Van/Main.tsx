import React, { useState, useEffect } from "react";
import { View, BackHandler } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "./CustomMap";
import Routes from "./Routes";
import { centerScreen } from "../../hooks/CameraChange";
import AddingDestination from "./AddingDestination";
import DelayingDestinations from "./DelayingDestinations";
import GetRecurringRoute from "../../hooks/van/GetRecurringRoutes";
import PresavedRoutesDropdown from "./PresavedRoutesDropdown";
import SortPath from "../../hooks/van/SortPath";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [recurringRoutes, setRecurringRoutes] = useState([]);
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [allDestinations, setAllDestinations] = useState<[Object, string][]>([]);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const mapRef = React.useRef<MapView>(null);

    useEffect(() => {
        const getRecurringRoutes = async () => {
            const recurringRoutes = await GetRecurringRoute();
            if(recurringRoutes) {
                setRecurringRoutes(recurringRoutes);
            }
        }
        getRecurringRoutes();
    }, []);

    const backPressed = () => {
        if(userState == "none") {
            BackHandler.exitApp();
            return true;
        } else if(userState == "addingRoute" || userState == "delayingRoute") {
            if(allUserStates.length == 2) {
                setUserState("none");
                setAllUserStates(["none"]);
                return true;
            }
            setUserState(allUserStates[allUserStates.length - 2]);
            setAllUserStates(allUserStates.slice(0, allUserStates.length - 1));
            return true;
        }else {
            let flag = 1;
            for(let i = 0; i < allDestinations.length; i++) {
                if(allDestinations[i][0]['arrived'] == false) {
                    flag = 0;
                    break;
                }
            }
            if(flag == 1) {
                setUserState("none");
                setAllUserStates(["none"]);
                setAllDestinations([]);
                return true;
            }
            return true;
        }
    }
    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressed
    );

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
        setAllDestinations(SortPath([...allDestinations, [destination, time]]));
        setState("destinationsSet");
    }

    const updateAllDestinations = (destinations) => {
        setAllDestinations(destinations);
    }

    const components = {
        none:<PresavedRoutesDropdown presaved_routes={recurringRoutes} setUserState={setUserState} setAllDestinations={updateAllDestinations} />,
        destinationsSet: <Routes destination={destination} setState={setState} destinations= {allDestinations} setDestinations={updateAllDestinations}/>,
        addingRoute: <AddingDestination setDestinations={setDestinations} setState={setState} destination={destination}/>,
        delaying: <DelayingDestinations destinations={allDestinations} setDestinations={updateAllDestinations} setState={setState}/>,
    }

    return (
        <View>
            <CustomMap allDestinations={allDestinations} location={location}  setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} setDestination={setDestination} onPlaceSelect={onPlaceSelect}/>
            {components[userState]}
        </View>
    );
};

export default Main;