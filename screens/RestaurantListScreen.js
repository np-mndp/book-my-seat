import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RestaurantListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 1",
      address: "123 Main St, Anytown, USA",
      rating: 4.5,
      expensiveness: "$$",
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 2",
      address: "456 Elm St, Othertown, USA",
      rating: 4.2,
      expensiveness: "$",
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 3",
      address: "789 Oak St, Thistown, USA",
      rating: 4.8,
      expensiveness: "$$$",
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 4",
      address: "123 Main St, Anytown, USA",
      rating: 4.5,
      expensiveness: "$$",
    },
    {
      id: 5,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 5",
      address: "456 Elm St, Othertown, USA",
      rating: 4.2,
      expensiveness: "$",
    },
    {
      id: 6,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 6",
      address: "789 Oak St, Thistown, USA",
      rating: 4.8,
      expensiveness: "$$$",
    },
    {
      id: 7,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 7",
      address: "123 Main St, Anytown, USA",
      rating: 4.5,
      expensiveness: "$$",
    },
    {
      id: 8,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 8",
      address: "456 Elm St, Othertown, USA",
      rating: 4.2,
      expensiveness: "$",
    },
    {
      id: 9,
      thumbnail: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Restaurant 9",
      address: "789 Oak St, Thistown, USA",
      rating: 4.8,
      expensiveness: "$$$",
    },
    // Add more restaurants here...
  ]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.title.toLowerCase().includes(query.toLowerCase())
    );
    setRestaurants(filteredRestaurants);
  };

  const listItem = (item) => {
    return (
      <TouchableOpacity onPress={()=>console.log(`Restaurant ${item.title} pressed`)}>
        <View style={styles.restaurantItem}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.restaurantInfo}>
            <Text style={[styles.title, styles.primaryColor]}>
              {item.title}
            </Text>
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="#666"
              />
              <Text style={styles.address}>{item.address}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.expensiveness}>{item.expensiveness}</Text>
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
