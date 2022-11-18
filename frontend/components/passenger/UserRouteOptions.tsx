import { View, Text,Appearance } from "react-native";
import styles from "../../styles/styles";
import UserRouteOption from "./UserRouteOption";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";

const UserRouteOptions = ({ routes, onPress }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState<any>({bottomPopupContainer: null});
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);
    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.subTitle}>Routes:</Text>
            <FlatList style={style.flatList}
                data={routes}
                // render each route with UserRouteOption with onPress
                renderItem={({ item }) => <UserRouteOption route={item} onPress={() => { onPress(item) }} />}
            />
        </View>
    );
}

export default UserRouteOptions;