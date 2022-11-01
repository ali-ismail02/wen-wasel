import React from "react";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, Text, View } from "react-native";
import styles from "../styles/styles";

const Map = () => {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE} />
        </View>
    );
};

export default Map;