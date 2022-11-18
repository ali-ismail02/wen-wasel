import styles from '../styles/styles';
import { Image, TouchableHighlight, Appearance } from 'react-native';
import React, {useState, useEffect} from 'react';

const CenterMapButton = ({setCenterMap, moveTo, location, mapRef}) => {
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
    <TouchableHighlight style={style.center} onPress={async () => {
        moveTo(location?.coords, mapRef, 18);
        setCenterMap(true)}}>
        <Image source={require('../assets/images/center.jpg')} style={style.centerImage} />
    </TouchableHighlight>
    );
};

export default CenterMapButton;