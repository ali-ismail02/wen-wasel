import { Slider } from '@miblanchard/react-native-slider';
import React, { useState, useEffect } from 'react';
import { Text, View, Appearance } from 'react-native';
import styles from '../styles/styles';

const CustomSlider = ({sliderValue, setSliderValue}) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [style, setStyle] = useState(styles.light);
    
    Appearance.addChangeListener(({ colorScheme }) => {
        setColorScheme(colorScheme);
        {}
    });

    useEffect(() => {
        {colorScheme == 'dark' ? setStyle(styles.dark) : setStyle(styles.light)}
    }, [colorScheme]);

    return (
        <>
            <Text style={style.instructions}>Please select your desired trip type:</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width:50}}>
                    <Text style={[style.instructions,{textAlign: 'left'}]}>Service</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={[style.instructions,{textAlign: 'center'}]}>Van</Text>
                </View>
                <View style={{width:50}}>
                    <Text style={[style.instructions,{textAlign: 'right'}]}>Any</Text>
                </View>
            </View>
            <Slider
                minimumValue={1}
                maximumValue={3}
                value={sliderValue}
                onValueChange={value => setSliderValue(value)}
                minimumTrackTintColor={colorScheme == 'dark' ? '#555' : '#000000'}
                maximumTrackTintColor={colorScheme == 'dark' ? '#FFFFFF' : '#000000'}
                animateTransitions={true}
                renderTrackMarkComponent={() => <View style={style.sliderMark} />}
                trackMarks={[1, 2, 3]}
                thumbTintColor={colorScheme == 'dark' ? '#555' : '#000000'}
                animationType="timing"
                animationConfig={{duration: 1000}}
                thumbTouchSize={{width: 50, height: 50}}
                step={1}
            />
        </>
    );
};

export default CustomSlider;