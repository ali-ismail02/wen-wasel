import React, { useEffect, useState } from "react";
import { Appearance, BackHandler, View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { centerScreen } from "../../hooks/CameraChange";
import GetRecurringRoute from "../../hooks/van/GetRecurringRoutes";
import SortPath from "../../hooks/van/SortPath";
import styles from "../../styles/styles";
import AddingDestination from "./AddingDestination";
import CustomMap from "./CustomMap";
import DelayingDestinations from "./DelayingDestinations";
import PresavedRoutesDropdown from "./PresavedRoutesDropdown";
import Routes from "./Routes";

const Main = () => {
    const [user_state, setUserState] = useState("none");
    const [recurring_routes, setRecurringRoutes] = useState([]);
    const [all_user_states, setAllUserStates] = useState(["none"]);
    const [destination, setDestination] = useState<LatLng | null>(null);
    const [all_destinations, setAllDestinations] = useState<[Object, string][]>([]);
    const [location, setLocation] = useState(undefined);
    const [centerMap, setCenterMap] = useState(true);
    const mapRef = React.useRef<MapView>(null);
    const user = useSelector((state: any) => state?.user);
    const id = user?.userProfile.id;
    const io = require("socket.io-client");
    const socket = io('http://192.168.1.50:5000');
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({ bottomPopupContainer: null, van: {presavedRouteView:null }});

    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        { }
    });

    const broadcastLocation = () => {
        // repeat this every 2 seconds
        setTimeout(() => {
            if (location) {
                socket.emit("location", {
                    type: "van",
                    id: id,
                    location: { latitude: location?.latitude, longitude: location?.longitude },
                });
            }
            broadcastLocation();
        }, 2000);
    }

    useEffect(() => {
        colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)
        // get recurring routes from database
        const getRecurringRoutes = async () => {
            const recurring_routes = await GetRecurringRoute();
            if (recurring_routes) {
                setRecurringRoutes(recurring_routes);
            }
        }
        getRecurringRoutes();
        // call repeating function to broadcast location
        broadcastLocation();
    }, [colorScheme]);

    // handle back button
    const backPressed = () => {
        setDestination(null);
        if (user_state == "none") {
            BackHandler.exitApp();
            return true;
        } else if (user_state == "addingRoute" || user_state == "delayingRoute") {
            setDestination(null);
            if (all_user_states.length == 2) {
                setUserState("none");
                setAllUserStates(["none"]);
                return true;
            }
            setUserState(all_user_states[all_user_states.length - 2]);
            setAllUserStates(all_user_states.slice(0, all_user_states.length - 1));
            return true;
        } else {
            let flag = 1;
            for (let i = 0; i < all_destinations.length; i++) {
                if (all_destinations[i][0]['arrived'] == false) {
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

    // handle adding destination using search bar
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

    // update user state and all user states
    const setState = (state) => {
        broadcastLocation();
        if (state == "destinationsSet") {
            setAllUserStates(["none", "destinationsSet"]);
            setUserState("destinationsSet");
            return
        }
        setUserState(state);
        setAllUserStates([...all_user_states, state]);
    }

    // handle adding destination
    const setDestinations = (destination, time) => {
        setDestination(null);
        setAllDestinations([...all_destinations, [destination, time]]);
        setAllDestinations(SortPath([...all_destinations, [destination, time]]));
        setState("destinationsSet");
    }

    // handle delaying destination
    const updateAllDestinations = (destinations) => {
        setAllDestinations(destinations);
    }

    // case switch for user state to render different components
    const components = (state) => {
        switch (state) {
            case "none":
                return <PresavedRoutesDropdown presaved_routes={recurring_routes} setUserState={setUserState} setAllDestinations={updateAllDestinations} style={style} />
            case "destinationsSet":
                return <Routes destination={destination} setState={setState} destinations={all_destinations} setDestinations={updateAllDestinations} style={style} colorScheme={colorScheme} />
            case "addingRoute":
                return <AddingDestination setDestinations={setDestinations} setState={setState} destination={destination} style={style} colorScheme={colorScheme} />
            case "delaying":
                return <DelayingDestinations destinations={all_destinations} setDestinations={updateAllDestinations} setState={setState} style={style} colorScheme={colorScheme} />
        }
    }

    return (
        <View>
            <CustomMap all_destinations={all_destinations} location={location} setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} setDestination={setDestination} onPlaceSelect={onPlaceSelect} style={style} colorScheme={colorScheme} />
            {components(user_state)}
        </View>
    );
};

export default Main;