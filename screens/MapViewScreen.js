import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { PLACES_API_KEY } from '@env';

const MapScreenView = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);

  const mapRef = useRef(null);

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
      setCurrentLocationMarker({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
  
      // Update the MapView to center on the current location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.log("Error fetching location:", error);
    }
  };
  

// Function to fetch places from Google Places API
const handleSearch = async () => {
  if (!searchQuery) return;

  setLoading(true); // Show loader before fetching the data

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${PLACES_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Error from Places API:', data.error_message);
      return;
    }

    if (data.results) {
      setFilteredRestaurants(data.results);
      setPlaces(data.results);  // Update places state for markers
    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Error fetching places:', error);
  } finally {
    setLoading(false); // Hide loader after the response
  }
};


  // Function to move the map to a place's location
  const handleRestaurantPress = (place) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
    setFilteredRestaurants([]);
  };

  // Reset search query and results
  const handleResetSearch = () => {
    setSearchQuery("");
    setFilteredRestaurants([]);
  };

  // Search bar with location and reset button
  const searchSection = () => (
    <View>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search restaurants and places"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        {/* Search button with loader */}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#009c5b" />
          ) : (
            <MaterialCommunityIcons name="magnify" size={24} color="#009c5b" />
          )}
        </TouchableOpacity>
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
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRestaurantPress(item)} style={styles.resultItem}>
            {/* to do: Add an icon or image for restaurants */}
            <View style={styles.resultIcon}>
              <MaterialCommunityIcons name="store" size={24} color="#009c5b" />
            </View>
            
            <Text style={styles.resultText}>{item.name || 'Unnamed Place'}</Text>
          </TouchableOpacity>
        )}
        style={styles.resultList}
      />
    ) : null
  );
  

  // Map view with place markers
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
        {places.map((place) => (
          <Marker
            key={place.place_id}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
          />
        ))}
  
        {/* Marker for current location */}
        {currentLocationMarker && (
          <Marker
            coordinate={currentLocationMarker}
            title="My Location"
            pinColor="green"
          />
        )}
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
    padding: 3,
    borderRadius: 25,
    borderColor: "#009c5b",
    borderWidth: 1,
    margin: 8,
    elevation: 4, 
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
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
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 2,
    elevation: 3, 
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  resultText: {
    fontSize: 15,
    fontWeight: "500", 
    flex: 1,
  },
  resultList: {
    maxHeight:250,
    flexShrink: 1,
    marginHorizontal: 10, 
    padding: 10, 
    margin: 10,
    borderRadius: 10,
    borderColor: "#009c5b",
    borderWidth: 1,

  },
  resultIcon: {
    width: 15,
    height: 15,
    marginRight: 15,
    borderRadius: 20, 
    backgroundColor: "#f0f0f0", 
    justifyContent: "center",
    alignItems: "center",
  },
});


export default MapScreenView;

