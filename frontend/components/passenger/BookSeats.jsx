import { Text, View } from 'react-native';
import BookSeatsHook from '../../hooks/passenger/BookSeat';
import GetTripType from '../../hooks/passenger/GetTripType';
import styles from '../../styles/styles';
import Button from '../Button';
import UserRouteOption from './UserRouteOption';
import { Appearance} from 'react-native';
import React, { useState, useEffect } from 'react';

const BookSeats = ({ path, setState, setPath }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    const bookSeat = async (route, i) => {
        const response = await BookSeatsHook(route.element.trip);
        if (response != false) {
            path[i].reservation = response;
            setState(path);
            setState("booked");
            return
        }
        setState("failedBooking");
    }

    for (let i = 0; i < path.length; i++) {
        if (GetTripType(path[i]) == "van") {
            return (
                <>
                    <View style={style.bottomPopupContainer}>
                        <View style={style.borderBottom}>
                            <UserRouteOption route={path} onPress={() => { }} />
                        </View>
                        <Text style={style.instructions}>A van is available at this route with empty seats, would you like to book a seat?</Text>
                        <View style={style.flex}>
                            <Button text="Yes" onPress={() => { bookSeat(path[i], i) }} width={"48%"} color={"#FF9E0D"} />
                            <Button text="No" onPress={() => { setState("noBooking") }} width={"48%"} color={"black"} />
                        </View>
                    </View>
                </>
            )
        }
    }
    setState("noBooking") 
    return null;
}

export default BookSeats;