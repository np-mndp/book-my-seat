import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from "../assets/styles";

const RestaurantDetailScreen = ({ route }) => {
  const navigation = useNavigation(); // Initialize navigation
  // Extract the restaurant object from route.params
  const { restaurantData } = route.params;

    useEffect(() => {
      navigation.setOptions({ title: restaurantData.title });
    }, [navigation, restaurantData.title]);


  console.log(restaurantData); // Add this line to debug

  if (!restaurantData) {
    return (
      <View style={styles.container}>
        <Text>No restaurant data found.</Text>
      </View>
    );
  }

  // handlePress 
  const handlePress = async () => {
    console.log("Booking pressed")
  };

  // Now, you can use restaurantData safely
  const restaurant = {
    name: restaurantData.title,
    description: "A cozy restaurant serving a variety of delicious dishes made from fresh ingredients. Enjoy our warm atmosphere and friendly service.",
    image: restaurantData.thumbnail,
    foodMenu: [
      { id: 1, title: "Spaghetti Carbonara", price: "$12.99" },
      { id: 2, title: "Grilled Salmon", price: "$15.99" },
      { id: 3, title: "Caesar Salad", price: "$10.99" },
    ],
    beverageMenu: [
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

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text style={styles.description}>{restaurantData.address}</Text>

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
      <TouchableOpacity style={commonStyles.button} onPress={ handlePress}>
          <Text style={commonStyles.buttonText}>Book My Seat</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  menuHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemTitle: {
    fontSize: 16,
  },
  menuItemPrice: {
    fontSize: 16,
    color: '#888',
  },
});

export default RestaurantDetailScreen;
