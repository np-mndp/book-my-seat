import { StyleSheet } from "react-native";

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  hero: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heroText: {
    fontSize: 70,
    color: "#000",
    fontWeight: "bold",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 150,
    resizeMode: "contain",
  },
  formContainer: {
    paddingHorizontal: 20,
    // flex:1,
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    // Elevation property for Android
    elevation: 10, // The higher the value, the stronger the shadow
  },
  button: {
    backgroundColor: "#009c5b",
    width: "80%",
    padding: 10,
    marginTop: 25,
    borderRadius: 5,
    alignItems: "center",
    // Elevation property for Android
    elevation: 10, // The higher the value, the stronger the shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    textAlign: "left",
    alignSelf: "flex-start",
    paddingLeft: "10%",
    fontFamily: "monospace",
    color: "#0F0F0F",
  },
  goBack: {
    justifyContent: "flex-start",
    color: "#009c5b",
    alignItems: "flex-start",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default commonStyles;
