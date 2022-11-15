import { Marker } from "react-native-maps";
import { Google_API_Key } from "../../constants/GoogleAPIKey";
import MapViewDirections from "react-native-maps-directions";

const PathDraw = (path, location) => {
    return (
        path.map((trip, index) => {
            const dest = {latitude: parseFloat(trip[0].latitude), longitude: parseFloat(trip[0].longitude)}
            if(index == 0) {
                return (<>
                    <MapViewDirections
                        key={index}
                        origin={location}
                        destination={dest}
                        apikey={Google_API_Key}
                        strokeWidth={6}
                        strokeColor="#FF9E0D"
                        mode='DRIVING'
                    />
                    <Marker coordinate={dest} pinColor={"#FF9E0D"}/>
                    </>
                );
            }
            const origin = {latitude: path[index-1][0].latitude, longitude: path[index-1][0].longitude}
            return (<>
                <MapViewDirections
                    key={index}
                    origin={origin}
                    destination={dest}
                    apikey={Google_API_Key}
                    strokeWidth={6}
                    strokeColor="#FF9E0D"
                    mode='DRIVING'
                />
                <Marker coordinate={dest} pinColor={"#FF9E0D"}/>
                </>
            );
        }
        )
    )
}

export default PathDraw;
