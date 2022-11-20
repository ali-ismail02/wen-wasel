import React, { useState } from "react";
import { BackHandler, SafeAreaView, Text, View, Appearance } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import { centerScreen, moveTo } from '../../hooks/CameraChange';
import getRoutes from "../../hooks/passenger/GetRoutes";
import styles from "../../styles/styles";
import Button from "../Button";
import CenterMapButton from "../CenterMapButton";
import CustomSlider from '../CustomSlider';
import Search from "../Search";
import Booked from "./Booked";
import BookSeats from "./BookSeats";
import CustomMap from "./CustomMap";
import SubRide from "./SubRides";
import UserRouteOptions from "./UserRouteOptions";
import CompletedTrip from "./CompletedTrip";

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
    const [style, setStyle] = useState<any>({searchContainer: null,bottomPopupContainer: null, instructions: null});
    
    // add event listener for theme change
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    // connecting the socket
    const io = require("socket.io-client");
    const socket = io.connect('http://192.168.1.50:5000');

    React.useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
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

    // handling place selection from search or map
    const onPlaceSelect = (details) => {
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        setSearchResult(position)
        setDestination(position);
        centerScreen(location, position, mapRef);
        setCenterMap(false);
        setState("searched");
    }

    // handling ride type selection
    const rideSelect = async () => {
        setPaths(await getRoutes(location.latitude + "," + location.longitude, destination.latitude + "," + destination.longitude, slider_value[0]));
        setState("rideSelected");
    }

    // handling path selection
    const onPathSelect = (path) => {
        setPath(path);
        setState("pathSelected");
    }

    // handling path confirmation
    const onPathConfirm = () => {
        setState("pathConfirmed");
        setCenterMap(true);
        moveTo(location.coords, mapRef, 18);
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
    const comps = (state) => {
        switch (state) {
            case "done": return <CompletedTrip setUserState={setUserState} style={style} />
            case "none": return <>
                                    <View style={style.searchContainer}>
                                        <Search onPlaceSelect={(details) => onPlaceSelect(details)} style={style}/>
                                    </View>
                                    <CenterMapButton setCenterMap={setCenterMap}
                                        moveTo={moveTo}
                                        mapRef={mapRef}
                                        location={location} 
                                        style={style}/>
                                </>
            case "searched": return <View style={style.bottomPopupContainer}>
                                        <CustomSlider slider_value={slider_value} setSliderValue={setSliderValue} style={style} colorScheme={colorScheme} />
                                        <Button text="Next" onPress={() => rideSelect()} width={"100%"} color={"#FF9E0D"}  style={style} />
                                    </View>
            case "rideSelected": return <UserRouteOptions routes={paths} onPress={onPathSelect} style={style} colorScheme={colorScheme} />
            case "pathSelected": return <View style={style.bottomPopupContainer}>
                                            <Text style={style.instructions}>Confirm your route?</Text>
                                            <Button text="Confirm Route" onPress={onPathConfirm} width={"100%"} color={"#FF9E0D"}  style={style} />
                                        </View>
            case "pathConfirmed": return <BookSeats path={path} setState={setState} style={style}/>
            case "booked": return <>
                                    <SubRide path={path} setPath={setPath} setState={setState} setCenter={setCenterMap}  style={style} colorScheme={colorScheme} />
                                    <Booked status={1}  style={style}/>
                                  </>
            case "failedBooking": return <>
                                            <SubRide path={path} setPath={setPath} setState={setState}  setCenter={setCenterMap} style={style} colorScheme={colorScheme} />
                                            <Booked status={0}  style={style}/>
                                        </>
            case "noBooking": return <SubRide path={path} setPath={setPath} setState={setState}  setCenter={setCenterMap} style={style} colorScheme={colorScheme} />
            }
        }

        return (
            <SafeAreaView>
                <View>
                    <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} center_map={center_map} mapRef={mapRef} destination={destination} path={path} setDestination={setDestination} user_state={user_state} live_locations={live_locations}  style={style} colorScheme={colorScheme} />
                    {comps(user_state)}
                </View>
            </SafeAreaView>
        );
    };

    export default Main; 