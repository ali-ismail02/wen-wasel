import { useNavigation } from '@react-navigation/core';
import { Image, Text, TextInput, View, ImageBackground } from 'react-native';
import Button from '../../components/Button';
import { updateUserProfile } from "../../redux/slices/userSlice";
import { store } from '../../redux/store';
import styles from '../../styles/styles';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const RegisterUserScreen = () => {

    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [failedArray, setFailedArray] = useState([false,false,false,false,false,false]);
    const [failedMessage, setFailedMessage] = useState(null);
    const [borderColor, setBorderColor] = useState('red');
    const [data, setData] = useState(['Passenger', 'Van Driver', 'Service Driver']);
    const navigation = useNavigation()

    const handleLogin = async () => {
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
    }

    const handleDropdown = (selectedItem = "passenger") => {
        console.log(selectedItem);
    }

    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Image source={require('../../assets/images/wen-wasel.png')} style={styles.login.logo} />
                <View style={styles.login.view}>
                <Text style={styles.login.label}>Full Name</Text>
                    <TextInput
                        style = {{...!failedArray[0] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Full Name"
                        value={fullname}
                        onChangeText={setFullname}
                    />
                    <Text style={styles.login.label}>Phone Nb.</Text>
                    <TextInput
                        style = {{...!failedArray[1] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Phone Nb."
                        value={phone}
                        onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                    />
                    <Text style={styles.login.label}>Email</Text>
                    <TextInput
                        style = {{...!failedArray[2] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.login.label}>Password</Text>
                    <TextInput
                        style = {{...!failedArray[3] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <Text style={styles.login.label}>Repeat Password</Text>
                    <TextInput
                        style = {{...!failedArray[4] ? styles.login.input : {...styles.login.input, borderColor: borderColor}}}
                        placeholder="Repeat Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                    />
                    <Text style={styles.login.label}>User Type</Text>
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
                    <Button text="LOGIN" onPress={handleLogin} width={"100%"} color={"#FF9E0D"} />
                    <Text onPress={() => navigation.navigate('Login')} style={[styles.login.links,{paddingBottom: Dimensions.get("window").height * 0.3}]}>Already have an account? Sign in!</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

export default RegisterUserScreen;