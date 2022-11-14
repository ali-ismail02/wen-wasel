import styles from "../../styles/styles";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

const Main = () => {
    const [userState, setUserState] = useState("none");
    const [allUserStates, setAllUserStates] = useState(["none"]);

    const components = {
        none: <></>,
    }

    const setState = (state) => {
        setUserState(state);
        setAllUserStates([...allUserStates, state]);
    }

    return (
        <View>
            {components[userState]}
        </View>
    );
};

export default Main;