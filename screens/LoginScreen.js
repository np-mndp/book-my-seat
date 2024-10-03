import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import commonStyles from "../assets/styles";
import FirestoreController from "../controllers/FirebaseController";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("owner@gmail.com");
  const [password, setPassword] = useState("owner12345");
  const [error, setError] = useState(null);

  const onLoginPressed = async () => {
    if (!(email.length >= 7) || !(password.length >= 8)) {
      setError("Please enter a valid email and password");
    } else {
      const firestoreController = FirestoreController.getInstance();
      const result = await firestoreController.login(email, password);
      if (result.success) {
        navigation.replace("Main"); // Navigate to the Main tab navigator
      } else {
        setError("Login failed. Please try again.");
      }
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
          style={commonStyles.button}
          onPress={onLoginPressed}
        >
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
