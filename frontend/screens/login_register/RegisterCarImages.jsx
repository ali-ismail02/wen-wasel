import { useNavigation } from '@react-navigation/core';
import { Image, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import styles from '../../styles/styles';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const RegisterCarImagesScreen = () => {
    const [frontImage, setFrontImage] = useState('');
    const [sideImage, setSideImage] = useState('');
    const [failedArray, setFailedArray] = useState([false, false]);
    const [failedMessage, setFailedMessage] = useState(null);
    const [borderColor, setBorderColor] = useState('red');
    const [image1, setImage1] = useState(require("../../assets/images/van_front.jpg"));
    const [image2, setImage2] = useState(require("../../assets/images/van_side.jpg"));
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
        await AsyncStorage.setItem('carImages', JSON.stringify({ frontImage, sideImage }));
        navigation.navigate("RegisterLicense");
    }

    const handleImage =async (image) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        }).then((result) => {
            if (!result.cancelled) {
                if (image == 1) {
                    setFrontImage("data:image/jpeg;base64," + result.base64);
                    setImage1({ uri: result.uri });
                }
                else {
                    console.log(result.base64);
                    setSideImage("data:image/jpeg;base64," + result.base64);
                    setImage2({ uri: result.uri });
                }
            }
        });
    }


    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Text style={styles.login.title}>SIGN UP</Text>
                <View style={styles.login.view}>
                    <Text style={[styles.login.label, {paddingBottom:30,fontSize:16}]}>Please upload the pictures required below as shown in the examples</Text>
                    <Text style={styles.login.label}>Front of the car (license plate should be visible):</Text>
                    <TouchableOpacity onPress={() => { handleImage(1) }}>
                        <Image source={image1} style={styles.login.image} />
                    </TouchableOpacity>
                    <Text style={styles.login.label}>Side of the car:</Text>
                    <TouchableOpacity onPress={() => { handleImage(2) }} style={{paddingBottom:20}}>
                        <Image source={image2} style={styles.login.image} />
                    </TouchableOpacity>
                    <Button text="NEXT" onPress={register} width={"100%"} color={"#FF9E0D"} />
                </View>
            </ImageBackground>
        </View>
    );
}

export default RegisterCarImagesScreen;