import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const AddRestaurantScreen = ({ navigation }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [restaurantCuisine, setRestaurantCuisine] = useState('');
  const [restaurantContact, setRestaurantContact] = useState('');

  const handleSave = () => {
    // Add restaurant save logic (e.g., send data to Firebase)
    console.log({
      name: restaurantName,
      address: restaurantAddress,
      cuisine: restaurantCuisine,
      contact: restaurantContact,
    });
    alert('Restaurant added successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://wallpapers.com/images/featured/restaurant-background-2ez77umko2vj5w02.jpg",
          }}
          style={styles.banner}
        />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add Restaurant</Text>

        <TextInput
          style={styles.input}
          placeholder="Restaurant Name"
          placeholderTextColor="#999"
          value={restaurantName}
          onChangeText={setRestaurantName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#999"
          value={restaurantAddress}
          onChangeText={setRestaurantAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Cuisine"
          placeholderTextColor="#999"
          value={restaurantCuisine}
          onChangeText={setRestaurantCuisine}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={restaurantContact}
          onChangeText={setRestaurantContact}
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Restaurant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2ca850",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2ca850",
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddRestaurantScreen;