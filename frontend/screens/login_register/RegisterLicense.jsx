import { useNavigation } from '@react-navigation/core';
import { Image, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';
import styles from '../../styles/styles';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import RegisterVan from '../../hooks/van/RegisterVan';
import { store } from '../../redux/store';
import { updateUserProfile } from '../../redux/slices/userSlice';

const RegisterLicenseScreen = () => {
    const [license, setLicense] = useState('');
    const [failedMessage, setFailedMessage] = useState(null);
    const [image, setImage] = useState(require("../../assets/images/mrbean.jpg"));
    const navigation = useNavigation()

    const register = async () => {
        if (license == "") {
            setFailedMessage("Please upload the image");
            return;
        }
        const profile = JSON.parse(await AsyncStorage.getItem('driverInfo'));
        const car = JSON.parse(await AsyncStorage.getItem('carInfo'));
        const images = JSON.parse(await AsyncStorage.getItem('carImages'));
        const userType = profile.userType;
        const data = {
            name: profile.name,
            email: profile.email,
            password: profile.password,
            phone: profile.phone,
            make: car.make,
            model: car.model,
            year: car.year,
            license_plate: car.licensePlate,
            front_image: images.frontImage,
            side_image: images.sideImage,
            license: license,
        }
        const response = await RegisterVan(data);
        if (response) {
            console.log(response);
            store.dispatch(updateUserProfile({
                userProfile: {
                    token: "Bearer " + response.token,
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    type: response.user.user_type,
                    image: response.user.image,
                    phone: response.user.phone,
                }
            }));
        }
    }

    const handleImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        }).then((result) => {
            if (!result.cancelled) {
                setLicense("data:image/jpeg;base64," + result.base64);
                setImage({ uri: result.uri });
            }
        });
    }


    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Text style={styles.login.title}>SIGN UP</Text>
                <View style={styles.login.view}>
                    <Text style={[styles.login.label, { paddingBottom: 30, fontSize: 16 }]}>Please upload the pictures required below as shown in the examples</Text>
                    <Text style={styles.login.label}>Driver’s License:</Text>
                    <TouchableOpacity onPress={handleImage}>
                        <Image source={image} style={styles.login.image} />
                    </TouchableOpacity>
                    <Text style={styles.login.redLabel}>{failedMessage}</Text>
                </View>
                <Button text="SIGNUP" onPress={register} width={"100%"} color={"#FF9E0D"} />
            </ImageBackground>
        </View>
    );
}

export default RegisterLicenseScreen;