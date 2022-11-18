import { Appearance } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../../styles/styles';

const CompletedTrip = ({ setUserState }) => {
    const [display, setDisplay] = useState(true);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);

    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        { }
    });

    useEffect(() => {
        { colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light) }
        if (display) {
            setTimeout(() => {
                setDisplay(true);
                setUserState('none');
            }, 2000);
        }
    }, [colorScheme]);

    return (<>
        {display == true &&
            <View style={style.BookingPopup}>
                <Image style={style.bookingImage} source={require('../../assets/images/tick.png')} />
                <Text style={style.bookingText}>Trip Completed</Text>
            </View>}
    </>
    );
};

export default CompletedTrip;
