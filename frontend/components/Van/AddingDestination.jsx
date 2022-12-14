import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import AddOneTimeRoute from '../../hooks/van/AddOneTimeRoute';
import Button from '../Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';

const AddingDestination = ({ setDestinations, setState, destination, style, colorScheme }) => {
    const [minutes, setMinutes] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);
    const [color, setColor] = React.useState("black");

    useEffect(() => {
        colorScheme == "dark" ? setColor("white") : setColor("black");
    }, [colorScheme]);

    const addDestination = async () => {
        // get time and date after adding mins
        let date = new Date();
        date.setMinutes(date.getMinutes() + minutes);
        let time = date.toLocaleTimeString();
        let dateStr = date.toLocaleDateString();
        const response = await AddOneTimeRoute(destination, dateStr + " " + time);
        if (response) {
            const dest = { latitude: destination.latitude, longitude: destination.longitude, id: response, arrived: false };
            setDestinations(dest, dateStr + " " + time);
            setState("destinationsSet");
            return;
        }
    }


    const mins = new Array(60).fill(1).map((_, i) => i);
    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.instructions}>Please press on the mins menu and choose how many minutes are left till you arrive at your route </Text>
            <View style={style.flex}>
                <Icon name="shuttle-van" size={30} color={color} />
                <Entypo name="dots-three-horizontal" size={30} color={color} />
                <Feather name="map-pin" size={30} color={color} />
                <SelectDropdown data={mins}
                    onSelect={(selectedItem, index) => {
                        setMinutes(selectedItem);
                        setDisabled(false);
                    }}
                    selectedRowTextStyle={style.dropdownRowText}
                    rowTextStyle={style.dropdownRowText}
                    buttonTextStyle={style.dropdownRowText}
                    searchInputStyle={style.dropdownSearchInput}
                    buttonStyle={style.selectButton}
                    rowStyle={style.dropdownRow}
                    dropdownIconPosition={"right"}
                    search={true}
                    searchPlaceHolder="Search"
                    defaultButtonText="Mins"
                    renderDropdownIcon={() => {
                        return (
                            <Image style={{ width: 20, height: 20 }} source={require('../../assets/images/arrowup.webp')} />
                        )
                    }}

                />
            </View>
            <View style={[style.flex, { paddingTop: 10 }]}>
                <Button text="Cancel" onPress={() => setState("destinationsSet")} color={"black"} width={"47%"} style={style} />
                <Button text="Add" onPress={addDestination} color={"#FF9E0D"} width={"47%"} disabled={disabled} style={style} />
            </View>
        </View>
    );
}

export default AddingDestination;