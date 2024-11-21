import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { API_URL } from "../configs/Constants";

const RestaurantListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      title: "Restaurant 1",
      location: { address: "123 Main St, Anytown, USA" },
      rating: 4.5,
      expensiveness: "$$",
    },
  ]);

  const [originalRestaurants, setOriginalRestaurants] = useState([
    {
      id: 1,
      images: [
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      title: "Restaurant 1",
      address: "123 Main St, Anytown, USA",
      rating: 4.5,
      expensiveness: "$$",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchWithTimeout = (url, options, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timed out")), timeout)
        ),
      ]);
    };

    const fetchData = async () => {
      try {
        let params = new URLSearchParams({
          lat: 43.676022,
          lng: -79.411049,
        });

        const response = await fetchWithTimeout(
          `${API_URL}/api/restaurants?${params}`,
          { method: "GET" },
          5000 // Timeout set to 5000ms (5 seconds)
        );

        if (response.ok) {
          const json = await response.json();
          setRestaurants(json.length > 0 ? json : restaurants);
        } else {
          throw new Error("Failed to fetch"); // Handle server errors
        }
      } catch (error) {
        console.error("Error:", error.message);
        setRestaurants(restaurants); // Use fallback data in case of an error
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length !== 0) {
      const filteredRestaurants = originalRestaurants.filter((restaurant) =>
        restaurant.title.toLowerCase().includes(query.toLowerCase())
      );
      setRestaurants(filteredRestaurants);
    } else {
      setRestaurants(originalRestaurants); // Reset to the full list when the query is empty
    }
  };

  // const RatingStars = (rating) => {
  //   let stars = <FontAwesome name="dollar" size={15} color="black" />;

  //   for (let i = 1; i < rating; i++) {
  //     stars += <FontAwesome name="dollar" size={15} color="black" />;
  //   }

  //   return stars;
  // };

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
              {/* <FontAwesome name="dollar" size={15} color="black" />
              <Text style={styles.rating}>{item.expensiveRating}</Text> */}

              {/* {RatingStars(item.expensiveRating)} */}

              {/* <Text style={styles.expensiveness}>{item.expensiveRating}</Text> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search restaurants"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.myLocation} onPress={() => {}}>
          <MaterialIcons name="my-location" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={restaurants}
        renderItem={({ item }) => listItem(item)}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  searchBar: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    display: "flex",
    flexDirection: "row",
  },
  searchInput: {
    height: 40,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 16,
    flex: 10,
  },
  myLocation: {
    backgroundColor: "#fff",
    padding: 8,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "#ddd",
    flex: 1,
  },
  restaurantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
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
    color: "#009c5b",
  },
});

export default RestaurantListScreen;
