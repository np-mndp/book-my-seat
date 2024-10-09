import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,

  },
  hero: {
    justifyContent: "center",
    alignItems: "center",
   
  },
  heroText: {
    fontSize: 32,
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
   
  },
  chairImage:{
    marginTop:10,
    width:120,
    height:120,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 120,
    resizeMode: "contain",
  },
  formContainer: {
    paddingHorizontal: 20,
    // flex:1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:90,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    // Elevation property for Android
    elevation: 10, // The higher the value, the stronger the shadow
  },
  button: {
    backgroundColor: "#009c5b",
    width: "100%",
    padding: 10,
    marginTop: 25,
    borderRadius: 10,
    alignItems: "center",
    // Elevation property for Android
    elevation: 10, // The higher the value, the stronger the shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginBottom: 15,
    textAlign: "left",
    alignSelf: "flex-start",
    paddingLeft: "2%",
    fontFamily: "monospace",
  },

  goBack: {
    justifyContent: "flex-start",
    color: "#009c5b",
    alignItems: "flex-start",
  },
  error: {
    color: "red",
    marginBottom: 10,
    alignItems: "flex-start",
    fontSize: 15,

  },
  successMessage: {
    color: "green",
    marginBottom: 10,
    alignItems: "flex-start",
    fontSize: 15,

  },
  newAcct:{
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:40
  },
  createAccount:{
    color: "#009c5b",
  },

  forgotPassword:{
    alignSelf: "flex-end",
    color: "#009c5b",
    marginTop: 10,
  }
});

export default commonStyles;
