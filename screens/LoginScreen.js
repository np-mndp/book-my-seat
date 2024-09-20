import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}> 🪑 </Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => console.log("Login button pressed")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF",
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 20,
    borderRadius: 10, 
    backgroundColor: "#fff",
    // Elevation property for Android
    elevation: 10,  // The higher the value, the stronger the shadow
  },
  button: {
    backgroundColor: "#009c5b",
    width: "80%",
    padding: 10,
    marginTop:25,
    borderRadius: 5,
    alignItems: "center",
    // Elevation property for Android
    elevation: 10,  // The higher the value, the stronger the shadow
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight:'bold'
  },
});

export default LoginScreen;
