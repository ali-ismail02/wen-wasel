import react from 'react';
import MapViewDirections from 'react-native-maps-directions';
import {Google_API_Key} from '../../constants/GoogleAPIKey';

const PathDraw = (path) => {
    return (
        path.map((trip, index) => {
            if (trip.name != "end_location") {
                if (trip.name.includes("service") && trip.name.includes("start") || trip.name.includes("van") && trip.name.includes("start")) {
                    return (
                        <MapViewDirections
                            key={index}
                            origin={trip.location}
                            destination={path[index + 1].location}
                            apikey={Google_API_Key}
                            strokeWidth={6}
                            strokeColor="#FF9E0D"
                            mode='DRIVING'
                        />
                    );
                }
                return (
                    <MapViewDirections
                        key={index}
                        origin={trip.location}
                        destination={path[index + 1].location}
                        apikey={Google_API_Key}
                        strokeWidth={6}
                        strokeColor="#FF9E0D"
                        mode='WALKING'
                        lineDashPattern={[2,2]}
                    />
                );
            }
        })
    )
}

export default PathDraw;
