import INITIAL_POSITION from '../../constants/InitialPosition';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styles from '../../styles/styles';
import { moveTo } from '../../hooks/CameraChange';
import PathDraw from './PathDraw';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import { Image } from 'react-native';
import { Appearance} from 'react-native';
import React, { useState, useEffect } from 'react';

const CustomMap = ({ setCenterMap, centerMap, mapRef, destination, path, setLocation, setState, setDestination, userState, liveLocations }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

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
            style={style.map}
            initialRegion={INITIAL_POSITION}>
            {destination != null && <Marker coordinate={destination} />}
            {liveLocations.length > 0 && userState != undefined && liveLocations.map((location, index) => {
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