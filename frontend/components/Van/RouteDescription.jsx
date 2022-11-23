import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwasone from "react-native-vector-icons/FontAwesome";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import { Google_API_Key } from "../../constants/GoogleAPIKey";
import GetRouteById from "../../hooks/van/GetRouteById";
import SetTripArrived from "../../hooks/van/setTripArrived";

const RouteDescription = ({ destination, setDestinations, allDestionations, update, style, colorScheme }) => {
    const [route, setRoute] = useState(destination);
    const [destination_address, setDestinationAddress] = useState("");
    const [time, setTime] = useState("");
    const [color, setColor] = useState("black");

    useEffect(() => {
        colorScheme == "dark" ? setColor("white") : setColor("black")
    }, [colorScheme])

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
        // get route location name from google api
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

    // set trip as arrived and update in destinations
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
                <View style={style.flexColumn}>
                    <Text style={style.van.routeDescriptionAddress}>{destination_address}</Text>
                    <Text style={style.van.routeDescriptionTime}>Scheduled at {time}</Text>
                </View>
                <View style={style.flex}>
                    <Material name="human-handsdown" size={30} color={color} />
                    <Text style={style.van.routeDescriptionText}>{route.reservations}</Text>
                    <FontAwasone name="hourglass-2" size={30} color={color} style={{ paddingLeft: 20 }} />
                </View>
            </TouchableOpacity> :
            <View style={style.van.routeDescription}>
            <View style={style.flexColumn}>
                <Text style={style.van.routeDescriptionAddress}>{destination_address}</Text>
                <Text style={style.van.routeDescriptionTime}>Scheduled at {time}</Text>
            </View>
                <Entypo name="check" size={30} color={color} />
            </View>
        }
    </>
    );
}

export default RouteDescription;