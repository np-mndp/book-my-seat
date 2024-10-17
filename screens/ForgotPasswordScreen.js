import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import commonStyles from "../assets/styles";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("")
  const onResetPasswordPressed = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
  .then(() => {
  setMessage("Password Reset has been sent!")
  })
  .catch((error) => {
    const errorCode = error.code;
    setMessage("")
    if (errorCode === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (errorCode === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("Failed to send reset email. Try again later.");
      }
  });
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.heroText}>Forgot Password</Text>
        {/* Optional: Add a logo or image */}
        {/* <Image style={commonStyles.chairImage} source={ require("../images/restaurantSeat.png")} /> */}
        <Text style={commonStyles.logo}> 🪑 </Text>
      </View>

      <View style={commonStyles.formContainer}>
        <Text style={commonStyles.label}>Enter your email address:</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(emailInput) => {
            setError(null);
            setEmail(emailInput);
          }}
          placeholder="Enter your email"
          value={email}
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={commonStyles.button}
          onPress={onResetPasswordPressed}
        >
          <Text style={commonStyles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={commonStyles.forgotPassword}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={commonStyles.forgotPassword}>Back to Login</Text>
        </TouchableOpacity> */}
      </View>
      {error && <Text style={commonStyles.error}>{error}</Text>}
        {message && <Text style={commonStyles.successMessage}>{message}</Text>}
    </View>
  );
};

export default ForgotPasswordScreen;