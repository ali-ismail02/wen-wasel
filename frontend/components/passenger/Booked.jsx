import { useState, useEffect } from 'react';
import { Image, Text, View } from 'react-native';

const Booked = ({ status, style }) => {
    const [display, setDisplay] = useState(true);

    // set display to false after 2 seconds
    useEffect(() => {
        if (display) {
            setTimeout(() => {
                setDisplay(false);
            }, 2000);
        }
    }, [status]);

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
    if (status == 0) {
        return (<>
            {display == true &&
                <View style={style.BookingPopup} >
                    <Image source={require('../../assets/images/x.png')} style={style.bookingImage} />
                    <Text style={style.bookingText}>Booking Failed</Text>
                </View>}
        </>
        )
    }
    if(status == "image Updated"){
        console.log("image updated");
        return (<>
            {display == true &&
                <View style={style.BookingPopup} >
                    <Image source={require('../../assets/images/tick.png')} style={style.bookingImage} />
                    <Text style={style.bookingText}>Image Updated</Text>
                </View>}
        </>
        )
    }
    if(status == "profile Updated"){
        return (<>
            {display == true &&
                <View style={style.BookingPopup} >
                    <Image source={require('../../assets/images/tick.png')} style={style.bookingImage} />
                    <Text style={style.bookingText}>Profile Updated</Text>
                </View>}
        </>
        )
    }
}

export default Booked;