import React from 'react';
import { Text, View } from 'react-native';
import BookSeatsHook from '../../hooks/passenger/BookSeat';
import GetTripType from '../../hooks/passenger/GetTripType';
import Button from '../Button';
import UserRouteOption from './UserRouteOption';

const BookSeats = ({ path, setState, style }) => {

    const bookSeat = async (route, i) => {
        // call the hook to book the seat
        const response = await BookSeatsHook(route.element.trip);
        if (response != false) {
            path[i].reservation = response;
            setState(path);
            setState("booked");
            return
        }
        // if the booking was unsuccessful:
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
                            <Button text="Yes" onPress={() => { bookSeat(path[i], i) }} width={"48%"} color={"#FF9E0D"} style={style} />
                            <Button text="No" onPress={() => { setState("noBooking") }} width={"48%"} color={"black"} style={style} />
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