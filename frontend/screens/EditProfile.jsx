import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View, TextInput } from 'react-native';
import Button from '../components/Button';
import UpdateProfile from '../hooks/UpdateProfile';
import { updateUserProfile } from '../redux/slices/userSlice';
import { store } from '../redux/store';
import styles from '../styles/styles';
import { useSelector } from 'react-redux';

const EditProfileScreen = () => {
    const [phone, setPhone] = useState(0);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState();
    const [failedMessage, setFailedMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [image, setImage] = useState();
    const user = useSelector((state) => state?.user);

    useEffect(() => {
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
    }, []);

    const update = async () => {
        const response = await UpdateProfile(null, name, email, password, phone, userType);
        if (response) {
            store.dispatch(updateUserProfile({
                userProfile: {
                    token : "Bearer " + response.token,
                    email: response.user.email,
                    name: response.user.name,
                    type: user.userProfile?.user_type,
                    image: user.userProfile?.image,
                    phone: user.userProfile?.phone,
                }
            }));
            setSuccessMessage("Profile updated successfully");
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
                            image : response.user.image,
                            token: "Bearer " + response.token
                        }
                    }));
                    setSuccessMessage("Profile updated successfully");
                    setFailedMessage(null);
                } else {
                    setFailedMessage("Failed to update profile image");
                }
            }
        });
    }


    return (
        <View style={styles.updateProfile.container}>
            <View style={styles.updateProfile.view}>
            <Text style={styles.updateProfile.title}>Update Profile</Text>
                <TouchableOpacity onPress={handleImage} style={styles.updateProfile.touchableOpacity}>
                    <Image source={image} style={styles.updateProfile.image} />
                </TouchableOpacity>
                <Text style={styles.updateProfile.label}>Name:</Text>
                <TextInput
                    style={styles.login.input}
                    placeholder="name"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.updateProfile.label}>Email:</Text>
                <TextInput
                    style={styles.login.input}
                    placeholder="email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.updateProfile.label}>Phone:</Text>
                <TextInput
                    style={styles.login.input}
                    placeholder="Phone"
                    value={phone}
                    onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                />
                <Text style={styles.updateProfile.label}>Password:</Text>
                <TextInput
                    style={styles.login.input}
                    placeholder="password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />
                <Text style={styles.login.redLabel}>{failedMessage}</Text>
                <Text style={styles.updateProfile.success}>{successMessage}</Text>
            </View>
            <Button text="UPDATE" onPress={update} width={"100%"} color={"#FF9E0D"} />
        </View>
    );
}

export default EditProfileScreen;