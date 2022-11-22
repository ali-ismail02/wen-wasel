import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput, Appearance } from 'react-native';
import Button from '../components/Button';
import UpdateProfile from '../hooks/UpdateProfile';
import { updateUserProfile } from '../redux/slices/userSlice';
import { store } from '../redux/store';
import styles from '../styles/styles';
import { useSelector } from 'react-redux';
import Booked from '../components/passenger/Booked';

const EditProfileScreen = () => {
    const [phone, setPhone] = useState(0);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState();
    const [failedMessage, setFailedMessage] = useState(null);
    const [image, setImage] = useState();
    const [updated, setUpdated] = useState(false);
    const user = useSelector((state) => state?.user);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);

    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        { }
    });
    useEffect(() => {
        { colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light) }
        const img = user?.userProfile?.image;
        setEmail(user?.userProfile?.email);
        setName(user?.userProfile?.name);
        console.log(user?.userProfile?.phone);
        setPhone((String)(user?.userProfile?.phone));
        if (user?.userProfile?.type == 2) {
            setUserType("user");
        } else if (user?.userProfile?.type == 3) {
            setUserType("van");
        }
        if (img) {
            setImage({ uri: "http://192.168.1.50:8000/images/" + img });
        } else {
            setImage(require('../assets/images/default_profile.webp'));
        }
    }, [colorScheme, updated]);

    const update = async () => {
        const response = await UpdateProfile(null, name, email, password, phone, userType);
        if (response) {
            store.dispatch(updateUserProfile({
                userProfile: {
                    token: "Bearer " + response.token,
                    email: response.user.email,
                    name: response.user.name,
                    type: user.userProfile?.user_type,
                    image: user.userProfile?.image,
                    phone: user.userProfile?.phone,
                }
            }));
            setUpdated("profile Updated");
            console.log(updated);
            setFailedMessage(null);
            return;
        }
        setFailedMessage("Failed to update profile");
    }

    const handleImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
        }).then(async (result) => {
            if (!result.cancelled) {
                const response = await UpdateProfile("data:image/jpeg;base64," + result.base64, null, null, null, null, userType);
                if (response) {
                    setImage({ uri: result.uri });
                    store.dispatch(updateUserProfile({
                        userProfile: {
                            email: user.userProfile?.email,
                            name: user.userProfile?.name,
                            type: user.userProfile?.user_type,
                            phone: user.userProfile?.phone,
                            image: response.user.image,
                            token: user.userProfile?.token,
                        }
                    }));
                    setFailedMessage(null);
                    setUpdated("image Updated");
                } else {
                    setFailedMessage("Failed to update profile image");
                }
            }
        });
    }


    return (
        <>
            {updated == "profile Updated" && <Booked status="profile Updated" style={style} />}
            {updated == "image Updated" && <Booked status="image Updated" style={style} />}
            <View style={style.updateProfile.container}>
                <View style={style.updateProfile.view}>
                    <Text style={style.updateProfile.title}>Update Profile</Text>
                    <TouchableOpacity onPress={handleImage} style={style.updateProfile.touchableOpacity}>
                        <Image source={image} style={style.updateProfile.image} />
                    </TouchableOpacity>
                    <Text style={style.updateProfile.label}>Name:</Text>
                    <TextInput
                        style={style.updateProfile.input}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={"#777"}
                    />
                    <Text style={style.updateProfile.label}>Email:</Text>
                    <TextInput
                        style={style.updateProfile.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor={"#777"}
                    />
                    <Text style={style.updateProfile.label}>Phone:</Text>
                    <TextInput
                        style={style.updateProfile.input}
                        placeholder="Phone"
                        value={phone}
                        onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        placeholderTextColor={"#777"}
                    />
                    <Text style={style.updateProfile.label}>Password:</Text>
                    <TextInput
                        style={style.updateProfile.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        placeholderTextColor={"#777"}
                    />
                    <Text style={styles.login.redLabel}>{failedMessage}</Text>
                </View>
                <Button text="UPDATE" onPress={update} width={"100%"} color={"#FF9E0D"} style={style} />
            </View>
        </>
    );
}

export default EditProfileScreen;