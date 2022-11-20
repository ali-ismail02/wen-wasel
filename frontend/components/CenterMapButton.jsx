import React from 'react';
import { Image, TouchableHighlight } from 'react-native';

const CenterMapButton = ({setCenterMap, moveTo, location, mapRef, style}) => {
    return (
    <TouchableHighlight style={style.center} onPress={async () => {
        moveTo(location?.coords, mapRef, 18);
        setCenterMap(true)}}>
        <Image source={require('../assets/images/center.jpg')} style={style.centerImage} />
    </TouchableHighlight>
    );
};

export default CenterMapButton;