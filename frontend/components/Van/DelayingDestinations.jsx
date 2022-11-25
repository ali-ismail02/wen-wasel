import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Entypo from 'react-native-vector-icons/Entypo';
import FA from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SortPath from '../../hooks/van/SortPath';
import UpdateOneTimeRoute from '../../hooks/van/UpdateOneTimeRoute';
import Button from '../Button';

const DelayingDestinations = ({ setDestinations, setState, destinations, style, colorScheme }) => {
    const mins = new Array(60).fill(1).map((_, i) => i);
    const [minutes, setMinutes] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);
    const [color, setColor] = React.useState("black");

    useEffect(() => {
        colorScheme == "dark" ? setColor("white") : setColor("black");
    }, [colorScheme]);


    const delayAllDestinations = async () => {
        // loop through destinations and update time for each one
        for (let i = 0; i < destinations.length; i++) {
            const date = new Date(destinations[i][1]);
            const date2 = new Date(date.getTime() + minutes * 60000);
            let time = date2.toLocaleTimeString();
            let dateStr = date2.toLocaleDateString();
            destinations[i][1] = dateStr + " " + time;
            const response = await UpdateOneTimeRoute(destinations[i][0].id, dateStr + " " + time);
        }
        // sort destinations by time
        setDestinations(SortPath(destinations));
        // close popup
        setState("destinationsSet");
    }

    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.instructions}>Please press on the mins menu and choose how many minutes are left till you arrive at your route </Text>
            <View style={style.flex}>
                <Icon name="shuttle-van" size={30} color={color} />
                <Entypo name="dots-three-horizontal" size={30} color={color} />
                <FA name="hourglass-2" size={30} color={color} />
                <SelectDropdown data={mins}
                    onSelect={(selectedItem, index) => {
                        setMinutes(selectedItem);
                        setDisabled(false);
                        delayAllDestinations
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
                <Button text="Delay" onPress={delayAllDestinations} color={"#FF9E0D"} width={"47%"} disabled={disabled} style={style} />
            </View>
        </View>
    );
}

export default DelayingDestinations;