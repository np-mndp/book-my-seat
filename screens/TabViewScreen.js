// TabViewScreen.js
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreenView from "./MapViewScreen";
import ProfileScreen from "./ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BookingHistoryScreen from "./BookingHistoryScreen";
import ReservationsScreen from "./manager/ReservationsScreen";
import FloorPlanScreen from "./manager/FloorPlanScreen";
import AddRestaurantScreen from "./manager/AddRestaurantScreen";
import ManagerProfileScreen from "./manager/ManagerProfileScreen";
import HomeScreen from "./HomeScreen";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

const TabViewScreen = ({ navigation, route }) => {
  const { user, location } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("Book My Seat");
  // let navigation = useNavigation();

  // const getHeaderTitle = (routeName) => {
  //   switch (routeName) {
  //     case "Home":
  //       return `Welcome ${user?.name}`;
  //     case "Search on Map":
  //       return "Nearby Restaurants";
  //     case "Profile":
  //       return `${user?.name}`;
  //     case "MyBookings":
  //       return `My Bookings`;
  //     default:
  //       return "App";
  //   }
  // };

  useEffect(() => {
    // console.log(route);
    // console.log(user?.isManager)
    navigation.setOptions({ headerTitle: title }); // Dynamically set the title
    // navigation.setOptions({ headerTitle: title });
  }, [title]);


  useEffect(() => {
    if (!user) {
      // If the user is not logged in, redirect to the Login screen
      navigation.replace("Login");
    } 
    
    else if (!user?.isManager && !location?.lat) {
      // If location is not set, navigate to SetLocation screen
      navigation.replace("SetLocation");
    }
  }, [user, location, navigation]);

  

  // Check if the user is a manager
  if (user?.isManager === false) {
    // Render user's tabs
    return (
      <Tab.Navigator
        initialRouteName="Home"
        options={{
          headerTitle: "ASDADSADADSADAS",
        }}
        screenOptions={({ route }) => ({
          // headerTitle: getHeaderTitle(route.name),
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Search on Map":
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
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ title, setTitle }}
        />
        <Tab.Screen
          name="Search on Map"
          component={MapScreenView}
          initialParams={{ title, setTitle }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          initialParams={{ title, setTitle }}
          options={{
            headerTitle: "Restaurants",
          }}
        />
        <Tab.Screen
          name="MyBookings"
          component={BookingHistoryScreen}
          initialParams={{ title, setTitle }}
        />
      </Tab.Navigator>
    );
  } else {
    // Render manager's tabs
    return (
      <Tab.Navigator
        initialRouteName="Home"
        options={{
          headerTitle: "Welcome !",
        }}
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
              case "Home":
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
        <Tab.Screen
      name="Home"
      component={ManagerProfileScreen}
      initialParams={{ title, setTitle }}
    />
        <Tab.Screen
          name="Reservation"
          component={ReservationsScreen}
          initialParams={{ title, setTitle }}
        />
        {/* <Tab.Screen
          name="AddRestaurant"
          component={AddRestaurantScreen}
          initialParams={{ title, setTitle }}
        /> */}
        {/* <Tab.Screen
          name="FloorPlan"
          component={FloorPlanScreen}
          initialParams={{ title, setTitle }}
        /> */}
        
      </Tab.Navigator>
    );
  }
};

export default TabViewScreen;
