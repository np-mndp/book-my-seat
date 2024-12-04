import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { API_URL } from "../../configs/Constants";

const RestaurantScreen = ({ route, navigation }) => {
  const { token } = useSelector((state) => state.auth);
  //   const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  const { restaurant } = route.params;
  useEffect(() => navigation.setOptions({ title: restaurant.title }), []);

  //   // Function to fetch restaurant details by ID
  //   const fetchRestaurantDetails = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/api/restaurants/${1}`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setRestaurant(data);
  //       } else {
  //         console.error("Failed to fetch restaurant details.");
  //         setError("Failed to load restaurant details.");
  //       }
  //     } catch (err) {
  //       console.error("Error:", err.message);
  //       setError(err.message);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchRestaurantDetails();
  //   }, []);

  const onAddMenuPressed = () => {
    // Navigate to Add Menu screen
    navigation.navigate("AddMenuScreen", { restaurantId: restaurant.id });
  };

  const onAddTablesPressed = () => {
    // Navigate to Add Tables screen
    navigation.navigate("AddTablesScreen", { restaurantId: restaurant });
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.restaurantDetailSection}>
          <Image
            source={{ uri: restaurant.images[0] }}
            style={styles.restaurantImage}
          />
          <Text style={styles.restaurantName}>{restaurant.title || "N/A"}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurant.description || "No description available."}
          </Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: restaurant.expensiveRating }, (_, index) => (
              <FontAwesome5
                key={index}
                name="dollar-sign"
                size={15}
                color="#DAA520"
              />
            ))}
          </View>
          <Text style={styles.restaurantAddress}>
            {restaurant.location.address || "N/A"}
          </Text>
          <Text style={styles.cuisineText}>
            {restaurant.cousine ? restaurant.cousine.join(", ") : "N/A"}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onAddMenuPressed}>
            <FontAwesome5
              name="utensils"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onAddTablesPressed}>
            <FontAwesome5
              name="table"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Tables</Text>
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
  restaurantDetailSection: {
    padding: 15,
    alignItems: "center",
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  cuisineText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
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
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default RestaurantScreen;
