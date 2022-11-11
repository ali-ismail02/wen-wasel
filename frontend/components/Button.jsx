import styles from '../styles/styles';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, text, color, height = 50, width, image = null }) => {
    if (color == "#FF9E0D") {
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

    if (image != null) {
        return (
            <TouchableOpacity style={buttonStyle} onPress={onPress}>
                <Image source={image} style={styles.buttonImage} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;