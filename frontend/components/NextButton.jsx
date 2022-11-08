import {TouchableHighlight, Image } from 'react-native';
import styles from '../styles/styles';

const NextButton = ({onPress}) => {
    return (
    <TouchableHighlight style={styles.nextButton} onPress={onPress} >
        <Image source={require('../assets/images/arrow_next.webp')} style={styles.nextButtonImage} />
    </TouchableHighlight>
    );
}

export default NextButton;