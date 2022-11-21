import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from '../Button';
import RouteDescription from './RouteDescription';

const Routes = ({ destination, destinations, setState, setDestinations, style, colorScheme }) => {
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
            <View style={style.bottomPopupContainerNoPadding}>
                <TouchableWithoutFeedback style={style.bottomPopupExpander} onPress={() => setExpanded(!expanded)}>
                    <View style={style.bottomPopupLine}>
                    </View>
                </TouchableWithoutFeedback>
                <View style={style.van.routes}>
                    <View style={[style.flex, { paddingHorizontal: 30, paddingBottom: 10 }]}>
                        <Text style={style.subTitle}>Routes:</Text>
                        {destination == null ?
                            firstDestination && <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"80%"} style={style} /> :
                            firstDestination ? <>
                                <Button text="Delay" onPress={() => setState("delaying")} color={"black"} width={"35%"} style={style} />
                                <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"35%"} style={style} />
                            </> :
                                <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"80%"} style={style} />
                        }
                    </View>
                    {expanded == true ?
                        <FlatList style={{ maxHeight: 400, display: "flex" }}
                            data={destinations}
                            renderItem={({ item }) => <RouteDescription destination={item} allDestionations={destinations} setDestinations={setDestinations} update={getFirstDestination} style={style} colorScheme={colorScheme} />}
                        /> :
                        firstDestination != undefined ?
                            <RouteDescription destination={firstDestination} allDestionations={destinations} setDestinations={setDestinations} update={getFirstDestination} style={style} colorScheme={colorScheme} /> :
                            <View style={style.van.routeDescription}>
                                <Text style={[style.subTitle, { width: "100%", textAlign: "center" }]}>No more destinations</Text>
                            </View>
                    }
                </View>
            </View>
        );
    } else if (destination != null) {
        return (
            <View style={style.bottomPopupContainerNoPadding}>
                <View style={style.bottomPopupExpander}>
                    <View style={style.bottomPopupLine}>
                    </View>
                </View>
                <View style={style.van.routes}>
                    <View style={[style.flex, { paddingHorizontal: 30 }]}>
                        <Text style={style.subTitle}>Routes:</Text>
                        <Button text="Add Route" onPress={() => setState("addingRoute")} color={"#FF9E0D"} width={"80%"} style={style} />
                    </View>
                </View>
            </View>
        );
    }
}

export default Routes;