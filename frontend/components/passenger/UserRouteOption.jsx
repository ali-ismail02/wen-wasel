import { useEffect, useState } from "react";
import { Image, Text, TouchableNativeFeedback, View, Appearance } from "react-native";
import styles from "../../styles/styles";
import GetFares from "../../hooks/passenger/GetFares";

const UserRouteOption = ({ route, onPress }) => {
    const [time, setTime] = useState(undefined);
    const [price, setPrice] = useState(0);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);

    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);

    });

    // calculating time for route
    useEffect(() => {
        { colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light) }
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
    }, [])
    // format price with commas
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                                            {colorScheme == 'dark' ? <Image source={require(`../../assets/images/car_dark.png`)} style={{ width: 20, height: 20 }} /> :
                                                <Image source={require(`../../assets/images/car.png`)} style={{ width: 20, height: 20 }} />}
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                } else if (trip.name.includes("van") && trip.name.includes("start")) {
                                    return (
                                        <View key={index} style={style.flex}>
                                        {colorScheme == 'dark' ? <Image source={require(`../../assets/images/van_dark.png`)} style={{ width: 20, height: 20 }} /> :
                                            <Image source={require(`../../assets/images/van.png`)} style={{ width: 20, height: 20 }} />}
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View key={index} style={style.flex}>
                                        {colorScheme == 'dark' ? <Image source={require(`../../assets/images/walking_dark.png`)} style={{ width: 10, height: 20 }} /> :
                                            <Image source={require(`../../assets/images/walking.png`)} style={{ width: 20, height: 20 }} />}
                                            <Text style={style.routeOptionTripText}>{trip.cost}</Text>
                                        </View>
                                    );
                                }
                            } else {
                                return (
                                    <View key={index} style={style.flex}>
                                    {colorScheme == 'dark' ? <Image source={require(`../../assets/images/waypoint_dark.png`)} style={{ width: 20, height: 20 }} /> :
                                        <Image source={require(`../../assets/images/waypoint.png`)} style={{ width: 20, height: 20 }} />}
                                    </View>
                                )
                            }
                        }
                        )}
                    </View>
                    <Text style={style.routeOptionArriveTime}>Arrive at {time}</Text>
                </View>
                <Text style={style.routeOptionPrice}>LBP {formatPrice(price)}</Text>
            </View>
        </TouchableNativeFeedback>
    );
}

export default UserRouteOption;