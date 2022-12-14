import { useEffect, useState } from "react";
import { Text, TouchableNativeFeedback, View } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GetFares from "../../hooks/passenger/GetFares";

const UserRouteOption = ({ route, onPress, style, colorScheme }) => {
    const [time, setTime] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [color, setColor] = useState("black");

    // calculating time for route
    useEffect(() => {
        {colorScheme == "dark" ? setColor("white") : setColor("black")}
        const getPrice = async () => {
            const price = await GetFares(route);
            setPrice(price);
        };
        getPrice();
        let time = route.time;
        // add minutes to current time
        let date = new Date();
        // add time to current time and set time to arrival time only withouth date
        date.setMinutes(date.getMinutes() + time);
        setTime(date.toLocaleTimeString());
    }, [colorScheme])
    // remove last 4 0s from price
    const formatPrice = (price) => {
        if(price == 0) {
            return "Free";
        }
        return "LBP " + price.toString().slice(0, -3) + "K";
    }

    return (
        <TouchableNativeFeedback style={style.routeOption} onPress={onPress}>
            <View style={[style.flex, style.RouteFormat]}>
                <View style={style.routeOptionInformation}>
                    <View style={style.routeOptionTrips}>
                        {route.map((trip, index) => {
                            if (trip.name != "end_location") {
                                if (trip.name.includes("service") && trip.name.includes("start")) {
                                    return (
                                        <View key={index} style={style.flex}>
                                            <Icon name="taxi" size={16} color={color} />
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                } else if (trip.name.includes("van") && trip.name.includes("start")) {
                                    return (
                                        <View key={index} style={style.flex}>
                                            <Icon name="shuttle-van" size={16} color={color} />
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View key={index} style={style.flex}>
                                            <Icon name="walking" size={16} color={color} />
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                }
                            } else {
                                return (
                                    <View key={index} style={[style.flex, {paddingTop: 4, marginLeft:-3}]}>
                                        <Feather name="map-pin" size={16} color={color} />
                                    </View>
                                )
                            }
                        }
                        )}
                    </View>
                    <Text style={style.routeOptionArriveTime}>Arrive at {time}</Text>
                </View>
                <Text style={style.routeOptionPrice}>{formatPrice(price)}</Text>
            </View>
        </TouchableNativeFeedback>
    );
}

export default UserRouteOption;