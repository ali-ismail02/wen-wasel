import { DrawerItem } from '@react-navigation/drawer';
import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, View, Appearance } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { deleteUser } from '../../redux/slices/userSlice';
import { store } from '../../redux/store';
import styles from './styles';

const CustomDrawer = (props: any) => {
    const [uri, setUri] = useState('');
    const [iconColor, setIconColor] = useState('');
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({ topSection: null, imageProfile: null, nameContainer: null, title: null });

    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
    });

    useEffect(() => {
        { colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light) }
        { colorScheme == 'dark' ? setIconColor('#fff') : setIconColor('#000') }
    }, [colorScheme]);

    const TopSection = () => {

        const user = useSelector((state: any) => state?.user);
        const image = user?.userProfile.image;

        return (
            <View style={style.topSection}>
                {image ? <Image source={{ uri: "http://192.168.1.50:8000/images/" + image }} style={style.imageProfile} />
                    : <Image source={require("../../assets/images/default_profile.webp")} style={style.imageProfile} />}
                <View style={style.nameContainer}>
                    <Text numberOfLines={1} style={style.title}>{user?.userProfile.name}</Text>
                </View>
            </View>
        )
    }
    const user = useSelector((state: any) => state?.user);
    // const dispatch = useDispatch()
    return (
        <ScrollView bounces={false} style={style.main}>
            <TopSection />
            <View style={style.container}>
                <View>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="home" color={iconColor} size={24} />
                        )}
                        label="Home"
                        labelStyle={{
                            color: iconColor,
                        }}
                        onPress={() => {
                            props.navigation.navigate('Home');
                        }}
                    />
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon
                                name="user"
                                color={iconColor}
                                size={24}
                            />
                        )}
                        label="My Profile"
                        labelStyle={{
                            color: iconColor,
                        }}
                        onPress={() => {
                            props.navigation.navigate('My Profile');
                        }}
                    />
                </View>
                <View>
                    <DrawerItem
                        icon={({ color, size }) => (
                            <Icon name="log-out" color={"#FF9E0D"} size={24} />
                        )}
                        label="Logout"
                        labelStyle={{
                            color: "#FF9E0D",
                        }}
                        onPress={() => {
                            store.dispatch(deleteUser())
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default CustomDrawer;
