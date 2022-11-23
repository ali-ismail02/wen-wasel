import { View } from "react-native";

const SliderMarker = ({ value, sliderValue, style }) => {
    console.log(value, sliderValue[0]);
    if(value < sliderValue[0]) {
        return (
            <View style={[style.sliderMark, {backgroundColor:"#FF9E0D"}]} />
        );
    }
    return (
        <View style={style.sliderMark} />
    );
};

export default SliderMarker;