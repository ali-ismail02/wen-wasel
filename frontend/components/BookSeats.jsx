import { View, Image, Text } from 'react-native';
import styles from '../styles/styles';
import GetTripType from '../hooks/GetTripType';
import UserRouteOption from './UserRouteOption';
import Button from './Button';

const BookSeats = ({ path, setState }) => {
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
                            <Button text="Yes" onPress={() => { setState("booked") }} width= {"48%"} color={"#FF9E0D"}/>
                            <Button text="No" onPress={() => { setState("pathConfirmed") }} width= {"48%"} color={"black"}/>
                        </View>
                    </View>
                </>
            )
        }
    }
    return null;
}

export default BookSeats;