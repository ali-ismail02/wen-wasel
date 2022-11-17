import INITIAL_POSITION from '../../constants/InitialPosition';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../../styles/styles';
import { moveTo } from '../../hooks/CameraChange';
import PathDraw from './PathDraw';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import { Image } from 'react-native';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, path, setLocation, setState, setDestination, userState, liveLocations }) => {
    return (
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
                if (userState != "searched") setState("searched")
                setDestination(e.nativeEvent.coordinate)
            }}
            ref={mapRef}
            style={styles.map}
            initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
            {liveLocations.length > 0 && liveLocations.map((location, index) => {
                console.log(location)
                return <Marker coordinate={location.location}
                    key={index}
                    image={require('../../assets/images/van-icon.png')}
                    
                />
            }
            )}
            {path != undefined && PathDraw(path)}
        </MapView>
    );
};

export default CustomMap;