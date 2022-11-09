import { ScrollView, Image, View, Text, TouchableOpacity } from "react-native";

const UserRouteOptions = ({ routes }) => {
    return (
        <ScrollView horizontal={true} style={{ height: 100 }}>
        {routes.map((route) => {
            return (
            <TouchableOpacity>
                <UserRouteOption route={route} />
            </TouchableOpacity>
            );
        })}
        </ScrollView>
    );
}