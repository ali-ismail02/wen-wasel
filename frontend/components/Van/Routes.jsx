import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import styles from '../../styles/styles';
import Button from '../Button';
import ExpandableView from './ExpandableView';
import RouteDescription from './RouteDescription';


const Routes = ({ destination, destinations, setState, setDestinations }) => {
    const [expanded, setExpanded] = useState(false);
    // get first destination from destinations where arrived is false
    const [firstDestination, setFirstDestination] = useState(destinations.find(destination => destination[0].arrived === false));
    const [finished, setFinished] = useState(true);

    React.useEffect(() => {
        const getFirstDestination = () => {
            const firstDestination = destinations.find(destination => destination[0].arrived === false);
            setFirstDestination(firstDestination);
        }
        destinations.forEach(destination => {
            if(destination[0].arrived === false){
                setFinished(false);
                return;
            }
        });
        getFirstDestination();
    }, [destinations]);

    if (destinations != null && destinations.length > 0 && !finished) {
        return (
            <View style={styles.bottomPopupContainerNoPadding}>
                <TouchableWithoutFeedback style={styles.bottomPopupExpander} onPress={() => setExpanded(true)}>
                    <View style={styles.bottomPopupLine}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.van.routes}>
                    <View style={[styles.flex, {paddingHorizontal: 30, paddingBottom:10}]}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        {destination == null ? <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"80%"} /> :
                            <>
                                <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"35%"} />
                                <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"35%"} />
                            </>
                        }
                    </View>
                    {expanded == true ? <ExpandableView expanded={expanded} routes={destinations} /> :
                        <RouteDescription destination={firstDestination} setDestinations={setDestinations} allDestionations={destinations} />}
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
                    <View style={[styles.flex, {paddingHorizontal:30}]}>
                        <Text style={styles.subTitle}>Routes:</Text>
                        <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"80%"} />
                    </View>
                </View>
            </View>
        );
    }
}

export default Routes;