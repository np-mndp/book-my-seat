import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { setUserLocation } from "../reducers/authReducer";

// Google API Key for location fetching
// const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_PLACES_API_KEY; // Replace with your Google API key

const SetLocationScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false); // For loading state
  const dispatch = useDispatch();

  // Handle getting the current location
  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.EXPO_PUBLIC_PLACES_API_KEY}`
      );

      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        const locationName = data.results[0].formatted_address;

        const locationData = {
          lat: latitude,
          long: longitude,
          name: locationName,
        };

        Alert.alert(
          "Confirm Location",
          `Name: ${locationData.name}\nLatitude: ${locationData.lat}\nLongitude: ${locationData.long}`,
          [
            {
              text: "OK",
              onPress: () => {
                setCurrentLocation(locationData);
                dispatch(setUserLocation(locationData));
                navigation.replace("TabView");
              },
            },
            {
              text: "Cancel",
              onPress: () => console.log("Location not confirmed"),
              style: "cancel",
            },
          ]
        );
      } else {
        alert("Unable to fetch location name.");
      }
    } catch (error) {
      console.error("Error getting location", error);
    }
  };

  // Handle searching for a location
  const handleSearchLocation = async () => {
    if (searchQuery.trim() === "") {
      Alert.alert("Please enter a search term");
      return;
    }

    setLoading(true); // Start loading when search begins

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=AIzaSyAyTHnJZq3WrKkL_4wAZRs9-ajlIK0EGbA`
      );

      const data = await response.json();
      
      

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        Alert.alert("No results found");
        return;
      }
      

      setPlaces(data.results);
    } catch (error) {
      console.error("Error searching for location", error);
      Alert.alert("An error occurred while searching for places.");
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  // Handle selecting a place from search results
  const handleSelectPlace = (place) => {
    const locationData = {
      lat: place.geometry.location.lat,
      long: place.geometry.location.lng,
      name: place.name,
    };

    setCurrentLocation(locationData);
    dispatch(setUserLocation(locationData));

    navigation.replace("TabView");
  };

  return (
    <View style={styles.container}>
      {/* Splash Screen Image */}
      <Image source={require("../assets/favicon.png")} style={styles.image} />

      <Text style={styles.title}>Welcome to Book My Seat</Text>
      <Text style={styles.subtitle}>Let's update your location to show you restaurants nearby</Text>

      {/* Button to get current location */}
      <TouchableOpacity style={styles.button} onPress={handleGetCurrentLocation}>
        <Text style={styles.buttonText}>Get Current Location</Text>
      </TouchableOpacity>

      {/* Search for a location */}
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for a place"
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearchLocation}>
        <Text style={styles.buttonText}>Search</Text>
        {loading && <ActivityIndicator size="small" color="#FFF" style={styles.loader} />}
      </TouchableOpacity>

      {/* Display search results */}
      {places.length > 0 && (
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.placeItem} onPress={() => handleSelectPlace(item)}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeAddress}>{item.formatted_address}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Display selected location */}
      {currentLocation && (
        <View style={styles.locationDetails}>
          <Text style={styles.locationText}>Selected Location:</Text>
          <Text style={styles.locationText}>Name: {currentLocation.name}</Text>
          <Text style={styles.locationText}>Latitude: {currentLocation.lat}, Longitude: {currentLocation.long}</Text>
        </View>
      )}
    </View>
  );
};

// Styling adapted to your requirements
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#009c5b",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 60,
    width: "100%",
    borderColor: "#009c5b",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#009c5b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    position: "absolute",
    right: 10,
  },
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#009c5b",
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009c5b",
  },
  placeAddress: {
    fontSize: 14,
    color: "#777",
  },
  locationDetails: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  locationText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SetLocationScreen;
