import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
const colors = {
  dark: {
    color: "white",
    backgroundColor: "#1E1E1E",
    borderColor: "#888",
    shadowColor: "#777",
  },
  light: {
    color: "black",
    backgroundColor: "white",
    borderColor: "#888",
    shadowColor: "#777",
  }
}

export default StyleSheet.create({
  dark: {
    main: {
      height: Dimensions.get("window").height - 300,
      backgroundColor: colors.dark.backgroundColor,
    },
    container: {
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      paddingLeft: 5,
      height: Dimensions.get("window").height - 150,
    },
    switchContainer: {
      paddingLeft: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    switchText: {
      fontSize: 14,
    },
    topSection: {
      backgroundColor: colors.dark.backgroundColor,
      padding: 10,
      paddingTop: Dimensions.get("window").height * 0.08,
      flexDirection: 'row'
    },
    divider: {
      height: 30
    },
    nameContainer: {
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      marginLeft: 15
    },
    imageProfile: {
      borderRadius: 50,
      width: 50,
      height: 50,
      aspectRatio: 1,
      borderColor: colors.dark.borderColor,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.dark.color,
    },
    caption: {
      marginTop: 5,
      fontSize: 14,
      color: colors.dark.color,
    }
  },
  light: {
    main: {
      height: Dimensions.get("window").height - 300,
      backgroundColor: colors.light.backgroundColor,
    },
    container: {
      backgroundColor: colors.light.backgroundColor,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "100%",
      paddingLeft: 5,
      height: Dimensions.get("window").height - 300,
    },
    switchContainer: {
      paddingLeft: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    switchText: {
      fontSize: 14,
    },
    topSection: {
      backgroundColor: colors.light.backgroundColor,
      padding: 10,
      paddingTop: Dimensions.get("window").height * 0.08,
      flexDirection: 'row'
    },
    divider: {
      height: 30
    },
    nameContainer: {
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
      marginLeft: 15
    },
    imageProfile: {
      borderRadius: 50,
      width: 50,
      height: 50,
      aspectRatio: 1,
      borderColor: colors.light.borderColor,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.light.color,
    },
    caption: {
      marginTop: 5,
      fontSize: 14,
      color: colors.light.color,
    }
  },

});
