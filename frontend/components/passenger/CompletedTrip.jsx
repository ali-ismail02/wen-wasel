import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../../styles/styles';

const CompletedTrip = ({ setUserState }) => {
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
            <View style={styles.BookingPopup}>
                <Image style={styles.bookingImage} source={require('../../assets/images/tick.png')} />
                <Text style={styles.bookingText}>Trip Completed</Text>
            </View>}
    </>
    );
};

export default CompletedTrip;
