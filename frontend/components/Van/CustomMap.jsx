import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import INITIAL_POSITION from '../../constants/InitialPosition';
import { moveTo } from '../../hooks/CameraChange';
import Search from '../Search';
import PathDraw from './PathDraw';
import MapStyles from '../../styles/MapStyles';
import { useEffect, useState } from 'react';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, setLocation, setState, setDestination, onPlaceSelect, location, all_destinations, style, colorScheme }) => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        colorScheme === 'dark' ? setMap(MapStyles.dark) : setMap(MapStyles.light);
    }, [colorScheme]);

    return (<>
        <MapView
            customMapStyle={map}
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
            style={style.map}
            initialRegion={INITIAL_POSITION}>
            {/* if the driver sets a destination a marker is shown on the map */}
            {destination != null && <Marker coordinate={destination} />}
            {/* if the driver has set destinations, a path is drawn between them */}
            {all_destinations != undefined && PathDraw(all_destinations, location)}
        </MapView>
        <View style={style.searchContainer}>
            <Search onPlaceSelect={(details) => onPlaceSelect(details)} style={style} colorScheme={colorScheme} />
        </View>
    </>
    );
};

export default CustomMap;