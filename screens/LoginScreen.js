import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import commonStyles from "../assets/styles";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/authActions";

let LoginScreen = ({ navigation }) => {
  let [email, setEmail] = useState("biraj@gmail.com");
  let [password, setPassword] = useState("Biraj1234*");
  let [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  let dispatch = useDispatch();

  let onLoginPressed = async () => {
    //disable login button
    setIsDisabled(true);
    // Validate email and password
    if (!(email.length >= 7) || !(password.length >= 8)) {
      setError("Please enter a valid email and password");
      return;
    }

    try {
      // Wait for the login action to complete
      let result = await dispatch(loginUser(email, password));
      // If login was successful, navigate to TabView
      if (result) {
        navigation.replace("TabView");
      } else {
        setError("Login failed. Please check your credentials and try again.");
        setIsDisabled(false);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsDisabled(false);
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
        <TouchableOpacity
          disabled={isDisabled}
          style={commonStyles.button}
          onPress={onLoginPressed}
        >
          {isDisabled && <ActivityIndicator />}
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
