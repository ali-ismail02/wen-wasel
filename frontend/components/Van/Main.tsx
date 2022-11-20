import React, { useState, useEffect } from "react";
import { View, BackHandler,Appearance } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import CustomMap from "./CustomMap";
import Routes from "./Routes";
import { centerScreen } from "../../hooks/CameraChange";
import AddingDestination from "./AddingDestination";
import DelayingDestinations from "./DelayingDestinations";
import GetRecurringRoute from "../../hooks/van/GetRecurringRoutes";
import PresavedRoutesDropdown from "./PresavedRoutesDropdown";
import SortPath from "../../hooks/van/SortPath";
import { useSelector } from 'react-redux';
import styles from "../../styles/styles";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [recurringRoutes, setRecurringRoutes] = useState([]);
    const [allUserStates, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [allDestinations, setAllDestinations] = useState<[Object, string][]>([]);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const mapRef = React.useRef<MapView>(null);
    const user = useSelector((state: any) => state?.user);
    const id = user?.userProfile.id;
    const io = require("socket.io-client");
    const socket = io('http://192.168.1.50:5000');
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({bottomPopupContainer: null});
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    const broadcastLocation = () => {
        // repeat this every 2 seconds
        setTimeout(() => {
            console.log("broadcasting location");
            if(location) {
                socket.emit("location", {
                    type: "van",
                    id: id,
                    location: {latitude: location?.latitude, longitude: location?.longitude},
                });
            }
            broadcastLocation();
        }, 2000);
    }

    useEffect(() => {
        const getRecurringRoutes = async () => {
            const recurringRoutes = await GetRecurringRoute();
            if (recurringRoutes) {
                setRecurringRoutes(recurringRoutes);
            }
        }
        getRecurringRoutes();
        broadcastLocation();
    }, []);

    const backPressed = () => {
        setDestination(null);
        if (userState == "none") {
            BackHandler.exitApp();
            return true;
        } else if (userState == "addingRoute" || userState == "delayingRoute") {
            setDestination(null);
            if (allUserStates.length == 2) {
                setUserState("none");
                setAllUserStates(["none"]);
                return true;
            }
            setUserState(allUserStates[allUserStates.length - 2]);
            setAllUserStates(allUserStates.slice(0, allUserStates.length - 1));
            return true;
        } else {
            let flag = 1;
            for (let i = 0; i < allDestinations.length; i++) {
                if (allDestinations[i][0]['arrived'] == false) {
                    flag = 0;
                    break;
                }
            }
            if (flag == 1) {
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
        broadcastLocation();
        if(state == "destinationsSet") {
            setAllUserStates(["none", "destinationsSet"]);
            setUserState("destinationsSet");
            return
        }
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

    const components = (state) => {
        switch (state) {
            case "none": return <PresavedRoutesDropdown presaved_routes={recurringRoutes} setUserState={setUserState} setAllDestinations={updateAllDestinations} style={style} />
            case "destinationsSet": return <Routes destination={destination} setState={setState} destinations={allDestinations} setDestinations={updateAllDestinations} style={style} colorScheme={colorScheme} />
            case "addingRoute": return <AddingDestination setDestinations={setDestinations} setState={setState} destination={destination} style={style} colorScheme={colorScheme}  />
            case "delaying": return <DelayingDestinations destinations={allDestinations} setDestinations={updateAllDestinations} setState={setState} style={style} colorScheme={colorScheme}  />
        }
    }

    return (
        <View>
            <CustomMap allDestinations={allDestinations} location={location} setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} setDestination={setDestination} onPlaceSelect={onPlaceSelect} style={style} colorScheme={colorScheme} />
            {components(userState)}
        </View>
    );
};

export default Main;