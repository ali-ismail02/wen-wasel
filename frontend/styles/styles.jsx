import { StyleSheet,Dimensions } from "react-native";
import Constants from 'expo-constants';
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
          height: "100%",
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
        },
        center: {
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: 50,
          elevation: 5,
          zIndex: 100,
          backgroundColor: "red",
        },
        centerImage: {
          width: 50,
          height: 50,
          borderRadius: 50,
        },
      });