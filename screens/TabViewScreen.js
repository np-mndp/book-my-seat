// TabViewScreen.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import MapScreenView from "./MapViewScreen";

import ProfileScreen from "./ProfileScreen"
import MyBookingsScreen from "./MyBookingsScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BookingHistoryScreen from "./BookingHistoryScreen";
import RestaurantListScreen from "./RestaurantListScreen";

const Tab = createBottomTabNavigator();

const TabViewScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "MapScreenView":
              iconName = "map";
              break;
            case "Profile":
              iconName = "account";
              break;
            case "MyBookings":
              iconName = "ticket-confirmation";
              break;
            default:
              iconName = "circle";
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#009c5b",
        tabBarInactiveTintColor: "gray",
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={RestaurantListScreen} />
      <Tab.Screen name="MapScreenView" component={MapScreenView} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="MyBookings" component={BookingHistoryScreen} />
    </Tab.Navigator>
  );
};

export default TabViewScreen;
