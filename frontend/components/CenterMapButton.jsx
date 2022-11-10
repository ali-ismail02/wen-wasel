import styles from '../styles/styles';
import { Image, TouchableHighlight } from 'react-native';

const CenterMapButton = ({setCenterMap, moveTo, location, mapRef}) => {
    return (
    <TouchableHighlight style={styles.center} onPress={async () => {
        moveTo(location?.coords, mapRef, 18);
        setCenterMap(true)}}>
        <Image source={require('../assets/images/center.jpg')} style={styles.centerImage} />
    </TouchableHighlight>
    );
};

export default CenterMapButton;