import SelectDropdown from "react-native-select-dropdown";
import styles from "../../styles/styles";
import BuildRecurringRoutePath from "../../hooks/van/BuildRecurringRoutePath";
import { View, Text, Image } from "react-native";
import Button from "../Button";
import React from "react";

const PresavedRoutesDropdown = ({ presaved_routes, setAllDestinations, setUserState }) => {
    const [selectedRoute, setSelectedRoute] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);

    const startRoute = async () => {
        BuildRecurringRoutePath(selectedRoute, setAllDestinations);
        setUserState("destinationsSet");
    }

    names = [];
    for (let i = 0; i < presaved_routes.length; i++) {
        names.push(presaved_routes[i].presaved_route.name);
    }
    return (
        <View style={styles.bottomPopupContainerNoPadding}>
            <View style={[styles.flex, { paddingHorizontal: 30, paddingVertical: 10, borderBottomColor:"#DDD", borderBottomWidth:1 }]}>
                <Text style={styles.subTitle}>Presaved Routes:</Text>
                <SelectDropdown
                    data={names}
                    onSelect={(selectedItem, index) => {
                        setSelectedRoute(presaved_routes[index]);
                        setDisabled(false);
                    }}
                    buttonStyle={styles.selectButtonRoutes}
                    dropdownIconPosition={"right"}
                    search={true}
                    searchPlaceHolder="Search"
                    defaultButtonText="Routes"
                    renderDropdownIcon={() => {
                        return (
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require("../../assets/images/arrowup.webp")}
                            />
                        );
                    }}
                />
            </View>
            <View style={[styles.flex, { paddingHorizontal: 30, paddingVertical: 10 }]}>
                <Button text="Start Route" onPress={startRoute} color={"#FF9E0D"} width={"100%"} disabled={disabled}/>
            </View>
        </View>
    );
}

export default PresavedRoutesDropdown;