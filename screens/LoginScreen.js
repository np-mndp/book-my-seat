import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import commonStyles from "../assets/styles";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={commonStyles.label}>Password:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => console.log("Login button pressed")}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={commonStyles.goBack}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
