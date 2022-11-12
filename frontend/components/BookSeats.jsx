import {View, Image, Text} from 'react-native';
import styles from '../styles/styles';
import {GetTripType} from '../hooks/GetTripType';

const BookSeats = ({path}) => {
    path.forEach((element) => {
        if(GetTripType(element) === 'van') {
            if(element.element.driver) {
                return (
                    <><View></View>
                    </>
                )
            }
        }
    });
    return null;
}

export default BookSeats;