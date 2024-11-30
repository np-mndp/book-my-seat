import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../configs/Constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/restaurants?lat=43.676022&lng=-79.411049`
        );
        if (response.ok) {
          const json = await response.json();
          setRestaurants(json);
          setFilteredRestaurants(json); // Initialize filtered data
        } else {
          throw new Error("Failed to fetch restaurants.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      // Reset filtered list if query is empty
      setFilteredRestaurants(restaurants);
      return;
    }

    // Filter restaurants by title
    const filtered = restaurants.filter((restaurant) =>
      restaurant.title.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredRestaurants(filtered);
  };

  const listItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Restaurant Details", { restaurantData: item })
        }
      >
        <View style={styles.restaurantItem}>
          <Image source={{ uri: item.images[0] }} style={styles.thumbnail} />

          <View style={styles.restaurantInfo}>
            <Text style={[styles.title, styles.primaryColor]}>
              {item.title}
            </Text>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-pin" size={16} color="#cb4539" />
              <Text style={styles.address}>{item.location.address}</Text>
            </View>
            <View style={styles.ratingContainer}>
              {Array.from({ length: item.expensiveRating }, (_, index) => (
                <FontAwesome
                  key={index}
                  name="dollar"
                  size={15}
                  color="#DAA520"
                />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Banner */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Find your</Text>
        <Text style={[styles.headerText, { fontSize: 36 }]}>SEAT</Text>
        <Text style={styles.headerText}>for any occasion!</Text>
      </View>
  
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          placeholder="Search Restaurants near you"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
  
      {/* Featured Restaurant */}
      {!loading && searchQuery.trim() === "" && filteredRestaurants.length > 0 && (
        <View style={styles.featuredRestaurant}>
          <Text style={styles.featuredTitle}>We thought you may like this...</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Restaurant Details", {
                restaurantData: filteredRestaurants[0],
              })
            }
          >
            <Text style={styles.restaurantName}>
              {filteredRestaurants[0].title}
            </Text>
            <Image
              source={{ uri: filteredRestaurants[0].images[0] }}
              style={styles.featuredImage}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Restaurant List */}
      {!loading && searchQuery.trim() === "" && filteredRestaurants.length > 0 && (
   <Text style={styles.restaurantName}>
              Or check other restaurants...
            </Text>
      )}
      
      {loading ? (
        <ActivityIndicator size="large" color="#14AE5C" />
      ) : (
        <FlatList
          data={
            searchQuery.trim() === "" ? filteredRestaurants.slice(1) : filteredRestaurants
          } // Skip the featured restaurant if no search query
          renderItem={({ item }) => listItem(item)}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
  
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  header: {
    backgroundColor: "#E5FAF1",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#14AE5C",
    alignItems: "left",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  featuredRestaurant: {
    marginBottom: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    alignItems: "left",
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#14AE5C",
    paddingBottom: 5
  },
  restaurantItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 16,
  },
  restaurantInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  address: {
    color: "#666",
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  expensiveness: {
    fontSize: 16,
    color: "#666",
  },
  primaryColor: {
    color: "#14AE5C",
  },
});

export default HomeScreen;
