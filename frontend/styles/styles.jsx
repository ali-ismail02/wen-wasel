import { StyleSheet,Dimensions } from "react-native";

export default StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        },
        map: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        },
      });