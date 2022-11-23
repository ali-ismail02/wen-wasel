import { View } from "react-native";
import CenterMapButton from "../CenterMapButton";
import { centerScreen } from "../../hooks/CameraChange";
import { moveTo } from "../../hooks/CameraChange";
import Search from "../Search";

const BaseState = ({ style, setState, setSearchResult, setDestination, mapRef, location, setCenterMap, center_map }) => {

    // handling place selection from search or map
    const onPlaceSelect = (details) => {
        const position = {
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
        }
        setSearchResult(position)
        setDestination(position);
        centerScreen(location, position, mapRef);
        setCenterMap(false);
        setState("searched");
    }

    return (<>
        <View style={style.searchContainer}>
            <Search onPlaceSelect={(details) => onPlaceSelect(details)} style={style} />
        </View>
        <CenterMapButton setCenterMap={setCenterMap}
            moveTo={moveTo}
            mapRef={mapRef}
            location={location}
            style={style}
            center_map={center_map}
        />
    </>)
}

export default BaseState;