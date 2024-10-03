import "./handlers/gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
import SignupScreen from "./screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RestaurantListScreen from "./screens/RestaurantListScreen";
import HomeScreen from "./screens/HomeScreen"; // Import HomeScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home" // Set HomeScreen as the initial route
        screenOptions={{
          headerStyle: {
            backgroundColor: "#009c5b",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "", // Hide the header title for this screen
          }}
        />
        
        {/* Other Screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="Restaurant List"
          component={RestaurantListScreen}
          options={{
            headerTitle: "",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
