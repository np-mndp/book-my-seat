import "./handlers/gesture-handler";
import LoginScreen from "./screens/LoginScreen";
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
import SignupScreen from "./screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RestaurantListScreen from "./screens/RestaurantListScreen";
import TabViewScreen from "./screens/TabViewScreen";
import { Provider } from "react-redux";
import store, { persistor } from "./configs/Store";
import { PersistGate } from "redux-persist/integration/react";
import BookingScreen from "./screens/BookingScreen";
import BookingHistoryScreen from "./screens/BookingHistoryScreen";
import ReservationConfirmation from "./screens/ReservationConfirmation";
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
            <Stack.Screen
              name="TabView"
              component={TabViewScreen}
              options={{
                headerTitle: "Book My Seat",
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
                headerTitle: "Restaurants",
              }}
            />
            <Stack.Screen
              name="Booking Screen"
              component={BookingScreen}
              options={[
                ({ route }) => ({ title: route.params?.restaurant?.title || "Bookings" }),
                {
                  headerTitle: "Bookings",
                },
              ]}
            />
            <Stack.Screen
              name="Restaurant Details"
              component={RestaurantDetailScreen}
              options={[
                ({ route }) => ({ title: route.params?.restaurantData?.title || "Details" }),
                {
                  headerTitle: "Details",
                },
              ]}
            />
            <Stack.Screen
              name="Booking History"
              component={BookingHistoryScreen}
              options={{
                headerTitle: "My Bookings",
              }}
            />
            <Stack.Screen
              name="Reservation Confirmation"
              component={ReservationConfirmation}
              options={{
                headerTitle: "Reservation Confirmation",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
