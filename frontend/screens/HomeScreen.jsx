import React from "react";
import { View } from "react-native";
import Map from "../components/Map";
import getRoutes from "../hooks/GetRoutes";

const HomeScreen = () => {
    const res = getRoutes("33.835939,35.495558","33.903891,35.500107",1)
    return (
        <View>
            <Map />
        </View>
    );
};

export default HomeScreen;