import SelectDropdown from "react-native-select-dropdown";
import styles from "../../styles/styles";
import BuildRecurringRoutePath from "../../hooks/van/BuildRecurringRoutePath";
import { View, Text, Image, Appearance} from "react-native";
import Button from "../Button";
import React, { useState, useEffect } from 'react';

const PresavedRoutesDropdown = ({ presaved_routes, setAllDestinations, setUserState }) => {
    const [selectedRoute, setSelectedRoute] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    const startRoute = async () => {
        BuildRecurringRoutePath(selectedRoute, setAllDestinations);
        setUserState("destinationsSet");
    }

    names = [];
    for (let i = 0; i < presaved_routes.length; i++) {
        names.push(presaved_routes[i].presaved_route.name);
    }
    return (
        <View style={style.bottomPopupContainerNoPadding}>
            <View style={[style.flex, { paddingHorizontal: 30, paddingVertical: 10, borderBottomColor:"#DDD", borderBottomWidth:1 }]}>
                <Text style={style.subTitle}>Presaved Routes:</Text>
                <SelectDropdown
                    rowStyle={style.dropdownRow}
                    data={names}
                    onSelect={(selectedItem, index) => {
                        setSelectedRoute(presaved_routes[index]);
                        setDisabled(false);
                    }}
                    buttonStyle={style.selectButtonRoutes}
                    selectedRowTextStyle={style.dropdownRowText}
                    rowTextStyle={style.dropdownRowText}
                    buttonTextStyle={style.dropdownRowText}
                    searchInputStyle={style.dropdownSearchInput}
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
            <View style={[style.flex, { paddingHorizontal: 30, paddingVertical: 10 }]}>
                <Button text="Start Route" onPress={startRoute} color={"#FF9E0D"} width={"100%"} disabled={disabled}/>
            </View>
        </View>
    );
}

export default PresavedRoutesDropdown;