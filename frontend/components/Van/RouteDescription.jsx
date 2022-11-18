import { TouchableOpacity, View, Image, Text, Appearance } from "react-native";
import styles from "../../styles/styles";
import GetRouteById from "../../hooks/van/GetRouteById";
import { useEffect, useState } from "react";
import { Google_API_Key } from "../../constants/GoogleAPIKey";
import SetTripArrived from "../../hooks/van/setTripArrived";

const RouteDescription = ({ destination, setDestinations, allDestionations, update }) => {
    const [route, setRoute] = useState(destination);
    const [destinationAddress, setDestinationAddress] = useState("");
    const [time, setTime] = useState("");
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, []);
    if (destination == null) {
        return null;
    }

    const getRoute = async () => {
        // add loop with 5 second delay to check if route is updated
        let route = await GetRouteById(destination[0].id);
        if (route) {
            setRoute(route);
        }
    }

    useEffect(() => {
        const getLocation = async () => {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${destination[0].latitude + "," + destination[0].longitude}&key=${Google_API_Key}`;
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setDestinationAddress(data.results[3].address_components[0].long_name);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
        // get hour and minute from destination.time
        const time = new Date(destination[1]);
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTime(timeString);
        getLocation();
        getRoute();
    }, [colorScheme]);

    const onPress = async () => {
        for (let i = 0; i < allDestionations.length; i++) {
            if (allDestionations[i][0].id === destination[0].id) {
                allDestionations[i][0].arrived = true;
                break;
            }
        }
        const response = await SetTripArrived(destination[0].id);
        console.log(response);
        if (response) {
            setDestinations(allDestionations);
            update();
        }
    }

    return (<>
        {destination[0].arrived == false ?
            <TouchableOpacity style={style.van.routeDescription} onPress={onPress}>
                {colorScheme == "dark" ? <Image style={{ width: 30, height: 30 }} source={require("../../assets/images/hourglass_dark.png")} /> :
                <Image style={{ width: 30, height: 30 }} source={require("../../assets/images/hourglass.png")} />}
                <View style={style.flex}>
                {colorScheme == "dark" ? <Image style={{ width: 20, height: 30 }} source={require("../../assets/images/standing_dark.png")} /> :
                <Image style={{ width: 20, height: 30 }} source={require("../../assets/images/standing.png")} />}
                    <Text style={style.van.routeDescriptionText}>{route.reservations}</Text>
                </View>
                <Text style={style.van.routeDescriptionAddress}>{destinationAddress}</Text>
                <Text style={style.van.routeDescriptionTime}>Scheduled at {time}</Text>
            </TouchableOpacity> :
            <View style={style.van.routeDescription}>
            {colorScheme == "dark" ? <Image style={{ width: 30, height: 30 }} source={require("../../assets/images/tick.png")} /> :
            <Image style={{ width: 30, height: 30 }} source={require("../../assets/images/black-tick.png")} />}
                <Text style={style.van.routeDescriptionAddress}>{destinationAddress}</Text>
                <Text style={style.van.routeDescriptionTime}>Scheduled at {time}</Text>
            </View>}
    </>
    );
}

export default RouteDescription;