import styles from '../styles/styles';
import { Text, TouchableOpacity, Image } from 'react-native';

const Button = ({ onPress, text, color, height = 50, width, image = null, disabled = false }) => {
    if (color == "#FF9E0D") {
        var textStyle = {
            ...styles.buttonText,
            color: "black"
        }
    } else {
        var textStyle = {
            ...styles.buttonText,
            color: "white"
        }
    }

    var buttonStyle = {
        ...styles.button,
        height: height,
        width: width,
        backgroundColor: color
    }

    if (image != null) {
        return (
            <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
                {image == "car" ? <Image source={require('../assets/images/car.png')} style={{width:40, height:30}} /> : 
                image == "van" ? <Image source={require('../assets/images/van.png')} style={{width:40, height:30}} /> : 
                image == "waypoint" ? <Image source={require('../assets/images/waypoint.png')} style={{width:20, height:40}} /> :
                <Image source={require('../assets/images/walking.png')} style={{width:30, height:40}} />}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
};

export default Button;