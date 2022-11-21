import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';


const Button = ({ onPress, text, color, height = 50, width, image = null, disabled = false, style }) => {
    if (color == "#FF9E0D") {
        var textStyle = {
            ...style.buttonText,
            color: "black"
        }
        if(disabled) {
            var buttonStyle = {
                ...style.button,
                height: height,
                width: width,
                backgroundColor: "#6F4609",
            }
        }else {
            var buttonStyle = {
                ...style.button,
                height: height,
                width: width,
                backgroundColor: color,
            }
        }
    } else {
        var textStyle = {
            ...style.buttonText,
            color: "white"
        }
        if(disabled) {
            var buttonStyle = {
                ...style.button,
                height: height,
                width: width,
                backgroundColor: "#DDD",
            }
        }else {
            var buttonStyle = {
                ...style.button,
                height: height,
                width: width,
                backgroundColor: color,
            }
        }
    }

    if (image != null) {
        return (
            <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
                {image == "car" ? <Icon name="taxi" size={30} color="black" /> :
                image == "van" ? <Icon name="shuttle-van" size={30} color="black" /> : 
                image == "waypoint" ? <Feather name="map-pin" size={30} color="black" /> :
                <Icon name="walking" size={30} color="black" />}
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