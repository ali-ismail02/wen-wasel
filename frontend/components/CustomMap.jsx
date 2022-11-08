import INITIAL_POSITION from '../constants/InitialPosition';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../styles/styles';
import {moveTo} from '../hooks/CameraChange';

const CustomMap = ({setCenterMap, centerMap, mapRef, destination}) => {
    return (

        <MapView
            showsUserLocation={true}
            onPanDrag={() => setCenterMap(false)}
            followsUserLocation={centerMap}
            showsMyLocationButton={false}
            userLocationUpdateInterval={1000}
            onUserLocationChange={(coordinate) => {
                centerMap === true && moveTo(coordinate.nativeEvent.coordinate, mapRef);
            }}
            ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
            {destination && <Marker coordinate={destination} />}
        </MapView>
    );
};

export default CustomMap;