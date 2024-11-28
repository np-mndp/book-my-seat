// TabViewScreen.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreenView from "./MapViewScreen";
import ProfileScreen from "./ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RestaurantListScreen from "./RestaurantListScreen";
import BookingHistoryScreen from "./BookingHistoryScreen";
import ReservationsScreen from "./manager/ReservationsScreen";
import FloorPlanScreen from "./manager/FloorPlanScreen";
import AddRestaurantScreen from "./manager/AddRestaurantScreen";
import ManagerProfileScreen from "./manager/ManagerProfileScreen";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

const TabViewScreen = ({ isManager }) => {
  let { user, token } = useSelector((state) => state.auth);
  if (user?.isManager == false) {
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

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
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
  } else {
    return (
      <Tab.Navigator
        initialRouteName="Reservation"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case "Reservation":
                iconName = "calendar-check";
                break;
              case "AddRestaurant":
                iconName = "plus-box";
                break;
              case "FloorPlan":
                iconName = "floor-plan";
                break;
              case "ManagerProfile":
                iconName = "account-tie";
                break;
              default:
                iconName = "circle";
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#009c5b",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Reservation" component={ReservationsScreen} />
        <Tab.Screen name="AddRestaurant" component={AddRestaurantScreen} />
        <Tab.Screen name="FloorPlan" component={FloorPlanScreen} />
        <Tab.Screen name="ManagerProfile" component={ManagerProfileScreen} />
      </Tab.Navigator>
    );
  }
};

export default TabViewScreen;
