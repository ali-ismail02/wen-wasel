import { Marker } from "react-native-maps";
import { Google_API_Key } from "../../constants/GoogleAPIKey";
import MapViewDirections from "react-native-maps-directions";
import { View } from "react-native";

const PathDraw = (path, location) => {
    return (
        // loop through all the destinations and draw a path between them
        path.map((trip, index) => {
            const dest = { latitude: parseFloat(trip[0].latitude), longitude: parseFloat(trip[0].longitude) }
            if (trip[0].arrived === false) {
                // check if it's the first destination and draw a path from the driver's location to it
                if (index == 0) {
                    const origin = { latitude: parseFloat(location.latitude), longitude: parseFloat(location.longitude) }
                    return (
                        <View key={index}>
                            <MapViewDirections
                                origin={origin}
                                destination={dest}
                                apikey={Google_API_Key}
                                strokeWidth={6}
                                strokeColor="#FF9E0D"
                                mode='DRIVING'
                            />
                            <Marker coordinate={dest} pinColor={"#FF9E0D"} />
                        </View>
                    );
                }
                const origin = { latitude: parseFloat(path[index - 1][0].latitude), longitude: parseFloat(path[index - 1][0].longitude) }
                // else draw a path from the previous destination to the current one
                return (
                    <View key={index}>
                        <MapViewDirections
                            origin={origin}
                            destination={dest}
                            apikey={Google_API_Key}
                            strokeWidth={6}
                            strokeColor="#FF9E0D"
                            mode='DRIVING'
                        />
                        <Marker coordinate={dest} pinColor={"#FF9E0D"} />
                    </View>
                );
            }
        }
        )
    )
}

export default PathDraw;
