import { DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { View, ScrollView, Text, Image, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import { deleteUser } from '../../redux/slices/userSlice';
import { updateTheme } from '../../redux/slices/userSlice';
import { store } from '../../redux/store';
import { useSelector } from 'react-redux';

const TopSection = () => {
    const [uri, setUri] = React.useState('');
    const user = useSelector((state: any) => state?.user);
    const image = user?.userProfile.image;

    return (
        <View style={styles.topSection}>
            {image ? <Image source={{ uri: "http://192.168.1.50:8000/images/" + image }} style={styles.imageProfile} />
                : <Image source={require("../../assets/images/default_profile.webp")} style={styles.imageProfile} />}
            <View style={styles.nameContainer}>
                <Text numberOfLines={1} style={styles.title}>{user?.userProfile.name}</Text>
            </View>
        </View>
    )
}

const CustomDrawer = (props: any) => {
    const user = useSelector((state: any) => state?.user);
    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    if(user.userProfile.theme == 'dark'){
        setIsDarkTheme(true);
    }
    // const dispatch = useDispatch()
    return (
        <ScrollView bounces={false}>
            <TopSection />
            <View style={styles.container}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="home" color={"black"} size={24} />
                    )}
                    label="Home"
                    labelStyle={{
                        color: "black",
                    }}
                    onPress={() => {
                        props.navigation.navigate('Home');
                    }}
                />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon
                            name="user"
                            color={"black"}
                            size={24}
                        />
                    )}
                    label="My Profile"
                    labelStyle={{
                        color: "black",
                    }}
                    onPress={() => {
                        props.navigation.navigate('My Profile');
                    }}
                />
                <View style={styles.switchContainer}>
                    <Icon name="moon" color={"black"} size={24} />
                    <Text style={styles.switchText}>Dark Theme</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDarkTheme ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {
                            {isDarkTheme ? store.dispatch(updateTheme('light')) : store.dispatch(updateTheme('dark'))}
                            setIsDarkTheme(!isDarkTheme)
                            store
                        }}
                        value={isDarkTheme}
                    />
                </View>
                <View style={styles.divider} />
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="log-out" color={"red"} size={24} />
                    )}
                    label="Logout"
                    labelStyle={{
                        color: "red",
                    }}
                    onPress={() => {
                        store.dispatch(deleteUser())
                    }}
                />
            </View>
        </ScrollView>
    );
};

export default CustomDrawer;
