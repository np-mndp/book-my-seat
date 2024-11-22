// App.js
import "./handlers/gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./configs/Store";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
// import RestaurantListScreen from "./screens/RestaurantListScreen";
// import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
// import BookingScreen from "./screens/BookingScreen";
// import BookingHistoryScreen from "./screens/BookingHistoryScreen";
// import ReservationConfirmation from "./screens/ReservationConfirmation";
import TabViewScreen from "./screens/TabViewScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login" // Starting screen
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
            {/* Authentication Screens */}
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerTitle: "" }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerTitle: "" }}
            />

            {/* Tab View for Main Screens */}
            <Stack.Screen
              name="TabView"
              component={TabViewScreen}
              options={{ headerShown: false }}
            />

            {/* Additional Screens */}
            {/* <Stack.Screen
              name="Restaurant List"
              component={RestaurantListScreen}
              options={{ headerTitle: "Restaurants" }}
            />
            <Stack.Screen
              name="Restaurant Details"
              component={RestaurantDetailScreen}
              options={({ route }) => ({
                title: route.params?.restaurantData?.title || "Details",
              })}
            />
            <Stack.Screen
              name="Booking Screen"
              component={BookingScreen}
              options={({ route }) => ({
                title: route.params?.restaurant?.title || "Bookings",
              })}
            />
            <Stack.Screen
              name="Booking History"
              component={BookingHistoryScreen}
              options={{ headerTitle: "My Bookings" }}
            />
            <Stack.Screen
              name="Reservation Confirmation"
              component={ReservationConfirmation}
              options={{ headerTitle: "Reservation Confirmation" }}
            /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
