import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import commonStyles from "../assets/styles";
import FirestoreController from "../controllers/FirebaseController";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("mandeep@gmail.com");
  const [password, setPassword] = useState("Mandeep1234*");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const onLoginPressed = async () => {
    if (!(email.length >= 7) || !(password.length >= 8)) {
      setError("Please enter a valid email and password");
    } else {
      // const firestoreController = FirestoreController.getInstance();
      // const result = await firestoreController.login(email, password);
      // if (result?.success) {
      //   navigation.replace("Home"); //
      // } else {
      //   setError("Login failed. Please try again.");
      // }
      let result = dispatch(loginUser(email, password));
      result && navigation.replace("TabView");
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.heroText}>Sign In</Text>
        <Text style={commonStyles.logo}> 🪑 </Text>
      </View>
      <View style={commonStyles.formContainer}>
        <Text style={commonStyles.label}>E-mail:</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(emailInput) => {
            setError(null);
            setEmail(emailInput);
          }}
          value={email}
          placeholder="email@mail.com"
          keyboardType="email-address"
        />
        <Text style={commonStyles.label}>Password:</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(passwordInput) => {
            setError(null);
            setPassword(passwordInput);
          }}
          value={password}
          secureTextEntry={true} // Corrected to boolean
          placeholder="Password"
        />
        <TouchableOpacity style={commonStyles.button} onPress={onLoginPressed}>
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={commonStyles.goBack}>Signup</Text>
        </TouchableOpacity>

        {error && <Text style={commonStyles.error}>{error}</Text>}
      </View>
    </View>
  );
};

export default LoginScreen;
