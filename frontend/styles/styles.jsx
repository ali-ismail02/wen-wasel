import { StyleSheet,Dimensions } from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          height: ScreenHeight,
        },
        map: {
          width: ScreenWidth,
          height: ScreenHeight,
        },
        searchContainer: {
          position: 'absolute',
          top: 20,
          left: ScreenWidth*0.05,
          width: "90%",
          backgroundColor: "white",
          shadowColor: "black",
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.5, 
          elevation: 4,
          padding: 8,
          borderRadius: 8,
        },
        input: {
          borderColor: "#888",
          borderWidth: 1,
        }
      });