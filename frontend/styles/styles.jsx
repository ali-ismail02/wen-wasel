import { Dimensions, StyleSheet } from "react-native";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
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

  // Login Styles
  login: {
    container: {
      width: ScreenWidth,
      height: ScreenHeight,
      paddingHorizontal: 0,
      display: "flex",
    },
    backgroundImage: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: ScreenWidth,
      height: ScreenHeight,
      paddingHorizontal: "5%",
      paddingVertical: "10%",
    },
    view: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
    },
    label: {
      width: "100%",
      color: "white",
      fontSize: 12,
    },
    logo: {
      width: 200,
      height: 200,
    },
    input: {
      width: "100%",
      height: 50,
      backgroundColor: "white",
      borderRadius: 5,
      borderColor: "#888",
      borderWidth: 2,
      paddingHorizontal: 20,
      fontSize: 20,
      marginVertical: 5,
    },
    links: {
      width: "100%",
      textAlign: "center",
      color: "white",
      fontSize: 12,
      paddingTop: 5,
    },
    redLabel: {
      color: "red",
      fontSize: 14,
      textAlign: "center"
    },
    dropdown: {
      width: "100%",
      height: 50,
      backgroundColor: "white",
      borderRadius: 5,
      borderColor: "#888",
      borderWidth: 1,
      fontSize: 20,
      marginVertical: 5,
      position: "relative",
    },
    image: {
      width: ScreenWidth * 0.9,
      height: ScreenHeight * 0.3,
      resizeMode: "contain",
    },
    title: {
      width: "100%",
      fontSize: 32,
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
    },
    dropdownStyle: {
      marginTop: -53,
    },
  },
  dark: {
    // Utility Styles
    container: {
      flex: 1,
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
      left: ScreenWidth * 0.05,
      width: "90%",
      backgroundColor: colors.dark.backgroundColor,
      shadowColor: colors.dark.shadowColor,
      shadowOpacity: 0.5,
      elevation: 4,
      borderRadius: 8,
    },
    input: {
      borderColor: colors.dark.borderColor,
      borderWidth: 1,
      backgroundColor: colors.dark.backgroundColor,
      color: colors.dark.color,
      margin: 0,
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: colors.dark.borderColor,
    },
    predefinedPlacesDescription: {
      backgroundColor: colors.dark.backgroundColor,
      color: colors.dark.color,
    },
    bottomPopupContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      paddingHorizontal: 30,
      paddingVertical: 10,
      width: ScreenWidth,
      height: "auto",
      elevation: 5,
      zIndex: 100,
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      maxHeight: ScreenHeight * 0.4,
    },
    flex: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    instructions: {
      fontSize: 14,
      color: colors.dark.color,
      paddingBottom: 10,
    },
    subTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.dark.color,
      paddingBottom: 5,
    },
    subTitleWithBorder: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.dark.color,
      width: "100%",
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.dark.borderColor,
    },
    flatList: {
      width: "100%",
      height: "100%",
      maxHeight: ScreenHeight * 0.4
    },
    bottomPopupExpander: {
      height: 20,
      width: "100%",
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 7.5,
      borderBottomColor: colors.dark.borderColor,
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    bottomPopupLine: {
      width: 50,
      height: 5,
      backgroundColor: colors.dark.borderColor,
      borderRadius: 5,
    },
    bottomPopupContainerNoPadding: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: ScreenWidth,
      height: "auto",
      elevation: 5,
      zIndex: 100,
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      maxHeight: ScreenHeight * 0.4,
    },
    selectButton: {
      width: 100,
      height: 50,
      backgroundColor: colors.dark.backgroundColor,
      borderRadius: 5,
      borderColor: colors.dark.borderColor,
      borderWidth: 1,
    },
    selectButtonRoutes: {
      width: 150,
      height: 40,
      backgroundColor: colors.dark.backgroundColor,
      borderRadius: 5,
      borderColor: colors.dark.borderColor,
      borderWidth: 1,
    },
    dropdownRow: {
      height: 40,
      width: "100%",
      color: colors.dark.color,
      backgroundColor: colors.dark.backgroundColor,
      borderColor: colors.dark.borderColor,
    },
    dropdownRowText: {
      color: colors.dark.color,
    },
    dropdownSearchInput: {
      width: "100%",
      height: 50,
      backgroundColor: colors.dark.backgroundColor,
      color: colors.dark.color,
      borderBottomColor: colors.dark.borderColor,
      borderBottomWidth: 1,
    },
    dropdownStyle: {
      backgroundColor: colors.dark.backgroundColor,
    },
    // Center Button Styles
    center: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 50,
      elevation: 5,
      zIndex: 100,
    },
    centerImage: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    // Slider Styles
    sliderMark: {
      width: 20,
      height: 20,
      backgroundColor: "#666",
      borderRadius: 20,
    },
    // Button Styles
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 3
    },
    buttonText: {
      color: colors.dark.color,
      fontSize: 20,
    },
    // User Route Option Styles
    routeOption: {
      width: "100%",
      padding: 10,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    RouteFormat: {
      borderTopColor: colors.dark.borderColor,
      borderTopWidth: 1,
      paddingRight: 10,
    },
    borderBottom: {
      borderBottomColor: colors.dark.borderColor,
      borderBottomWidth: 1,
    },
    routeOptionPrice: {
      color: colors.dark.color,
      fontSize: 16,
      fontWeight: "bold",
    },
    routeOptionInformation: {
      display: "flex",
      alignItems: "flex-start",
      paddingVertical: 13,
      paddingHorizontal: 10,
    },
    routeOptionTrips: {
      width: "70%",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    routeOptionTripText: {
      fontSize: 20,
      fontWeight: "bold",
      paddingRight: 10,
      paddingLeft: 5,
      color: colors.dark.color,
    },
    routeOptionArriveTime: {
      color: colors.dark.color,
    },
    scrollViewBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: ScreenWidth,
      maxHeight: ScreenHeight * 0.4,
      backgroundColor: colors.dark.backgroundColor,
      zIndex: 1000,
    },
    // SubRides Styles
    subRides: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingBottom: 20,
      paddingTop: 0,
    },
    subRideText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 20,
    },
    subRideTextDestination: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.dark.color,
    },
    subRideTextTime: {
      fontSize: 20,
      color: colors.dark.color,
    },
    // Booking Styles
    BookingPopup: {
      position: 'absolute',
      bottom: ScreenHeight * 0.5 - 100,
      left: ScreenWidth * 0.5 - 100,
      width: 200,
      height: 200,
      borderRadius: 30,
      elevation: 5,
      zIndex: 1000,
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.8,
    },
    bookingImage: {
      width: 100,
      height: 100,
      borderRadius: 30,
    },
    bookingText: {
      color: colors.dark.color,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    // Van Styles
    van: {
      routes: {
        width: "100%",
        height: "100%",
      },
      // route description
      routeDescription: {
        width: "100%",
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderBottomColor: colors.dark.borderColor,
        borderBottomWidth: 1,
        borderTopColor: colors.dark.borderColor,
        borderTopWidth: 1,
      },
      routeDescriptionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.dark.color,
      },
      routeDescriptionAddress: {
        fontSize: 20,
        color: colors.dark.color,
        width: 100,
        textAlign: "center",
      },
      routeDescriptionTime: {
        fontSize: 14,
        color: "#777",
        width: 100,
        textAlign: "center",
      },
    },
    // update profiile screen
    updateProfile: {
      container: {
        width: ScreenWidth,
        height: ScreenHeight - 100,
        paddingHorizontal: "5%",
        paddingVertical: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.dark.backgroundColor,
      },
      touchableOpacity: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 100,
      },
      label: {
        width: "100%",
        color: colors.dark.color,
        fontSize: 12,
        paddingTop: 5,
      },
      title: {
        width: "100%",
        fontSize: 32,
        color: colors.dark.color,
        textAlign: "center",
        fontWeight: "bold",
      },
      view: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
      },
      success: {
        width: "100%",
        color: colors.dark.color,
        fontSize: 12,
        textAlign: "center",
      },
      input: {
        width: "100%",
        height: 40,
        backgroundColor: colors.dark.backgroundColor,
        color: colors.dark.color,
        fontSize: 20,
        paddingHorizontal: 20,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: colors.dark.borderColor,
        borderWidth: 1,
      },
    }
  },
  light: {
    // Utility Styles
    container: {
      flex: 1,
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
      left: ScreenWidth * 0.05,
      width: "90%",
      backgroundColor: colors.light.backgroundColor,
      shadowColor: colors.light.shadowColor,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.5,
      elevation: 4,
      padding: 8,
      borderRadius: 8,
    },
    input: {
      borderColor: colors.light.borderColor,
      borderWidth: 1,
      backgroundColor: colors.light.backgroundColor,
      color: colors.light.color,
    },
    separator: {
      height: 1,
      width: "100%",
      backgroundColor: colors.light.borderColor,
    },
    predefinedPlacesDescription: {
      backgroundColor: colors.light.backgroundColor,
      color: colors.light.color,
    },
    bottomPopupContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      paddingHorizontal: 30,
      paddingVertical: 10,
      width: ScreenWidth,
      height: "auto",
      elevation: 5,
      zIndex: 100,
      backgroundColor: colors.light.backgroundColor,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      maxHeight: ScreenHeight * 0.4,
    },
    flex: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    instructions: {
      fontSize: 14,
      color: colors.light.color,
      paddingBottom: 10,
    },
    subTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.light.color,
      paddingBottom: 5,
    },
    subTitleWithBorder: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.light.color,
      width: "100%",
      paddingHorizontal: 30,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.light.borderColor,
    },
    flatList: {
      width: "100%",
      height: "100%",
      maxHeight: ScreenHeight * 0.4
    },
    bottomPopupExpander: {
      height: 20,
      width: "100%",
      backgroundColor: colors.light.backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 7.5,
      borderBottomColor: colors.light.borderColor,
      borderBottomWidth: 1,
      marginBottom: 10,
    },
    bottomPopupLine: {
      width: 50,
      height: 5,
      backgroundColor: colors.light.borderColor,
      borderRadius: 5,
    },
    bottomPopupContainerNoPadding: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: ScreenWidth,
      height: "auto",
      elevation: 5,
      zIndex: 100,
      backgroundColor: colors.light.backgroundColor,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "center",
      maxHeight: ScreenHeight * 0.4,
    },
    selectButton: {
      width: 100,
      height: 50,
      backgroundColor: colors.light.backgroundColor,
      borderRadius: 5,
      borderColor: colors.light.borderColor,
      borderWidth: 1,
    },
    selectButtonRoutes: {
      width: 150,
      height: 40,
      backgroundColor: colors.light.backgroundColor,
      borderRadius: 5,
      borderColor: colors.light.borderColor,
      borderWidth: 1,
    },
    dropdownRow: {
      height: 40,
      width: "100%",
      color: colors.light.color,
      backgroundColor: colors.light.backgroundColor,
      borderColor: colors.light.borderColor,
    },
    dropdownRowText: {
      color: colors.light.color,
    },
    dropdownSearchInput: {
      width: "100%",
      height: 50,
      backgroundColor: colors.light.backgroundColor,
      color: colors.light.color,
      borderBottomColor: colors.light.borderColor,
      borderBottomWidth: 1,
    },
    dropdownStyle: {
      backgroundColor: colors.light.backgroundColor,
    },
    // Center Button Styles
    center: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: 50,
      height: 50,
      borderRadius: 50,
      elevation: 5,
      zIndex: 100,
    },
    centerImage: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    // Slider Styles
    sliderMark: {
      width: 20,
      height: 20,
      backgroundColor: "#CCC",
      borderRadius: 20,
    },
    // Button Styles
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 3
    },
    buttonText: {
      color: colors.light.color,
      fontSize: 20,
    },
    // User Route Option Styles
    routeOption: {
      width: "100%",
      padding: 10,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    RouteFormat: {
      borderTopColor: colors.light.borderColor,
      borderTopWidth: 1,
      paddingRight: 10,
    },
    borderBottom: {
      borderBottomColor: colors.light.borderColor,
      borderBottomWidth: 1,
    },
    routeOptionPrice: {
      color: colors.light.color,
      fontSize: 16,
      fontWeight: "bold",
    },
    routeOptionInformation: {
      display: "flex",
      alignItems: "flex-start",
      paddingVertical: 13,
      paddingHorizontal: 10,
    },
    routeOptionTrips: {
      width: "70%",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    routeOptionTripText: {
      fontSize: 20,
      fontWeight: "bold",
      paddingRight: 10,
      paddingLeft: 5,
      color: colors.light.color,
    },
    routeOptionArriveTime: {
      color: colors.light.color,
    },
    scrollViewBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: ScreenWidth,
      maxHeight: ScreenHeight * 0.4,
      backgroundColor: colors.light.backgroundColor,
      zIndex: 1000,
    },
    // SubRides Styles
    subRides: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingBottom: 20,
      paddingTop: 0,
    },
    subRideText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 20,
    },
    subRideTextDestination: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.light.color,
    },
    subRideTextTime: {
      fontSize: 20,
      color: colors.light.color,
    },
    // Booking Styles
    BookingPopup: {
      position: 'absolute',
      bottom: ScreenHeight * 0.5 - 100,
      left: ScreenWidth * 0.5 - 100,
      width: 200,
      height: 200,
      borderRadius: 30,
      elevation: 5,
      zIndex: 1000,
      backgroundColor: colors.dark.backgroundColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: 0.8,
    },
    bookingImage: {
      width: 100,
      height: 100,
      borderRadius: 30,
    },
    bookingText: {
      color: colors.dark.color,
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    },
    // Van Styles
    van: {
      routes: {
        width: "100%",
        height: "100%",
      },
      // route description
      routeDescription: {
        width: "100%",
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        borderBottomColor: colors.light.borderColor,
        borderBottomWidth: 1,
        borderTopColor: colors.light.borderColor,
        borderTopWidth: 1,
      },
      routeDescriptionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.light.color,
      },
      routeDescriptionAddress: {
        fontSize: 20,
        color: colors.light.color,
        width: 100,
        textAlign: "center",
      },
      routeDescriptionTime: {
        fontSize: 14,
        color: "#777",
        width: 100,
        textAlign: "center",
      },
    },
    // update profiile screen
    updateProfile: {
      container: {
        width: ScreenWidth,
        height: ScreenHeight - 100,
        paddingHorizontal: "5%",
        paddingVertical: "10%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.light.backgroundColor,
      },
      touchableOpacity: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      image: {
        width: 100,
        height: 100,
        borderRadius: 100,
      },
      label: {
        width: "100%",
        color: colors.light.color,
        fontSize: 12,
        paddingTop: 5,
      },
      title: {
        width: "100%",
        fontSize: 32,
        color: colors.light.color,
        textAlign: "center",
        fontWeight: "bold",
      },
      view: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
      },
      success: {
        width: "100%",
        color: colors.light.color,
        fontSize: 12,
        textAlign: "center",
      },
      input: {
        width: "100%",
        height: 40,
        backgroundColor: colors.light.backgroundColor,
        color: colors.light.color,
        paddingHorizontal: 20,
        fontSize: 20,
        marginVertical: 5,
        borderRadius: 5,
        borderColor: colors.light.borderColor,
        borderWidth: 1,
      }
    }
  }

});