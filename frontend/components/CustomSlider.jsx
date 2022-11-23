import { Slider } from '@miblanchard/react-native-slider';
import React from 'react';
import { Text, View } from 'react-native';
import SliderMarker from './SliderMarker';

const CustomSlider = ({slider_value, setSliderValue, style, colorScheme}) => {
    return (
        <>
            <Text style={style.instructions}>Please select your desired trip type:</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width:50}}>
                    <Text style={[style.instructionsSlider,{textAlign: 'left'}]}>Cab</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={[style.instructionsSlider,{textAlign: 'center'}]}>Bus</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={[style.instructionsSlider,{textAlign: 'right'}]}>Any</Text>
                </View>
            </View>
            <Slider
                minimumValue={1}
                maximumValue={3}
                value={slider_value}
                onValueChange={value => setSliderValue(value)}
                minimumTrackTintColor={colorScheme == 'dark' ? '#FF9E0D' : '#FF9E0D'}
                maximumTrackTintColor={colorScheme == 'dark' ? '#666' : '#CCC'}
                animateTransitions={true}
                renderTrackMarkComponent={(index) => <SliderMarker value={index} sliderValue={slider_value} style={style} />}
                trackMarks={[1, 2, 3]}
                thumbTintColor={colorScheme == 'dark' ? '#FF9E0D' : '#FF9E0D'}
                animationType="timing"
                animationConfig={{duration: 1000}}
                thumbTouchSize={{width: 50, height: 50}}
                step={1}
            />
        </>
    );
};

export default CustomSlider;