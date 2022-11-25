import { Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = { latitude: 33.872951, longitude: 35.514698, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };

export default INITIAL_POSITION;