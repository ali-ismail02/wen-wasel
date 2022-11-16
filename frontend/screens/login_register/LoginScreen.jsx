import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';
import { Dimensions, Image, ImageBackground, Text, TextInput, View } from 'react-native';
import Button from '../../components/Button';
import Login from '../../hooks/Login';
import { updateUserProfile } from "../../redux/slices/userSlice";
import { store } from '../../redux/store';
import styles from '../../styles/styles';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailBorder, setEmailBorder] = useState('#DDD');
    const [passwordBorder, setPasswordBorder] = useState('#DDD');
    const [failedMessage, setFailedMessage] = useState(null);
    const navigation = useNavigation()

    const handleLogin = async () => {
        const formattedEmail = email.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(formattedEmail)) {
            setFailedMessage("Please enter a valid email address");
            setEmailBorder('red');
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setFailedMessage("Please enter a valid password");
            setPasswordBorder('red');
            return;
        }

        const response = await Login(formattedEmail, password);
        if (response) {
            if(response.driver != undefined && response.driver.approval_status == 0){
                setFailedMessage("Your account is pending approval");
                return;
            }
            if(response.driver != undefined && response.driver.approval_status == -1){
                setFailedMessage("Your account has been rejected");
                return;
            }
            store.dispatch(updateUserProfile({
                userProfile: {
                    token: "Bearer " + user.access_token,
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    type: response.user.user_type,
                    image: response.user.image,
                    phone: response.user.phone,
                }
            }));
            return;
        }
        setEmailBorder('red');
        setPasswordBorder('red');
        setFailedMessage("Invalid email or password");
    }

    return (
        <View style={styles.login.container}>
            <ImageBackground source={require('../../assets/images/background.png')} style={styles.login.backgroundImage}>
                <Image source={require('../../assets/images/wen-wasel.png')} style={styles.login.logo} />
                <View style={styles.login.view}>
                    <Text style={styles.login.label}>Email</Text>
                    <TextInput
                        style={[styles.login.input, { borderColor: emailBorder }]}
                        placeholder="email"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Text style={styles.login.label}>Password</Text>
                    <TextInput
                        style={[styles.login.input, { borderColor: passwordBorder }]}
                        placeholder="password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                    />
                    <Text style={styles.login.redLabel}>{failedMessage}</Text>
                    <Button text="LOGIN" onPress={handleLogin} width={"100%"} color={"#FF9E0D"} />
                    <Text onPress={() => navigation.navigate('RegisterUser')} style={[styles.login.links, { paddingBottom: Dimensions.get("window").height * 0.3 }]}>Dont have an account? Sign up now!</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

export default LoginScreen;