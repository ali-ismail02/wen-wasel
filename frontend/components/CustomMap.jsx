
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../styles/styles';

const CustomMap = ({setCenterMap, centerMap, mapRef, destination, moveTo, INITIAL_POSITION}) => {
    return (

        <MapView
            showsUserLocation={true}
            onPanDrag={() => setCenterMap(false)}
            followsUserLocation={centerMap}
            showsMyLocationButton={false}
            userLocationUpdateInterval={1000}
            onUserLocationChange={(coordinate) => {
                centerMap === true && moveTo(coordinate.nativeEvent.coordinate);
            }}
            ref={mapRef} style={styles.map} provider={PROVIDER_GOOGLE} initialRegion={INITIAL_POSITION}>
            {destination && <Marker coordinate={destination} />}
        </MapView>
    );
};

export default CustomMap;