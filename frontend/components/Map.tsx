import { BackHandler, SafeAreaView, View } from "react-native";
import { centerScreen, moveTo } from '../hooks/CameraChange';
import MapView, { LatLng } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import UserRouteOptions from "./UserRouteOptions";
import CenterMapButton from "./CenterMapButton";
import getRoutes from "../hooks/GetRoutes";
import * as Location from 'expo-location';
import CustomSlider from './CustomSlider';
import styles from "../styles/styles";
import CustomMap from './CustomMap';
import Search from "./Search";
import Button from "./Button";

const Map = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>();
    const [allUserStates, setAllUserStates] = useState<string[]>(["none"]);
    const [destination, setDestination] = useState<LatLng | null>();
    const [userState, setUserState] = useState<string>("none");
    const [sliderValue, setSliderValue] = useState(1);
    const [centerMap, setCenterMap] = useState(true);
    const [paths, setPaths] = useState(undefined);
    const [path, setPath] = useState(undefined);
    const mapRef = React.useRef<MapView>(null);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }
        getLocation();
    }, []);

    const backPressed = () => {
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
        const set = setDestination;
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        set(position);
        centerScreen(location.coords, position, mapRef);
        setCenterMap(false);
        setAllUserStates([...allUserStates, "searched"]);
        setUserState("searched");
    }

    const rideSelect = async () => {
        setPaths(await getRoutes(location.coords.latitude + "," + location.coords.longitude, destination.latitude + "," + destination.longitude, sliderValue))
        setAllUserStates([...allUserStates, "rideSelected"]);
        setUserState("rideSelected");
    }

    const onPathSelect = (path) => {
        setPath(path);
        setAllUserStates([...allUserStates, "pathSelected"]);
        setUserState("pathSelected");
    }

    return (
        <SafeAreaView>
            <View>
                <CustomMap setCenterMap={setCenterMap} centerMap={centerMap} mapRef={mapRef} destination={destination} path={path} />
                {userState == "none" &&
                    <View style={styles.searchContainer}>
                        <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
                    </View>
                }
                {userState == "none" &&
                    <CenterMapButton setCenterMap={setCenterMap}
                        moveTo={moveTo}
                        mapRef={mapRef}
                        location={location} />
                }
                {allUserStates.includes("searched") == true &&
                    <View style={styles.bottomPopupContainer}>
                        {userState == "searched" &&
                            <CustomSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
                        }
                        {userState == "searched" &&
                            <Button text="Next" onPress={() => rideSelect()} width={"100%"} color={"#FF9E0D"} />
                        }
                    </View>
                }
                {userState == "rideSelected" &&
                    <UserRouteOptions routes={paths} onPress={onPathSelect} />
                }
                {userState == "pathSelected" &&
                    <View style={styles.bottomPopupContainer}>
                        <Button text="Confirm Route" onPress={() => { }} width={"100%"} color={"#FF9E0D"} />
                    </View>
                }
            </View>
        </SafeAreaView>
    );
};

export default Map; 