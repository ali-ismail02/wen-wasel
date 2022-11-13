import { Slider } from '@miblanchard/react-native-slider';
import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles/styles';

const CustomSlider = ({sliderValue, setSliderValue}) => {
    return (
        <>
            <Text style={[styles.instructions, {paddingBottom: 10}]}>Please select your desired trip type:</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width:50}}>
                    <Text style={{textAlign: 'left'}}>Service</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={{textAlign: 'center'}}>Van</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={{textAlign: 'right'}}>Any</Text>
                </View>
            </View>
            <Slider
                minimumValue={1}
                maximumValue={3}
                value={sliderValue}
                onValueChange={value => setSliderValue(value)}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#DDDDDD"
                animateTransitions={true}
                renderTrackMarkComponent={() => <View style={styles.sliderMark} />}
                trackMarks={[1, 2, 3]}
                animationType="timing"
                animationConfig={{duration: 1000}}
                thumbTouchSize={{width: 50, height: 50}}
                step={1}
            />
        </>
    );
};

export default CustomSlider;