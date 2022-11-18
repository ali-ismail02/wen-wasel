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
    const [allUserStates, setAllUserStates] = useState<string[]>(["none"]);
    const [destination, setDestination] = useState<LatLng | null>();
    const [userState, setUserState] = useState<string>("none");
    const [sliderValue, setSliderValue] = useState(1);
    const [centerMap, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const [path, setPath] = useState(undefined);
    const [liveLocations, setLiveLocations] = useState([]);
    const [searchResult, setSearchResult] = useState(undefined);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({searchContainer: null,bottomPopupContainer: null, instructions: null});
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    const mapRef = React.useRef<MapView>(null);
    const io = require("socket.io-client");
    const socket = io.connect('http://192.168.1.50:5000');

    React.useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
        let flag = true;
        socket.on("locationBroadcast", (data: any) => {
            let temp = liveLocations;
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

    const backPressed = () => {
        if (allUserStates.length > 5) {
            return true;
        }
        if (userState === "pathConfirmed") {
            centerScreen(location.coords, searchResult, mapRef);
        }
        if (userState == "searched") {
            setDestination(null);
            setCenterMap(true);
        }
        if (userState == "pathSelected") {
            setPath(undefined);
        }
        if (userState === "none") {
            BackHandler.exitApp();
        } else {
            setUserState(allUserStates[allUserStates.length - 2]);
            setAllUserStates(allUserStates.slice(0, allUserStates.length - 1));
        }
        return true;
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
        setSearchResult(position)
        setDestination(position);
        centerScreen(location, position, mapRef);
        setCenterMap(false);
        setState("searched");
    }

    const rideSelect = async () => {
        setPaths(await getRoutes(location.latitude + "," + location.longitude, destination.latitude + "," + destination.longitude, sliderValue[0]));
        setState("rideSelected");
    }

    const onPathSelect = (path) => {
        setPath(path);
        setState("pathSelected");
    }

    const onPathConfirm = () => {
        setState("pathConfirmed");
        setCenterMap(true);
        moveTo(location.coords, mapRef, 18);
    }

    const setState = (state) => {
        if (state == "done") {
            setAllUserStates(["none"]);
            setUserState("done");
            setDestination(null);
            return
        }
        setAllUserStates([...allUserStates, state])
        setUserState(state);
    }

    const comps = (state) => {
        switch (state) {
            case "done": return <CompletedTrip setUserState={setUserState} />
            case "none": return <>
                                    <View style={style.searchContainer}>
                                        <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                                    </View>
                                    <CenterMapButton setCenterMap={setCenterMap}
                                        moveTo={moveTo}
                                        mapRef={mapRef}
                                        location={location} />
                                </>
            case "searched": return <View style={style.bottomPopupContainer}>
                                        <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
                                        <Button text="Next" onPress={() => rideSelect()} width={"100%"} color={"#FF9E0D"} />
                                    </View>
            case "rideSelected": return <UserRouteOptions routes={paths} onPress={onPathSelect} />
            case "pathSelected": return <View style={style.bottomPopupContainer}>
                                            <Text style={style.instructions}>Confirm your route?</Text>
                                            <Button text="Confirm Route" onPress={onPathConfirm} width={"100%"} color={"#FF9E0D"} />
                                        </View>
            case "pathConfirmed": return <BookSeats path={path} setState={setState} setPath={setPath} />
            case "booked": return <>
                                    <SubRide path={path} setPath={setPath} setState={setState} setCenter={setCenterMap} />
                                    <Booked status={1} />
                                  </>
            case "failedBooking": return <>
                                            <SubRide path={path} setPath={setPath} setState={setState}  setCenter={setCenterMap}/>
                                            <Booked status={0} />
                                        </>
            case "noBooking": return <SubRide path={path} setPath={setPath} setState={setState}  setCenter={setCenterMap}/>
            }
        }

        return (
            <SafeAreaView>
                <View>
                    <CustomMap setState={setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} path={path} setDestination={setDestination} userState={userState} liveLocations={liveLocations} />
                    {comps(userState)}
                </View>
            </SafeAreaView>
        );
    };

    export default Main; 