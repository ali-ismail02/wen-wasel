import { useNavigation } from '@react-navigation/core';
import { Image, Text, TextInput, View, ImageBackground, Appearance } from 'react-native';
import Button from '../../components/Button';
import { updateUserProfile } from "../../redux/slices/userSlice";
import { store } from '../../redux/store';
import styles from '../../styles/styles';
import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import RegisterPassenger from '../../hooks/passenger/RegisterPassenger';
import ValidateUser from '../../hooks/van/ValidateUser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterUserScreen = () => {
    const navigation = useNavigation()
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userType, setUserType] = useState("Passenger");
    const [failedArray, setFailedArray] = useState([false,false,false,false,false]);
    const [failedMessage, setFailedMessage] = useState(null);
    const [borderColor, setBorderColor] = useState('red');
    const [data, setData] = useState(['Passenger', 'Bus Driver', 'Cab Driver']);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState({bottomPopupContainer: null});
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    const checkForErrors = (response) => {
        if(response.errors.email != undefined){
            setFailedArray([false,false,true,false,false,false]);
            setFailedMessage(response.errors.email);
            return;
        }
        if(response.errors.phone != undefined){
            setFailedArray([false,true,false,false,false,false]);
            setFailedMessage(response.errors.phone);
            return;
        }
        if(response.errors.password != undefined){
            setFailedArray([false,false,false,true,true,true]);
            setFailedMessage(response.errors.password);
            return;
        }
    }

    const register = async () => {
        const formattedEmail = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if(fullname == ""){
            setFailedArray([true,false,false,false,false,false]);
            setFailedMessage("Please enter your full name");
            return;
        }
        if(phone == ""){
            setFailedArray([false,true,false,false,false,false]);
            setFailedMessage("Please enter your phone number");
            return;
        }
        if (!emailRegex.test(formattedEmail)) {
            setFailedArray([false,false,true,false,false,false]);
            setFailedMessage("Please enter a valid email address");
            return;
        }
        if(password != confirmPassword){
            setFailedArray([false,false,false,true,true,false]);
            setFailedMessage("Passwords do not match");
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setFailedArray([false,false,false,true,true,true]);
            setFailedMessage("Please enter a valid password");
            return;
        }
        if(userType == "Passenger"){
            const response = await RegisterPassenger(fullname, phone, formattedEmail, password);
            if(response){
                if(response.status == "Failed"){
                    checkForErrors(response);
                    return;
                }
                await AsyncStorage.setItem('userToken', "Bearer " + user.token);
                store.dispatch(updateUserProfile({
                    userProfile: {
                        token: "Bearer " + user.token,
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
        if(userType == "Bus Driver" || userType == "Cab Driver"){
            const response = await ValidateUser(formattedEmail, phone, password);
            if(response == true ){
                setFailedArray([false,false,false,false,false,false]);
                setFailedMessage(null);
                await AsyncStorage.setItem("driverInfo", JSON.stringify({
                    email: formattedEmail,
                    phone: phone,
                    password: password,
                    name: fullname,
                    userType: userType,
                }));
                navigation.navigate('RegisterCar')
                return;
            }
            checkForErrors(response);
            return;
        }
    }

    const handleDropdown = (selectedItem = "passenger") => {
        setUserType(selectedItem);
    }

    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Image source={require('../../assets/images/wen-wasel.png')} style={styles.login.logo} />
                <View style={styles.login.view}>
                <Text style={styles.login.label}>Full Name:</Text>
                    <TextInput
                        style = {{...!failedArray[0] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Full Name"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                    <Text style={styles.login.label}>Phone Number:</Text>
                    <TextInput
                        style = {{...!failedArray[1] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Phone Number."
                        value={phone}
                        onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                    />
                    <Text style={styles.login.label}>Email:</Text>
                    <TextInput
                        style = {{...!failedArray[2] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.login.label}>Password:</Text>
                    <TextInput
                        style = {{...!failedArray[3] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <Text style={styles.login.label}>Confirm Password:</Text>
                    <TextInput
                        style = {{...!failedArray[4] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                    />
                    <Text style={styles.login.label}>User Type:</Text>
                    <SelectDropdown 
                        data={data}
                        onSelect={(selectedItem, index) => {
                            handleDropdown(selectedItem);
                        }}
                        buttonStyle={styles.login.dropdown}
                        renderDropdownIcon={() => {
                            return (
                                <Image source={require('../../assets/images/arrowup.webp')} style={{width:30, height:30}} />
                            )
                        }}
                        dropdownIconPosition="right"
                        defaultValue={data[0]}
                        buttonTextStyle={{textAlign: 'left', paddingLeft: 3}}
                    />
                    <Text style={styles.login.redLabel}>{failedMessage}</Text>
                    <Button text="SIGNUP" onPress={register} width={"100%"} color={"#FF9E0D"}  style={style}/>
                    <Text onPress={() => navigation.navigate('Login')} style={[styles.login.links,{paddingBottom: Dimensions.get("window").height * 0.3}]}>Already have an account? Sign in!</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

export default RegisterUserScreen;