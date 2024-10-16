import "./handlers/gesture-handler";
import LoginScreen from "./screens/LoginScreen";
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
import SignupScreen from "./screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RestaurantListScreen from "./screens/RestaurantListScreen";
import HomeScreen from "./screens/HomeScreen";
import { Provider } from "react-redux";
import store, { persistor } from "./configs/Store";
import { PersistGate } from "redux-persist/integration/react";
import MapViewScreen from "./screens/MapViewScreen";
//test
const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login" // Set HomeScreen as the initial route
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
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetailScreen}
              options={{
                headerTitle: "",
              }}
            />
            <Stack.Screen
              name="MapView"
              component={MapViewScreen}
              options={{
                headerTitle: "",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
