import { View, Appearance } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import INITIAL_POSITION from '../../constants/InitialPosition';
import { moveTo } from '../../hooks/CameraChange';
import styles from '../../styles/styles';
import Search from '../Search';
import PathDraw from './PathDraw';
import {useEffect, useState} from 'react';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, setLocation, setState, setDestination, onPlaceSelect, location, allDestinations }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

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
            style={style.map}
            initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
            {allDestinations != undefined && PathDraw(allDestinations, location) }
        </MapView>
        <View style={style.searchContainer}>
            <Search onPlaceSelect={(details) => onPlaceSelect(details)} />
        </View>
    </>
    );
};

export default CustomMap;