import React, { useEffect, useState } from "react";
import { Animated } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import RouteDescription from "./RouteDescription";

const ExpandableView = ({ expanded = false, routes }) => {
    const [height] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(height, {
            toValue: !expanded ? 200 : 0,
            duration: 150,
            useNativeDriver: false
        }).start();
    }, [expanded, height]);

    // console.log('rerendered');

    return (
        <Animated.View style={{ height, backgroundColor: "orange" }}>
            <FlatList 
                data={routes}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </Animated.View>
    );
};

export default ExpandableView;