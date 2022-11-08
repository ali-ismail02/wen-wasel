import React from 'react';
import {Slider} from '@miblanchard/react-native-slider';
import {AppRegistry, StyleSheet, View, Text} from 'react-native';
import styles from '../styles/styles';

const CustomSlider = ({sliderValue, setSliderValue}) => {
    return (
        <View style={styles.sliderContainer}>
            <Slider
                minimumValue={1}
                maximumValue={3}
                value={sliderValue}
                onValueChange={value => setSliderValue(value)}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#FFFFFF"
                step={1}
            />
        </View>
    );
};

export default CustomSlider;