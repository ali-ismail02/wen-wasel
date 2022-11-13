import React, { useState } from "react";
import { BackHandler, SafeAreaView, Text, View } from "react-native";
import MapView, { LatLng } from 'react-native-maps';
import { centerScreen, moveTo } from '../hooks/CameraChange';
import getRoutes from "../hooks/GetRoutes";
import styles from "../styles/styles";
import Booked from "./Booked";
import BookSeats from "./BookSeats";
import Button from "./Button";
import CenterMapButton from "./CenterMapButton";
import CustomSlider from './CustomSlider';
import Search from "./Search";
import SubRide from "./SubRides";
import UserRouteOptions from "./UserRouteOptions";
import CustomMap from "./CustomMap";

const Map = () => {
    const [location, setLocation] = useState(undefined);
    const [allUserStates, setAllUserStates] = useState<string[]>(["none"]);
    const [destination, setDestination] = useState<LatLng | null>();
    const [userState, setUserState] = useState<string>("none");
    const [sliderValue, setSliderValue] = useState(1);
    const [centerMap, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const [path, setPath] = useState(undefined);
    const [searchResult, setSearchResult] = useState(undefined);
    const mapRef = React.useRef<MapView>(null);

    const backPressed = () => {
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
        setAllUserStates([...allUserStates, state])
        setUserState(state);
    }

    const comps = {
        none: <><View style={styles.searchContainer}>
                    <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                </View>
                    <CenterMapButton setCenterMap={setCenterMap}
                        moveTo={moveTo}
                        mapRef={mapRef}
                        location={location} /></>,

        searched: <View style={styles.bottomPopupContainer}>
                        <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
                        <Button text="Next" onPress={() => rideSelect()} width={"100%"} color={"#FF9E0D"} />
                    </View>,

        rideSelected: <UserRouteOptions routes={paths} onPress={onPathSelect} />,

        pathSelected: <View style={styles.bottomPopupContainer}>
                        <Text style = {styles.instructions}>Confirm your route?</Text>
                        <Button text="Confirm Route" onPress={onPathConfirm} width={"100%"} color={"#FF9E0D"} />
                    </View>,

        pathConfirmed: <BookSeats path={path} setState = {setState}/>,

        booked:<>
                <SubRide path={path} setPath = {setPath} />
                <Booked status = {1}/>
            </>,
        faliedBooking:<>
                <SubRide path={path} setPath = {setPath} />
                <Booked status = {0}/>
            </>,
        noBooking: <SubRide path={path} setPath = {setPath} />
    }

    return (
        <SafeAreaView>
            <View>
                <CustomMap setState = {setState} setLocation={setLocation} setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} path={path} setDestination ={setDestination} userState = {userState}/>
                {comps[userState]}
            </View>
        </SafeAreaView>
    );
};

export default Map; 