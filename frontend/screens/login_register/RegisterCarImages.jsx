import { useNavigation } from '@react-navigation/core';
import { Image, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import { store } from '../../redux/store';
import styles from '../../styles/styles';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterCarScreen = () => {
    const [frontImage, setFrontImage] = useState('');
    const [sideImage, setSideImage] = useState('');
    const [failedArray, setFailedArray] = useState([false, false]);
    const [failedMessage, setFailedMessage] = useState(null);
    const [borderColor, setBorderColor] = useState('red');
    const [image1, setImage1] = useState(require());
    const navigation = useNavigation()

    const register = async () => {
        let flag = 1;
        if (frontImage == "") {
            setFailedArray(...failedArray, failedArray[0] = true);
        }
        if (sideImage == "") {
            setFailedArray(...failedArray, failedArray[1] = true);
        }
        if (!flag) {
            setFailedMessage("Please fill in all fields");
            return;
        }
        await AsyncStorage.setItem('carImages', JSON.stringify({ frontImage, sideImage}));
        navigation.navigate("RegisterLicense");
    }

    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Text style={styles.login.title}>SIGN UP</Text>
                <Text style={styles.login.label}>Please upload the pictures required below as shown in the examples</Text>
                <View style={styles.login.view}>
                    <Text style={styles.login.label}>Front of the car (license plate should be visible):</Text>
                    <TouchableOpacity onPress={() => {}}>
                        <Image 
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {}}>
                        <Text style={styles.login.label}>Side Image</Text>
                    </TouchableOpacity>
                    <Button text="NEXT" onPress={register} width={"100%"} color={"#FF9E0D"} />
                </View>
            </ImageBackground>
        </View>
    );
}

export default RegisterCarScreen;