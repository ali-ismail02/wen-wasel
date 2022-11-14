import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from '../../styles/styles';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from '../Button';


const Routes = ({ destination, destinations, setState }) => {

    const delay = () => {
    }
    
    const addRoute = () => {
        setState("addingRoute");
    }

    console.log("called", destination);
    if (destinations != null && destinations.length > 0) {
        return (
            <View style={styles.bottomPopupContainerNoPadding}>
                <View style={styles.bottomPopupExpander}>
                    <View style={styles.bottomPopupLine}>
                    </View>
                </View>
                <View style={styles.van.routes}>
                    <View style={styles.flex}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        {destination == null ? <Button text="Delay" onPress={delay} color={"black"} width={"80%"} /> :
                            <View style={styles.flex}>
                                <Button text="Delay" onPress={delay} color={"black"} width={"40%"} />
                                <Button text="Add Route" onPress={addRoute} color={"#FF9E0D"} width={"40%"} />
                            </View>
                        }
                    </View>
                </View>
            </View>
        );
    } else if(destination != null) {
        return (
            <View style={styles.bottomPopupContainerNoPadding}>
                <View style={styles.bottomPopupExpander}>
                    <View style={styles.bottomPopupLine}>
                    </View>
                </View>
                <View style={styles.van.routes}>
                    <View style={styles.flex}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        <Button text="Add Route" onPress={addRoute} color={"#FF9E0D"} width={"80%"} />
                    </View>
                </View>
            </View>
        );
    }
}

export default Routes;