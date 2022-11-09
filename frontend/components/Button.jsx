import styles from '../styles/styles';
import { Image, TouchableHighlight } from 'react-native';

const Button = ({onPress, text, color, height, width = 50}) => {
    if(color == "yellow"){
        textStyle = {
            ...styles.buttonText,
            color: "black"
        }
    } else {
        textStyle = {
            ...styles.buttonText,
            color: "white"
        }
    }

    buttonStyle = {
        ...styles.button,
        height: height,
        width: width,
        backgroundColor: color
    }

    return (
    <TouchableHighlight style={buttonStyle} onPress={onPress}>
        <Text style={styles.textStyle}>{text}</Text>
    </TouchableHighlight>
    );
};

export default Button;