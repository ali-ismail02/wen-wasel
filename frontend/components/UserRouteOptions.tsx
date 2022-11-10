import { View } from "react-native";
import UserRouteOption from "./UserRouteOption";
import styles from "../styles/styles";
import { FlatList } from "react-native-gesture-handler";

const UserRouteOptions = ({ routes, onPress }) => {
    return (
        // flatlist of routes from UserRouteOption
        <FlatList style={styles.scrollViewBottom}
        data={routes}
        // render each route with UserRouteOption with onPress
        renderItem={({ item }) => <UserRouteOption route={item} onPress = {() => {onPress(item)}} />}
        />
    );
}

export default UserRouteOptions;