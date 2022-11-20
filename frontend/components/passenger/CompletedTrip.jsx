import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

const CompletedTrip = ({ setUserState, style }) => {
    const [display, setDisplay] = useState(true);

    useEffect(() => {
        // hide the popup after 2 seconds
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
