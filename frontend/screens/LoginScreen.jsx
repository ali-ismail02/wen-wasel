import { View, Text, TextInput, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { userUpdateProfile } from "../redux/slices/userSlice";
import { store } from '../redux/store';
import styles from '../styles/styles';
import Login from '../hooks/Login';
import Button from '../components/Button';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation()

    const handleLogin = async () => {
        const user = await Login(email, password);
        if (user) {
            store.dispatch(userUpdateProfile({
                userProfile: {
                    token: "Bearer " + user.access_token,
                    id: user.data.id,
                    name: user.data.name,
                    email: user.data.email,
                    type: user.data.user_type,
                    image: user.data.image,
                    phone: user.data.phone,
                }
            }));
            console.log(user);
            navigation.navigate('Home');
        };

        return (
            <View style={styles.login.container}>
                <Image source={require('../assets/images/wen-wasel.png')} style={styles.login.logo} />
                <TextInput
                    style={styles.login.input}
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.login.input}
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title="Login" onPress={handleLogin} width={"100%"} color={"#FF9E0D"}/>
                <Text onPress={() => navigation.navigate('Register')} style={styles.login.links}>Dont have an account? Sign up now!</Text>
            </View>
        );
    }
}

export default LoginScreen;