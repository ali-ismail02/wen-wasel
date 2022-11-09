import styles from '../styles/styles';
import { Text, TouchableHighlight } from 'react-native';

const Button = ({onPress, text, color, height = 50, width}) => {
    if(color == "#FF9E0D"){
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
        <Text style={textStyle}>{text}</Text>
    </TouchableHighlight>
    );
};

export default Button;