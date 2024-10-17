import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';

const MapScreenView = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const mapRef = useRef(null);

  // Example restaurant markers in Toronto
  const restaurants = [
    { id: 1, name: "Restaurant A", latitude: 43.65107, longitude: -79.347015 },
    { id: 2, name: "Restaurant B", latitude: 43.65707, longitude: -79.380715 },
    { id: 3, name: "Restaurant C", latitude: 43.64507, longitude: -79.383015 },
    { id: 4, name: "Restaurant D", latitude: 43.66207, longitude: -79.400715 },
    { id: 5, name: "Restaurant E", latitude: 43.67007, longitude: -79.320715 },
    { id: 6, name: "Restaurant F", latitude: 43.67107, longitude: -79.337015 },
    { id: 7, name: "Restaurant G", latitude: 43.66807, longitude: -79.330715 },
  ];

  // Handle search filtering
  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants
        .filter((restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)) // Sort by name in ascending order
        .slice(0, 5); // Limit to top 5
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants([]);
    }
  }, [searchQuery]);

  // Function to fetch current location
  const handleGetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setLocation(newLocation);

      // Update the MapView to center on the current location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };

  // Function to move the map to a restaurant's location
  const handleRestaurantPress = (restaurant) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  // Function to reset the search query and filtered restaurants
  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredRestaurants([]);
  };

  // Search bar with location and reset button
  const searchSection = () => (
    <View>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          placeholder="Search restaurants"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleGetCurrentLocation} style={styles.locationButton}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
          <Text style={styles.buttonText}>Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResetSearch} style={styles.resetButton}>
          <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Search result list below the search bar
  const searchResultList = () => (
    filteredRestaurants.length > 0 ? (
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRestaurantPress(item)} style={styles.resultItem}>
            <Text style={styles.resultText}>{item.name || 'Unnamed Restaurant'}</Text>
          </TouchableOpacity>
        )}
        style={styles.resultList}
      />
    ) : null
  );

  // Map view with restaurant markers
  const mapSection = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        initialRegion={{
          latitude: 43.6532,
          longitude: -79.3832,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            title={restaurant.name}
          />
        ))}
      </MapView>
    </View>
  );

  return (
    <View style={styles.container}>
      {searchSection()}
      {searchResultList()}
      {mapSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    borderColor: "#009c5b",
    borderWidth: 1,
    margin: 10,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", 
    marginVertical: 10,
    paddingHorizontal: 10, 
  },
  locationButton: {
    backgroundColor: "#009c5b",
    padding: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
    marginRight: 5, 
  },
  resetButton: {
    backgroundColor: "#ff6347", 
    padding: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
    marginLeft: 5, 
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 16,
  },
  resultList: {
    maxHeight: 200,
    margin: 15, 
  },
});

export default MapScreenView;
