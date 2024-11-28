import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";


const ManagerProfileScreen = ({ navigation }) => {
  let dispatch = useDispatch();
  let { user, token } = useSelector((state) => state.auth);


  const onSignOutPressed = () => {
    Alert.alert("Sign Out", `User Signed out successfully !`, [
      {
        text: "OK",
        onPress: () => {
          navigation.replace("Login");
          dispatch(logoutUser());
        },
      },
    ]);
  };


  const managerName = "John Doe";
  const managerNumber = "+1 234 567 890";
  const restaurantDetails = {
    name: "Delicious Dine",
    address: "123 Foodie Lane, Flavor Town",
    cuisine: "Italian",
    contactNumber: "+1 987 654 321",
  };
  const restaurantLogo =
    "https://logo.com/image-cdn/images/kts928pd/production/b16518743564f361bc3caa3dfda70fe3466b1020-444x446.png?w=1080&q=72&fm=webp";

  return (
    <View style={styles.container}>
      {/* Restaurant Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://wallpapers.com/images/featured/restaurant-background-2ez77umko2vj5w02.jpg",
          }}
          style={styles.banner}
        />
      </View>

      <ScrollView>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: restaurantLogo }} style={styles.profileImage} />
          <View>
            <Text style={styles.managerName}>{managerName}</Text>
            <Text style={styles.managerNumber}>{managerNumber}</Text>
          </View>
        </View>

        {/* Restaurant Details Section */}
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantDetailTitle}>Restaurant Details</Text>
          <Text style={styles.restaurantDetailText}>
            Name: {restaurantDetails.name}
          </Text>
          <Text style={styles.restaurantDetailText}>
            Address: {restaurantDetails.address}
          </Text>
          <Text style={styles.restaurantDetailText}>
            Cuisine: {restaurantDetails.cuisine}
          </Text>
          <Text style={styles.restaurantDetailText}>
            Contact: {restaurantDetails.contactNumber}
          </Text>
        </View>

        {/* Action Buttons with Icons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("AddRestaurantScreen")}
          >
            <FontAwesome5
              name="plus-circle"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Restaurant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FloorPlanScreen")}
          >
            <MaterialIcons
              name="edit"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>View & Edit Floor Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("ReservationsScreen")}
          >
            <FontAwesome5
              name="clipboard-list"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>View Reservations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={onSignOutPressed}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    position: "relative",
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  managerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  managerNumber: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  restaurantDetails: {
    padding: 15,
    backgroundColor: "#f1f1f1",
    margin: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  restaurantDetailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2ca850",
  },
  restaurantDetailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  buttonsContainer: {
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2ca850",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }, signOutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4757", // Red color for sign out button
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ManagerProfileScreen;