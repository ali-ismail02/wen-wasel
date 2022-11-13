import { Text, View } from 'react-native';
import BookSeatsHook from '../hooks/BookSeat';
import GetTripType from '../hooks/GetTripType';
import styles from '../styles/styles';
import Button from './Button';
import UserRouteOption from './UserRouteOption';

const BookSeats = ({ path, setState, setPath }) => {

    const bookSeat = async (route, i) => {
        const response = await BookSeatsHook(route.element.trip);
        if (response != false) {
            path[i].resrvation = response;
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
                    <View style={styles.bottomPopupContainer}>
                        <View style={styles.borderBottom}>
                            <UserRouteOption route={path} onPress={() => { }} />
                        </View>
                        <Text style={styles.instructions}>A van is available at this route with empty seats, would you like to book a seat?</Text>
                        <View style={styles.flex}>
                            <Button text="Yes" onPress={() => { bookSeat(path[i], i) }} width={"48%"} color={"#FF9E0D"} />
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