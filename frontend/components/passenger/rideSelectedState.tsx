import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import UserRouteOption from "./UserRouteOption";

const rideSelectedState = ({ routes, onPress, style, colorScheme }) => {
    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.subTitle}>Routes:</Text>
            <FlatList style={style.flatList}
                data={routes}
                // render each route with UserRouteOption with onPress
                renderItem={({ item }) => <UserRouteOption route={item} onPress={() => { onPress(item) }} style={style} colorScheme={colorScheme} />}
            />
        </View>
    );
}

export default rideSelectedState;