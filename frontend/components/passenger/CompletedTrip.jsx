import { Appearance } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../../styles/styles';

const CompletedTrip = ({ setUserState, style }) => {
    const [display, setDisplay] = useState(true);

    useEffect(() => {
        if (display) {
            setTimeout(() => {
                setDisplay(true);
                setUserState('none');
            }, 2000);
        }
    }, []);

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
