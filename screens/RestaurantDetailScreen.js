import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import commonStyles from "../assets/styles";
import { API_URL } from "../configs/Constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const RestaurantDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { restaurantData } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState({});
  const [menu, setMenu] = useState([]);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    navigation.setOptions({ title: restaurantData.title });
    fetchRestroData();
    fetchMenu();
  }, [navigation, restaurantData.id]);

  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurantData.id}/menu`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const json = await response.json();
        setMenu(json);
      } else {
        console.error("Failed to fetch restaurant menu.");
        setMenu([]);
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
      setMenu([]);
    }
  };

  const fetchRestroData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurantData.id}`,
        { method: "GET" }
      );

      if (response.ok) {
        const json = await response.json();
        setSelectedRestaurant(json);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Image
        source={{ uri: item.images && item.images[0] }}
        style={styles.menuImage}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuItemTitle}>{item.menuItem}</Text>
        <Text style={styles.menuItemDetails}>
          ${item.price} | {item.calories} cal
        </Text>
      </View>
    </View>
  );

  const groupedMenu = menu.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: selectedRestaurant.images && selectedRestaurant.images[0] }}
          style={styles.image}
        />
        <Text style={styles.description}>{selectedRestaurant.description}</Text>

        {Object.keys(groupedMenu).length > 0 ? (
          Object.keys(groupedMenu).map((type) => (
            <View key={type}>
              <Text style={styles.menuHeader}>{type} Menu</Text>
              <FlatList
                data={groupedMenu[type]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMenuItem}
                scrollEnabled={false}
              />
            </View>
          ))
        ) : (
          <Text style={styles.noMenuText}>
            No menu available for this restaurant.
          </Text>
        )}

        <TouchableOpacity
          style={commonStyles.button}
          onPress={() =>
            navigation.navigate("Booking Screen", {
              restaurant: selectedRestaurant,
            })
          }
        >
          <Text style={commonStyles.buttonText}>Book My Seat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
    color: "#555",
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  menuImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  menuItemTitle: {
    fontSize: 16,
    flex: 1,
  },
  menuItemDetails: {
    fontSize: 14,
    color: "#888",
  },
  noMenuText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },
});
