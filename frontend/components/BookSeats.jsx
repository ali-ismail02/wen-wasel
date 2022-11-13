import { View, Image, Text } from 'react-native';
import styles from '../styles/styles';
import GetTripType from '../hooks/GetTripType';
import UserRouteOption from './UserRouteOption';
import Button from './Button';
import BookSeatsHook from '../hooks/BookSeat';
import Booked from './Booked';

const BookSeats = ({ path, setState }) => {

    const bookSeat = async (route) => {
        const response = await BookSeatsHook(route);
        console.log(response);
        if (response) {
            console.log("Booking Successful");
            setState("booked");
            return
        }
        setState("failedBooking");
    }

    for (let i = 0; i < path.length; i++) {
        if (GetTripType(path[i]) == "van") {
            return (
                <>
                    <View style={styles.bottomPopupContainer}>
                        <View style={styles.borderBottom}>
                            <UserRouteOption route={path} onPress={() => { }} />
                        </View>
                        <Text style={styles.instructions}>A van is available at this route with empty seats, would you like to book a seat?</Text>
                        <View style={styles.flex}>
                            <Button text="Yes" onPress={() => { bookSeat(path[i].element.trip) }} width={"48%"} color={"#FF9E0D"} />
                            <Button text="No" onPress={() => { setState("noBooking") }} width={"48%"} color={"black"} />
                        </View>
                    </View>
                </>
            )
        }
    }
    return null;
}

export default BookSeats;