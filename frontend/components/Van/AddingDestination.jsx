import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from '../../styles/styles';
import SelectDropdown from 'react-native-select-dropdown'
import AddOneTimeRoute from '../../hooks/van/AddOneTimeRoute';
import Button from '../Button';

const AddingDestination = ({ setDestinations, setState, destination }) => {
    const [minutes, setMinutes] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);

    const addDestination = async () => {
        // get time and date after adding mins
        let date = new Date();
        date.setMinutes(date.getMinutes() + minutes);
        let time = date.toLocaleTimeString();
        let dateStr = date.toLocaleDateString();
        const response = await AddOneTimeRoute(destination, dateStr + " " + time);
        if (response) {
            destination.id = response;
            const dest = { latitude: destination.latitude, longitude:destination.longitude, id: response };
            setDestinations(dest, dateStr + " " + time);
            setState("destinationsSet");
            return;
        }
    }


    const mins = new Array(60).fill(1).map((_, i) => i);
    return (
        <View style={styles.bottomPopupContainer}>
            <Text style={styles.instructions}>Please press on the mins menu and choose how many minutes are left till you arrive at your route </Text>
            <View style={styles.flex}>
                <Image style={{ width: 50, height: 30 }} source={require('../../assets/images/van.png')} />
                <Image style={{ width: 50, height: 20 }} source={require('../../assets/images/3dots.png')} />
                <Image style={{ width: 30, height: 35 }} source={require('../../assets/images/waypoint.png')} />
                <SelectDropdown data={mins}
                    onSelect={(selectedItem, index) => {
                        setMinutes(selectedItem);
                        setDisabled(false);
                    }}
                    buttonStyle={styles.selectButton}
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
            <View style={[styles.flex, {paddingTop:10}]}>
                <Button text="Cancel" onPress={() => setState("destinationsSet")} color={"black"} width={"47%"} />
                <Button text="Add" onPress={addDestination} color={"#FF9E0D"} width={"47%"} disabled={disabled}/>
            </View>
        </View>
    );
}

export default AddingDestination;