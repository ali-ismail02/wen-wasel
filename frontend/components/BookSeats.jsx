import { View, Image, Text } from 'react-native';
import styles from '../styles/styles';
import { GetTripType } from '../hooks/GetTripType';
import UserRouteOption from './UserRouteOption';
import Button from './Button';

const BookSeats = ({ path, setState }) => {
    path.forEach((element) => {
        if (GetTripType(element) === 'van') {
            if (element.element.hasOwnProperty('driver') && element.element.driver.seats > 0) {
                return (
                    <>
                        <View style={styles.bottomPopupContainer}>
                            <View style={styles.borderBottom}>
                                <UserRouteOption route={path} onPress={() => { }} />
                            </View>
                            <Text style={styles.instructions}>A van is available at this route with empty seats, would you like to book a seat?</Text>
                            <View style={styles.flex}>
                                <Button text="Yes" onPress={() => { setState("booked") }} />
                                <Button text="No" onPress={() => { setState("pathConfirmed") }} />
                            </View>
                        </View>
                    </>
                )
            }
        }
    });
    return null;
}

export default BookSeats;