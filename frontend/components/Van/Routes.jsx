import React, { useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from '../../styles/styles';
import Button from '../Button';
import RouteDescription from './RouteDescription';


const Routes = ({ destination, destinations, setState, setDestinations }) => {
    const [expanded, setExpanded] = useState(false);
    // get first destination from destinations where arrived is false
    const [firstDestination, setFirstDestination] = useState(destinations.find(destination => destination[0].arrived === false));
    const [finished, setFinished] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const getFirstDestination = () => {
        const firstDestination = destinations.find(destination => destination[0].arrived === false);
        if (!firstDestination) {
            setDisabled(true);
        }
        setFirstDestination(firstDestination);
    }

    React.useEffect(() => {
        destinations.forEach(destination => {
            if (destination[0].arrived === false) {
                setFinished(false);
                return;
            }
        });
        getFirstDestination();
    }, [destinations]);

    if (destinations != null && destinations.length > 0 && !finished) {
        return (
            <View style={styles.bottomPopupContainerNoPadding}>
                <TouchableWithoutFeedback style={styles.bottomPopupExpander} onPress={() => setExpanded(!expanded)}>
                    <View style={styles.bottomPopupLine}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.van.routes}>
                    <View style={[styles.flex, { paddingHorizontal: 30, paddingBottom: 10 }]}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        {firstDestination ?
                             destination == null ? <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"80%"} /> :
                                <>
                                    <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"35%"} disabled={disabled} />
                                    <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"35%"} />
                                </> :   
                        <View style={styles.flex}>
                            <Text style={styles.subTitle}>No more destinations</Text>
                        </View>}
                    </View>
                    {expanded == true ?
                        <FlatList style={{ maxHeight: 400, display: "flex" }}
                            data={destinations}
                            renderItem={({ item }) => <RouteDescription destination={item} allDestionations={destinations} setDestinations={setDestinations} update={getFirstDestination} />}
                        /> :
                        <RouteDescription destination={firstDestination} allDestionations={destinations} setDestinations={setDestinations} update={getFirstDestination} />
                    }
                </View>
            </View>
        );
    } else if (destination != null) {
        return (
            <View style={styles.bottomPopupContainerNoPadding}>
                <View style={styles.bottomPopupExpander}>
                    <View style={styles.bottomPopupLine}>
                    </View>
                </View>
                <View style={styles.van.routes}>
                    <View style={[styles.flex, { paddingHorizontal: 30 }]}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"80%"} />
                    </View>
                </View>
            </View>
        );
    }
}

export default Routes;