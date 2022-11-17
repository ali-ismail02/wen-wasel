import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import INITIAL_POSITION from '../../constants/InitialPosition';
import { moveTo } from '../../hooks/CameraChange';
import styles from '../../styles/styles';
import Search from '../Search';
import PathDraw from './PathDraw';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, setLocation, setState, setDestination, onPlaceSelect, location, allDestinations }) => {

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
                setState('destinationsSet');
                setDestination(e.nativeEvent.coordinate)
            }}
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
            {allDestinations != undefined && PathDraw(allDestinations, location) }
        </MapView>
        <View style={styles.searchContainer}>
            <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
        </View>
    </>
    );
};

export default CustomMap;