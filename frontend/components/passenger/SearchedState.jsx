import { View } from "react-native";
import Button from "../Button";
import CustomSlider from "../CustomSlider";
import getRoutes from "../../hooks/passenger/GetRoutes";

const SearchedState = ({ setState, setPaths, style, slider_value, setSliderValue, colorScheme, location, destination }) => {

    // handling ride type selection
    const rideSelect = async () => {
        setPaths(await getRoutes(location.latitude + "," + location.longitude, destination.latitude + "," + destination.longitude, slider_value[0]));
        setState("rideSelected");
    }

    return (
        <View style={style.bottomPopupContainer}>
            <CustomSlider slider_value={slider_value} setSliderValue={setSliderValue} style={style} colorScheme={colorScheme} />
            <Button text="Next" onPress={rideSelect} width={"100%"} color={"#FF9E0D"} style={style} />
        </View>
    )
}

export default SearchedState;