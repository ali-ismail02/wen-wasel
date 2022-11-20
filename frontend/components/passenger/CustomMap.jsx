import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Google_API_Key } from '../../constants/GoogleAPIKey';
import INITIAL_POSITION from '../../constants/InitialPosition';
import { moveTo } from '../../hooks/CameraChange';
import PathDraw from './PathDraw';

const CustomMap = ({ setCenterMap, center_map, mapRef, destination, path, setLocation, setState, setDestination, user_state, live_locations, style }) => {

    return (
        <MapView
            apikey={Google_API_Key}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            onPanDrag={() => setCenterMap(false)}
            followsUserLocation={center_map}
            showsMyLocationButton={false}
            onUserLocationChange={(coordinate) => {
                center_map === true && moveTo(coordinate.nativeEvent.coordinate, mapRef);
                setLocation(coordinate.nativeEvent.coordinate);
            }}
            onPress={(e) => {
                setCenterMap(false);
                if (user_state != "searched") setState("searched")
                setDestination(e.nativeEvent.coordinate)
            }}
            ref={mapRef}
            style={style.map}
            initialRegion={INITIAL_POSITION}>
            {/* if the user sets a destination throught searching or pin point */}
            {destination != null && <Marker coordinate={destination} />}
            {/* if there are any vans live loactions broadcasted add a can icon to their location */}
            {live_locations.length > 0 && user_state != undefined && live_locations.map((location, index) => {
                return <Marker coordinate={location.location}
                    key={index}
                    image={require('../../assets/images/van-icon.png')}
                    
                />
            }
            )}
            {/* if the user chose a path draw it */}
            {path != undefined && PathDraw(path)}
        </MapView>
    );
};

export default CustomMap;