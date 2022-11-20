import React, { useState } from "react";
import { Appearance, BackHandler, SafeAreaView, View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import { centerScreen } from '../../hooks/CameraChange';
import styles from "../../styles/styles";
import BaseState from "./BaseState";
import BookedOrNoBookingState from "./BookedOrNoBookingState";
import PathConfirmedState from "./PathConfirmedState";
import CompletedTripState from "./CompletedTripState";
import CustomMap from "./CustomMap";
import PathSelectedState from "./PathSelectedState";
import SearchedState from "./SearchedState";
import SubRide from "./SubRides";
import RideSelectedState from "./rideSelectedState";

const Main = () => {
    const [location, setLocation] = useState(undefined);
    const [all_user_states, setAllUserStates] = useState<string[]>(["none"]);
    const [destination, setDestination] = useState<LatLng | null>();
    const [user_state, setUserState] = useState<string>("none");
    const [slider_value, setSliderValue] = useState(1);
    const [center_map, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const [path, setPath] = useState(undefined);
    const [live_locations, setLiveLocations] = useState([]);
    const [search_result, setSearchResult] = useState(undefined);
    const mapRef = React.useRef<MapView>(null);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({ searchContainer: null, bottomPopupContainer: null, instructions: null });

    // add event listener for theme change
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        { }
    });

    // connecting the socket
    const io = require("socket.io-client");
    const socket = io.connect('http://192.168.1.50:5000');

    React.useEffect(() => {
        { colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light) }
        let flag = true;
        socket.on("locationBroadcast", (data: any) => {
            let temp = live_locations;
            temp.forEach((loc: any) => {
                if (loc.id == data.id) {
                    loc.location = data.location;
                    flag = false;
                }
            });
            if (flag) {
                temp.push(data);
            }
            setLiveLocations(temp);
        });
    }, [socket]);

    // handling back button press
    const backPressed = () => {
        if (all_user_states.length > 5) {
            return true;
        }
        if (user_state === "pathConfirmed") {
            centerScreen(location.coords, search_result, mapRef);
        }
        if (user_state == "searched") {
            setDestination(null);
            setCenterMap(true);
        }
        if (user_state == "pathSelected") {
            setPath(undefined);
        }
        if (user_state === "none") {
            BackHandler.exitApp();
        } else {
            setUserState(all_user_states[all_user_states.length - 2]);
            setAllUserStates(all_user_states.slice(0, all_user_states.length - 1));
        }
        return true;
    }

    // adding event listener for back button press
    const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backPressed
    );

    // handling path selection
    const onPathSelect = (path) => {
        setPath(path);
        setState("pathSelected");
    }

    // handling state change and updating all_user_states
    const setState = (state) => {
        if (state == "done") {
            setAllUserStates(["none"]);
            setUserState("done");
            setDestination(null);
            return
        }
        setAllUserStates([...all_user_states, state])
        setUserState(state);
    }

    // switch case for rendering different components based on user_state
    const components = (state) => {
        switch (state) {
            case "done":
                return <CompletedTripState setUserState={setUserState} style={style} />
            case "none":
                return <BaseState style={style} setState={setState} setSearchResult={setSearchResult} setDestination={setDestination} mapRef={mapRef} location={location} setCenterMap={setCenterMap} />
            case "searched":
                return <SearchedState setState={setState} setPaths={setPaths} style={style} slider_value={slider_value} setSliderValue={setSliderValue} colorScheme={colorScheme} location={location} destination={destination} />
            case "rideSelected":
                return <RideSelectedState routes={paths} onPress={onPathSelect} style={style} colorScheme={colorScheme} />
            case "pathSelected":
                return <PathSelectedState style={style} setState={setState} setCenterMap={setCenterMap} location={location} mapRef={mapRef} />
            case "pathConfirmed":
                return <PathConfirmedState path={path} setState={setState} style={style} colorScheme={colorScheme} />
            case "booked":
                return <BookedOrNoBookingState path={path} setPath={setPath} setState={setState} setCenterMap={setCenterMap} style={style} colorScheme={colorScheme} status={1} />
            case "failedBooking":
                return <BookedOrNoBookingState path={path} setPath={setPath} setState={setState} setCenterMap={setCenterMap} style={style} colorScheme={colorScheme} status={0} />
            case "noBooking":
                return <SubRide path={path} setPath={setPath} setState={setState} setCenter={setCenterMap} style={style} colorScheme={colorScheme} />
        }
    }

    return (
        <SafeAreaView>
            <View>
                <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} center_map={center_map} mapRef={mapRef} destination={destination} path={path} setDestination={setDestination} user_state={user_state} live_locations={live_locations} style={style} />
                {components(user_state)}
            </View>
        </SafeAreaView>
    );
};

export default Main; 