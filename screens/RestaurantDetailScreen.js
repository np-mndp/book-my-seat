import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import commonStyles from "../assets/styles";
import { API_URL } from "../configs/Constants";

const RestaurantDetailScreen = ({ route }) => {
  const navigation = useNavigation(); // Initialize navigation
  const { restaurantData } = route.params; // Extract restaurant object

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState({});

  useEffect(() => {
    navigation.setOptions({ title: restaurantData.title }); // Set screen title

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/restaurants/${restaurantData.id}`,
          { method: "GET" }
        );

        if (response.ok) {
          const json = await response.json();
          if (json) {
            setSelectedRestaurant(json);
          } else {
            setError(`No such restaurant ${restaurantData.title} found`);
          }
        } else {
          throw new Error("Failed to fetch"); // Handle server errors
        }
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchData();
  }, [navigation, restaurantData.id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{error}</Text>
      </View>
    );
  }

  // Extract restaurant data from selectedRestaurant
  const restaurant = {
    name: selectedRestaurant.title || restaurantData.title,
    description:
      "A cozy restaurant serving a variety of delicious dishes made from fresh ingredients. Enjoy our warm atmosphere and friendly service.",
    image: selectedRestaurant.thumbnail || restaurantData.thumbnail,
    foodMenu: selectedRestaurant.foodMenu || [
      { id: 1, title: "Spaghetti Carbonara", price: "$12.99" },
      { id: 2, title: "Grilled Salmon", price: "$15.99" },
      { id: 3, title: "Caesar Salad", price: "$10.99" },
    ],
    beverageMenu: selectedRestaurant.beverageMenu || [
      { id: 1, title: "Coca Cola", price: "$1.99" },
      { id: 2, title: "Fresh Orange Juice", price: "$3.50" },
      { id: 3, title: "Craft Beer", price: "$5.00" },
    ],
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuItemTitle}>{item.title}</Text>
      <Text style={styles.menuItemPrice}>{item.price}</Text>
    </View>
  );

  const handlePress = () => {
    navigation.navigate("Booking Screen", { restaurant: selectedRestaurant });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: selectedRestaurant.images[0] }}
        style={styles.image}
      />
      <Text style={styles.title}>{selectedRestaurant.title}</Text>
      <Text style={styles.description}>{selectedRestaurant.description}</Text>

      <Text style={styles.menuHeader}>Food Menu</Text>
      <FlatList
        data={restaurant.foodMenu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.menuHeader}>Beverage Menu</Text>
      <FlatList
        data={restaurant.beverageMenu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={commonStyles.button} onPress={handlePress}>
        <Text style={commonStyles.buttonText}>Book My Seat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuItemTitle: {
    fontSize: 16,
  },
  menuItemPrice: {
    fontSize: 16,
    color: "#888",
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
});

export default RestaurantDetailScreen;
