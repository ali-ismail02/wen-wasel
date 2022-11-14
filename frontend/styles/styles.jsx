import { Dimensions, StyleSheet } from "react-native";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  // Utility Styles
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
    left: ScreenWidth * 0.05,
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
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
    backgroundColor: "white",
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
    padding: 0
  },
  instructions: {
    fontSize: 14,
    color: "black",
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 5,
  },
  flatList: {
    width: "100%",
    height: "100%",
    maxHeight: ScreenHeight * 0.4
  },
  bottomPopupExpander: {
    height:20,
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 7.5,
    borderBottomColor: "#888",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  bottomPopupLine: {
    width: 50,
    height: 5,
    backgroundColor: "#888",
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
    backgroundColor: "white",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    maxHeight: ScreenHeight * 0.4,
  },
  selectButton: {
    width: 100,
    height: 50,
    backgroundColor: "#DDD",
    borderRadius: 5,
    borderColor: "#888",
    borderWidth: 1,
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
    backgroundColor: "red",
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
    backgroundColor: "#DDDDDD",
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
    color: "white",
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
    borderTopColor: "#DDD",
    borderTopWidth: 1,
    paddingRight: 10,
  },
  borderBottom: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
  },
  routeOptionPrice: {
    color: "black",
    fontSize: 20,
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
  },
  scrollViewBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ScreenWidth,
    maxHeight: ScreenHeight * 0.4,
    backgroundColor: "white",
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
  },
  subRideTextTime: {
    fontSize: 20,
    color: "#DDD",
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
    backgroundColor: "black",
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Van Styles
  van: {
    routes: {
      width: "100%",
      height: "100%",
      paddingHorizontal: 30,

    },
  }
});