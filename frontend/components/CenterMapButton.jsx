import React from 'react';
import { Image, TouchableHighlight } from 'react-native';

const CenterMapButton = ({ setCenterMap, moveTo, location, mapRef, style, center_map }) => {
    if (!center_map) {
        return (

            <TouchableHighlight style={style.center} onPress={async () => {
                moveTo(location, mapRef, 16);
                setCenterMap(true)
            }}>
                <Image source={require('../assets/images/center.png')} style={style.centerImage} />
            </TouchableHighlight>
        );
    }
};

export default CenterMapButton;