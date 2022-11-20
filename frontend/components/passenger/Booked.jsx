import { useState } from 'react';
import { Image, Text, View } from 'react-native';

const Booked = ({ status, style }) => {
    const [display, setDisplay] = useState(true);

    if (status == 1) { // Booking was successful
        return (<>
            {display == true &&
                <View style={style.BookingPopup} >
                    <Image source={require('../../assets/images/tick.png')} style={style.bookingImage} />
                    <Text style={style.bookingText}>Booking Successful</Text>
                </View>}
            </>
            );
    }
    // Booking was unsuccessful
    return (<>
        {display == true &&
            <View style={style.BookingPopup} >
                <Image source={require('../../assets/images/x.png')} style={style.bookingImage} />
                <Text style={style.bookingText}>Booking Failed</Text>
            </View>}
            </>
            )
}

export default Booked;