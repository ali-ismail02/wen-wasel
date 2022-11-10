import INITIAL_POSITION from '../constants/InitialPosition';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../styles/styles';
import {moveTo} from '../hooks/CameraChange';
import PathDraw from './PathDraw';
import { Google_API_Key } from '../constants/GoogleAPIKey';

const CustomMap = ({setCenterMap, centerMap, mapRef, destination, path}) => {
    return (

        <MapView
            apikey={Google_API_Key}
            showsUserLocation={true}
            onPanDrag={() => setCenterMap(false)}
            followsUserLocation={centerMap}
            showsMyLocationButton={false}
            userLocationUpdateInterval={1000}
            onUserLocationChange={(coordinate) => {
                centerMap === true && moveTo(coordinate.nativeEvent.coordinate, mapRef);
            }}
            ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
            {path != undefined && PathDraw(path)}
        </MapView>
    );
};

export default CustomMap;