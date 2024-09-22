import "./handlers/gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import RestaurantDetailScreen from "./screens/RestaurantDetailScreen";
import SignupScreen from "./screens/SignupScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
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
          // options={({ navigation }) => ({
          //   headerShown: true,
          //   headerRight: () => (
          //     <View>
          //       <Pressable
          //         onPress={() =>
          //           setVisibility((prevVisibility) =>
          //             prevVisibility === "none" ? "flex" : "none"
          //           )
          //         }
          //       >
          //         <Ionicons name="menu-outline" color="white" size={32} />
          //       </Pressable>
          //       <View style={{ display: visibility }}>
          //         <FloatingMenu navigation={navigation} setVisibility={setVisibility} />
          //       </View>
          //     </View>
          //   ),
          // })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>

    // <LoginScreen></LoginScreen>

    // <RestaurantDetailScreen />
  );
}
