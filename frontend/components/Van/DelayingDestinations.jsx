import { View, Text, Image, Appearance } from 'react-native';
import React, {useState, useEffect} from 'react';
import styles from '../../styles/styles';
import SelectDropdown from 'react-native-select-dropdown'
import UpdateOneTimeRoute from '../../hooks/van/UpdateOneTimeRoute';
import Button from '../Button';
import SortPath from '../../hooks/van/SortPath';

const DelayingDestinations = ({ setDestinations, setState, destinations }) => {
    const [minutes, setMinutes] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);
    const mins = new Array(60).fill(1).map((_, i) => i);
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    const delayAllDestinations = async () => {
        for (let i = 0; i < destinations.length; i++) {
            const date = new Date(destinations[i][1]);
            const date2 = new Date(date.getTime() + minutes * 60000);
            let time = date2.toLocaleTimeString();
            let dateStr = date2.toLocaleDateString();
            destinations[i][1] = dateStr + " " + time;
            const response = await UpdateOneTimeRoute(destinations[i][0].id, dateStr + " " + time);
        }
        setDestinations(SortPath(destinations));
        setState("destinationsSet");
    }

    return (
        <View style={style.bottomPopupContainer}>
            <Text style={style.instructions}>Please press on the mins menu and choose how many minutes are left till you arrive at your route </Text>
            <View style={style.flex}>
                {colorScheme != "dark" ? <>
                    <Image style={{ width: 50, height: 30 }} source={require('../../assets/images/van.png')} />
                    <Image style={{ width: 50, height: 20 }} source={require('../../assets/images/3dots.png')} />
                    <Image style={{ width: 30, height: 35 }} source={require('../../assets/images/hourglass.png')} />
                </> : <>
                    <Image style={{ width: 50, height: 30 }} source={require('../../assets/images/van_dark.png')} />
                    <Image style={{ width: 50, height: 20 }} source={require('../../assets/images/3dots_dark.png')} />
                    <Image style={{ width: 30, height: 35 }} source={require('../../assets/images/hourglass_dark.png')} />
                </>}
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
            <View style={[style.flex, {paddingTop: 10}]}>
                    <Button text="Cancel" onPress={() => setState("destinationsSet")} color={"black"} width={"47%"} />
                    <Button text="Delay" onPress={delayAllDestinations} color={"#FF9E0D"} width={"47%"} disabled={disabled} />
                </View>
        </View>
    );
}

export default DelayingDestinations;