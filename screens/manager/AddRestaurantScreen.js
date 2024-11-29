import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const AddRestaurantScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [expensiveRating, setExpensiveRating] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [county, setCounty] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState('');

  const handleSave = () => {
    // Prepare data to match the database structure
    const restaurantData = {
      title: title,
      cuisine: cuisine.split(',').map((item) => item.trim()), // Convert comma-separated string to an array
      description: description,
      expensiveRating: parseInt(expensiveRating, 10), // Convert to integer
      location: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        county: county,
        address: address,
      },
      images: images.split(',').map((item) => item.trim()), // Convert comma-separated string to an array
    };

    console.log("Restaurant Data:", restaurantData);
    alert('Restaurant added successfully!');
    navigation.goBack();

    // Add logic to save `restaurantData` to Firebase
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
          placeholder="Restaurant Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Cuisine (comma-separated)"
          placeholderTextColor="#999"
          value={cuisine}
          onChangeText={setCuisine}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#999"
          multiline
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Expensive Rating (1-5)"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          value={expensiveRating}
          onChangeText={setExpensiveRating}
        />
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={latitude}
          onChangeText={setLatitude}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
          value={longitude}
          onChangeText={setLongitude}
        />
        <TextInput
          style={styles.input}
          placeholder="County"
          placeholderTextColor="#999"
          value={county}
          onChangeText={setCounty}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Images (comma-separated URLs)"
          placeholderTextColor="#999"
          value={images}
          onChangeText={setImages}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 20,
    marginBottom: 10,
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
