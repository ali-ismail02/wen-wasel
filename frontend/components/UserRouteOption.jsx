import { useEffect, useState } from "react";
import { Image, Text, TouchableHighlight, TouchableNativeFeedback, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "../styles/styles";

const UserRouteOption = ({ route, onPress }) => {
    const [time, setTime] = useState(undefined);
    // calculating time for route
    useEffect(() => {
        let time = route.time;
        // add minutes to current time
        let date = new Date();
        // add time to current time and set time to arrival time only withouth date
        date.setMinutes(date.getMinutes() + time);
        setTime(date.toLocaleTimeString());

    }, [])

    return (
        <TouchableNativeFeedback style={styles.routeOption} onPress={onPress}>
            <View style={styles.routeOptionInformation}>
                <View style={styles.routeOptionTrips}>
                    {route.map((trip, index) => {
                        if (trip.name != "end_location") {
                            if (trip.name.includes("service") && trip.name.includes("start")) {
                                return (
                                    <View key={index} style={styles.flex}>
                                        <Image source={require("../assets/images/car.png")} style={{ width: 20, height: 20 }} />
                                        <Text style={styles.routeOptionTripText}>{trip.cost}</Text>
                                    </View>
                                );
                            } else if (trip.name.includes("van") && trip.name.includes("start")) {
                                return (
                                    <View key={index} style={styles.flex}>
                                        <Image source={require("../assets/images/van.png")} style={{ width: 20, height: 20 }} />
                                        <Text style={styles.routeOptionTripText}>{trip.cost}</Text>
                                    </View>
                                );
                            } else {
                                return (
                                    <View key={index} style={styles.flex}>
                                        <Image source={require("../assets/images/walking.png")} style={{ width: 10, height: 20 }} />
                                        <Text style={styles.routeOptionTripText}>{trip.cost}</Text>
                                    </View>
                                );
                            }
                        }else {
                            return (
                                <View key={index} style={styles.flex}>
                                        <Image source={require("../assets/images/waypoint.png")} style={{ width: 20, height: 20 }} />
                                    </View>
                            )
                        } 
                    }
                    )}
                </View>
                <Text style={styles.routeOptionArriveTime}>Arrive at {time}</Text>
            </View>
        </TouchableNativeFeedback>
    );
}

export default UserRouteOption;