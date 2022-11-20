import { View, Text } from "react-native";
import Button from "../Button";
import { moveTo } from "../../hooks/CameraChange";

const PathSelectedState = ({ style, setState, setCenterMap, location, mapRef }) => {

    // handling path confirmation
    const onPathConfirm = () => {
        setState("pathConfirmed");
        setCenterMap(true);
        moveTo(location.coords, mapRef, 18);
    }

    return (
    <View style={style.bottomPopupContainer}>
        <Text style={style.instructions}>Confirm your route?</Text>
        <Button text="Confirm Route" onPress={onPathConfirm} width={"100%"} color={"#FF9E0D"} style={style} />
    </View>)
}

export default PathSelectedState;