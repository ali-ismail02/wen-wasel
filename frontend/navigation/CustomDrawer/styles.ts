import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    padding: 10
  },
  topSection: {
      backgroundColor: "white",
      padding: 30,
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
    borderWidth: 3,
    borderColor: "#DDD"
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black"
  },
  caption: {
    marginTop: 5,
    fontSize: 14,
    color: "black"
  }
});
