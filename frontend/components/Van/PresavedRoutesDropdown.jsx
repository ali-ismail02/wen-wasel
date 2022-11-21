import React, {useEffect, useState} from 'react';
import { Image, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import BuildRecurringRoutePath from "../../hooks/van/BuildRecurringRoutePath";
import Button from "../Button";

const PresavedRoutesDropdown = ({ presaved_routes, setAllDestinations, setUserState, style }) => {
    const [selected_route, setSelectedRoute] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [dropdown_style, setDropdownStyle] = useState({});
    const [names, setNames] = useState([]);

    useEffect(() => {
        const namesTemp = [];
        for (let i = 0; i < presaved_routes.length; i++) {
            namesTemp.push(presaved_routes[i].presaved_route.name);
        }
        setNames(namesTemp);
        const styleTemp = {
            maxHeight: 200,
            height: namesTemp.length * 40 + 50,
            ...style.dropdownStyle,
        };
        setDropdownStyle(styleTemp);
    }, [presaved_routes]);

    const startRoute = async () => {
        BuildRecurringRoutePath(selected_route, setAllDestinations);
        setUserState("destinationsSet");
    }



    return (
        <View style={style.bottomPopupContainerNoPadding}>
            <View style={[style.flex, { paddingHorizontal: 30, paddingVertical: 10, borderBottomColor: "#DDD", borderBottomWidth: 1 }]}>
                <Text style={style.subTitle}>Presaved Routes:</Text>
                <SelectDropdown
                    data={names}
                    onSelect={(selectedItem, index) => {
                        setSelectedRoute(presaved_routes[index]);
                        setDisabled(false);
                    }}
                    dropdownStyle={dropdown_style}
                    rowStyle={style.dropdownRow}
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
                <Button text="Start Route" onPress={startRoute} color={"#FF9E0D"} width={"100%"} disabled={disabled} style={style} />
            </View>
        </View>
    );
}

export default PresavedRoutesDropdown;