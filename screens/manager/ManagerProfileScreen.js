import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
} from "react-native";
import { FontAwesome5, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { API_URL } from "../../configs/Constants";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const ManagerProfileScreen = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      route?.params?.setTitle(`My Profile`);
    }, [navigation])
  );

  // Function to fetch restaurant data
  const fetchRestaurants = async () => {
    try {
      const response = await fetch(`${API_URL}/api/restaurants`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      if (response.ok) {
        const text = await response.text(); // Read the response as text

        // If text is not empty, parse it as JSON, otherwise set restaurants to null
        setRestaurants(text ? JSON.parse(text) : null);
      } else {
        setRestaurants(null);
        console.error("Failed to fetch restaurant details.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    console.log({ navigation, route });

    navigation.setOptions({ headerTitle: `Welcome ${user?.name} Profile` }); // Dynamically set the title
    // navigation.setOptions({ headerTitle: title });
    fetchRestaurants();
  }, [navigation]);

  const onSignOutPressed = () => {
    Alert.alert("Sign Out", `User Signed out successfully!`, [
      {
        text: "OK",
        onPress: () => {
          navigation.replace("Login");
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants()
      .then(() => setRefreshing(false)) // Stop refreshing after data fetch
      .catch(() => setRefreshing(false)); // Handle any errors
  };

  const renderRestaurant = ({ item }) => (
    <TouchableOpacity
      style={styles.restaurantCard}
      onPress={() =>
        navigation.navigate("RestaurantScreen", { restaurant: item })
      }
    >
      <Image source={{ uri: item.images[0] }} style={styles.restaurantImage} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.title || "N/A"}</Text>
        <Text style={styles.restaurantDescription} numberOfLines={2}>
          {item.description || "No description available."}
        </Text>
        <View style={styles.ratingContainer}>
          {Array.from({ length: item.expensiveRating }, (_, index) => (
            <FontAwesome key={index} name="dollar" size={15} color="#DAA520" />
          ))}
        </View>
        <Text style={styles.restaurantAddress}>
          {item.location.address || "N/A"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.profilePicture }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.managerName}>{user?.name}</Text>
          <View style={styles.managerNumber}>
            <FontAwesome5
              name="phone-alt"
              size={16}
              color="#666"
              style={{ marginRight: 5 }}
            />
            <Text>{user?.phone}</Text>
          </View>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text style={styles.restaurantDetailTitle}>My Restaurants</Text>
          {restaurants && restaurants.length > 0 ? (
            <FlatList
              data={restaurants}
              renderItem={renderRestaurant}
              keyExtractor={(item) => item.id.toString()}
              style={styles.restaurantList}
              scrollEnabled={false}
            />
          ) : (
            <Text style={[styles.restaurantDetailTitle, styles.colorNoData]}>
              No restaurants added yet.
            </Text>
          )}
        </View>

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

          <TouchableOpacity
            style={styles.signOutButton}
            onPress={onSignOutPressed}
          >
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
    paddingBottom: 20,
  },

  titleSection: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2ca850",
    textAlign: "center",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  managerName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  managerNumber: {
    flexDirection: "row",
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },

  restaurantDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ca850",
    marginBottom: 10,
    textAlign: "center",
  },

  colorNoData: {
    color: "#9e9898",
  },

  restaurantList: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  restaurantCard: {
    flexDirection: "row",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  restaurantInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  restaurantDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },

  buttonsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ca850",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },

  signOutButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ManagerProfileScreen;
