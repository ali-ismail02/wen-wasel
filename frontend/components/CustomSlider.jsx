import Slider from "react-native-community/slider";

const CustomSlider = () => {
    return (
        <View style={styles.sliderContainer}>
            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={3}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                step={1}
            />
        </View>
    );
};

export default CustomSlider;