import { View, Text } from "react-native";
import UserRouteOption from "./UserRouteOption";
import styles from "../../styles/styles";
import { FlatList } from "react-native-gesture-handler";

const UserRouteOptions = ({ routes, onPress }) => {
    return (
        <View style={styles.bottomPopupContainer}>
            <Text style={styles.subTitle}>Routes:</Text>
            <FlatList style={styles.flatList}
                data={routes}
                // render each route with UserRouteOption with onPress
                renderItem={({ item }) => <UserRouteOption route={item} onPress={() => { onPress(item) }} />}
            />
        </View>
    );
}

export default UserRouteOptions;