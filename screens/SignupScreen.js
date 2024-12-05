import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import commonStyles from "../assets/styles";
import { useState } from "react";
import { API_URL } from "../configs/Constants";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      passwordError ||
      !profilePicture
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, profilePicture }),
      });

      if (response.ok) {
        Alert.alert(
          "User Created !",
          "User account has been created successfully !"
        );
        navigation.replace("TabView");
      } else {
        Alert.alert("Error", "Failed to create user account");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create user account");
      console.error("Error:", error.stack);
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.heroText}>Sign Up</Text>
        <Text style={commonStyles.logo}> 🪑 </Text>
      </View>

      <View style={commonStyles.formContainer}>
        <Text style={commonStyles.label}>Name</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Full Name"
          onChangeText={setName}
        />
        <Text style={commonStyles.label}>E-mail:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="E-mail"
          onChangeText={setEmail}
        />
        <Text style={commonStyles.label}>Password:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Text style={commonStyles.label}>Confirm Password:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={(text) => {
            let timeout;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              if (text === password) {
                console.log("Passwords match");
                setPasswordError(null);
              } else {
                setPasswordError("Passwords do not match");
                console.log("Passwords do not match");
              }
            }, 1000);
          }}
        />
        {passwordError && <Text style={{ color: "red" }}>{passwordError}</Text>}
        <Text style={commonStyles.label}>Phone:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="437 777 7777"
          onChangeText={setPhone}
        />
        <Text style={commonStyles.label}>Profile:</Text>
        <TextInput
          style={commonStyles.input}
          placeholder="Image URL goes here"
          onChangeText={setProfilePicture}
        />

        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity
          style={commonStyles.button}
          onPress={() => handleSignup()}
        >
          <Text style={commonStyles.buttonText}>Register</Text>
        </TouchableOpacity>
        <Text style={commonStyles.goBack}>Back to Sign in</Text>
      </View>
    </View>
  );
};
export default SignupScreen;
