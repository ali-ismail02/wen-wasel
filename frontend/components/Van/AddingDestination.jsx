import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from '../../styles/styles';
import SelectDropdown from 'react-native-select-dropdown'

const AddingDestination = ({ setDestinations, setState, destination }) => {
    const mins = new Array(60).fill(0).map((_, i) => i);
    return (
        <View style={styles.bottomPopupContainer}>
            <Text style={styles.instructions}>Please press on the mins menu and choose how many minutes are left till you arrive at your route </Text>
            <View style={styles.flex}>
                <Image style={{ width: 50, height: 30 }} source={require('../../assets/images/van.png')} />
                <Image style={{ width: 50, height: 20 }} source={require('../../assets/images/3dots.png')} />
                <Image style={{ width: 30, height: 35 }} source={require('../../assets/images/waypoint.png')} />
                <SelectDropdown data = {mins} 
                    onSelect={(selectedItem, index) => { 
                        // get time and date after adding mins
                        let date = new Date();
                        date.setMinutes(date.getMinutes() + selectedItem);
                        let time = date.toLocaleTimeString();
                        let dateStr = date.toLocaleDateString();
                        setDestinations(destination,dateStr + " " + time );
                        setState("destinationsSet");
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
        </View>
    );
}

export default AddingDestination;