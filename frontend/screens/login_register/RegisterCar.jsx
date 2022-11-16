import { useNavigation } from '@react-navigation/core';
import { Image, Text, TextInput, View, ImageBackground } from 'react-native';
import Button from '../../components/Button';
import styles from '../../styles/styles';
import React, { useState } from 'react';
import { updateUserProfile } from '../../redux/slices/userSlice';
import { Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterCarScreen = () => {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [failedArray, setFailedArray] = useState([false, false, false, false]);
    const [failedMessage, setFailedMessage] = useState(null);
    const [borderColor, setBorderColor] = useState('red');
    const [data, setData] = useState([]);
    const navigation = useNavigation()
    // set data to years from 1900 to current year

    React.useEffect(() => {
        const years = [];
        let yearTemp = 1990
        let thisYear = new Date().getFullYear();
        while (yearTemp <= thisYear) {
            years.push(yearTemp);
            yearTemp++;
        }
        setData(years);
    }, []);

    const register = async () => {
        let flag = 1;
        if (make == "") {
            setFailedArray(...failedArray, failedArray[0] = true);
            flag = 0;
        }
        if (model == "") {
            setFailedArray(...failedArray, failedArray[1] = true);
            flag = 0;
        }
        if (year == "") {
            setFailedArray(...failedArray, failedArray[2] = true);
            flag = 0;
        }
        if (licensePlate == "") {
            setFailedArray(...failedArray, failedArray[3] = true);
            flag = 0;
        }
        if (!flag) {
            setFailedMessage("Please fill in all fields");
            return;
        }
        await AsyncStorage.setItem('carInfo', JSON.stringify({ make, model, year, licensePlate }));
        navigation.navigate("RegisterLicense");
    }

    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Image source={require('../../assets/images/wen-wasel.png')} style={styles.login.logo} />
                <View style={styles.login.view}>
                    <Text style={styles.login.label}>Make</Text>
                    <TextInput
                        style={{ ...!failedArray[0] ? styles.login.input : { ...styles.login.input, borderColor: borderColor } }}
                        placeholder="Make"
                        value={make}
                        onChangeText={setMake}
                    />
                    <Text style={styles.login.label}>Model</Text>
                    <TextInput
                        style={{ ...!failedArray[1] ? styles.login.input : { ...styles.login.input, borderColor: borderColor } }}
                        placeholder="Model"
                        value={model}
                        onChangeText={setModel}
                    />
                    <Text style={styles.login.label}>Years</Text>
                    <SelectDropdown
                        data={data}
                        onSelect={(selectedItem, index) => {
                            setYear(selectedItem);
                        }}
                        buttonStyle={styles.login.dropdown}
                        renderDropdownIcon={() => {
                            return (
                                <Image source={require('../../assets/images/arrowup.webp')} style={{ width: 30, height: 30 }} />
                            )
                        }}
                        dropdownIconPosition="right"
                        defaultButtonText='Select Year'
                        buttonTextStyle={{ textAlign: 'left', paddingLeft: 3 }}
                        dropdownStyle={{  height: Dimensions.get('window').height * 0.3 }}
                    />
                    <Text style={styles.login.label}>License Plate</Text>
                    <TextInput
                        style={{ ...!failedArray[3] ? styles.login.input : { ...styles.login.input, borderColor: borderColor } }}
                        placeholder="License Plate"
                        value={licensePlate}
                        onChangeText={setLicensePlate}
                    />
                    <Text style={styles.login.redLabel}>{failedMessage}</Text>
                    <Button text="NEXT" onPress={register} width={"100%"} color={"#FF9E0D"} />
                </View>
            </ImageBackground>
        </View>
    );
}

export default RegisterCarScreen;