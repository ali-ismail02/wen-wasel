import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 25
  },
  switchContainer: {
    paddingLeft:18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
  },
  topSection: {
    backgroundColor: "white",
    padding: 30,
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
    borderColor: "#DDD"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black"
  },
  caption: {
    marginTop: 5,
    fontSize: 14,
    color: "black"
  }
});
