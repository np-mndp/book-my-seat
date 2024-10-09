import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import commonStyles from "../assets/styles";
import FirestoreController from "../controllers/FirebaseController";
import RestaurantSvg from "../images/restaurant.svg";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("johndoe@gmail.com");
  const [password, setPassword] = useState("JohnDoe123");
  const [error, setError] = useState(null);

  const onLoginPressed = async () => {
    if (!(email.length >= 7) || !(password.length >= 8)) {
      setError("Please enter a valid email and password");
    } else {
      const firestoreController = FirestoreController.getInstance();
      const result = await firestoreController.login(email, password);
      if (result?.success) {
        navigation.navigate("Restaurant List"); //
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.hero}>
        <Text style={commonStyles.heroText}>Sign In</Text>
        {/* <Image style={commonStyles.chairImage}
          source={ require("../images/restaurantSeat.png")} 
         // resizeMode="contain"
        /> */}
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
          placeholder="Enter your email address"
          value={email}
          keyboardType="email-address"
        />
        <Text style={commonStyles.label}>Password:</Text>
        <TextInput
          style={commonStyles.input}
          onChangeText={(passwordInput) => {
            setError(null);
            setPassword(passwordInput);
          }}
          placeholder="Enter your password"
          value={password}
          secureTextEntry={true}
        />
        <TouchableOpacity
        style={commonStyles.forgotPassword}
        // create forgot password page
         onPress={() => navigation.navigate("ForgotPassword")}> 
          <Text style={commonStyles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.button}
          onPress={onLoginPressed}
        >
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View
        style={commonStyles.newAcct} >
        <Text >
          Are you new here? 
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={commonStyles.createAccount}> Create Account</Text>
        </TouchableOpacity>

        {error && <Text style={commonStyles.error}>{error}</Text>}
      </View>
      </View>
    </View>
  );
};

export default LoginScreen;
