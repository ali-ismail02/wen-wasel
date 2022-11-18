import { View, Text, Image } from 'react-native';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const Booked = ({ status }) => {
    const [display, setDisplay] = useState(true);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    // set display to false after 2 seconds
    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
        if (display) {
            setTimeout(() => {
                setDisplay(false);
            }, 2000);
        }
    }, [colorScheme]);

    if (status == 1) {
        return (<>
            {display == true &&
                <View style={style.BookingPopup} >
                    <Image source={require('../../assets/images/tick.png')} style={style.bookingImage} />
                    <Text style={style.bookingText}>Booking Successful</Text>
                </View>}
        </>
        )
    }
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