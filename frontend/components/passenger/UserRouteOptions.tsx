import { View, Text,Appearance } from "react-native";
import styles from "../../styles/styles";
import UserRouteOption from "./UserRouteOption";
import { FlatList } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";

const UserRouteOptions = ({ routes, onPress, style, colorScheme }) => {
    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.subTitle}>Routes:</Text>
            <FlatList style={style.flatList}
                data={routes}
                // render each route with UserRouteOption with onPress
                renderItem={({ item }) => <UserRouteOption route={item} onPress={() => { onPress(item) }} style={style} colorScheme={colorScheme}/>}
            />
        </View>
    );
}

export default UserRouteOptions;