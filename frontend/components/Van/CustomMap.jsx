import INITIAL_POSITION from '../../constants/InitialPosition';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../../styles/styles';
import { moveTo } from '../../hooks/CameraChange';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import Search from '../Search';
import { View } from 'react-native';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, path, setLocation, setState, setDestination, userState, onPlaceSelect }) => {

    return (<>
        <MapView
            apikey={Google_API_Key}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            onPanDrag={() => setCenterMap(false)}
            followsUserLocation={centerMap}
            showsMyLocationButton={false}
            onUserLocationChange={(coordinate) => {
                centerMap === true && moveTo(coordinate.nativeEvent.coordinate, mapRef);
                setLocation(coordinate.nativeEvent.coordinate);
            }}
            onPress={(e) => {
                setCenterMap(false);
                setState('initialDestination');
                setDestination(e.nativeEvent.coordinate)
            }}
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
        </MapView>
        <View style={styles.searchContainer}>
            <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
        </View>
    </>
    );
};

export default CustomMap;