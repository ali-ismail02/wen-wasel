import { View, Text, Image } from 'react-native';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';

const Booked = ({ status }) => {
    const [display, setDisplay] = useState(true);

    // set display to false after 2 seconds
    useEffect(() => {
        if (display) {
            setTimeout(() => {
                setDisplay(false);
            }, 2000);
        }
    }, []);

    if (status == 1) {
        return (<>
            {display == true &&
                <View style={styles.BookingPopup} >
                    <Image source={require('../assets/images/tick.png')} style={styles.bookingImage} />
                    <Text style={styles.bookingText}>Booking Successful</Text>
                </View>}
        </>
        )
    }
    return (<>
        {display == true &&
            <View style={styles.BookingPopup} >
                <Image source={require('../assets/images/x.png')} style={styles.bookingImage} />
                <Text style={styles.bookingText}>Booking Failed</Text>
            </View>}
    </>
    )
}

export default Booked;