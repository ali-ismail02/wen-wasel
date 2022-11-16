import { DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styles from './styles';
import { deleteUser } from '../../redux/slices/userSlice';
import { store } from '../../redux/store';
import { useSelector } from 'react-redux';

const TopSection = () => {
    const [uri, setUri] = React.useState('');
    const user = useSelector((state: any) => state?.user);
    const image = user?.userProfile.image;

    return (
        <View style={styles.topSection}>
            {image ? <Image source={{ uri: "http://192.168.1.50:8000/images" + image }} style={styles.imageProfile} />
                : <Image source={require("../../assets/images/default_profile.webp")} style={styles.imageProfile} />}
            <View style={styles.nameContainer}>
                <Text numberOfLines={1} style={styles.title}>{user?.userProfile.name}</Text>
            </View>
        </View>
    )
}

const CustomDrawer = (props: any) => {
    // const dispatch = useDispatch()
    return (
        <ScrollView bounces={false}>
            <TopSection />
            <View style={styles.container}>
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="home" color={"black"} size={24} />
                    )}
                    label="Home sweet home"
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
