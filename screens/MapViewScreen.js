import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { API_URL } from "../configs/Constants";


const MapScreenView = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const mapRef = useRef(null);
  const [restaurants, setRestaurants] = useState();

  // Example restaurant markers in Toronto
  //  [
  //   { id: 1, name: "Restaurant A", latitude: 43.65107, longitude: -79.347015 },
  //   { id: 2, name: "Restaurant B", latitude: 43.65707, longitude: -79.380715 },
  //   { id: 3, name: "Restaurant C", latitude: 43.64507, longitude: -79.383015 },
  //   { id: 4, name: "Restaurant D", latitude: 43.66207, longitude: -79.400715 },
  //   { id: 5, name: "Restaurant E", latitude: 43.67007, longitude: -79.320715 },
  //   { id: 6, name: "Restaurant F", latitude: 43.67107, longitude: -79.337015 },
  //   { id: 7, name: "Restaurant G", latitude: 43.66807, longitude: -79.330715 },
  // ];

  // Handle search filtering
  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants
        .filter((restaurant) =>
          restaurant.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title)) // Sort by name in ascending order
        .slice(0, 5); // Limit to top 5
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants([]);
    }
  }, [searchQuery]);


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
        setIsLoading(false); // Stop loading after fetching
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // if (error) {
  //   return <Text>Error: {error.message}</Text>;
  // }

  // Function to fetch current location
  const handleGetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
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

    if (data.results) {
      setFilteredRestaurants(data.results);
      setPlaces(data.results);  // Update places state for markers
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

      mapRef.current.animateToRegion(
        {
          latitude: restaurant.location.lat,
          longitude: restaurant.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );

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
        <TouchableOpacity
          onPress={handleGetCurrentLocation}
          style={styles.locationButton}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={24}
            color="#fff"
          />
          <Text style={styles.buttonText}>Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetSearch}
          style={styles.resetButton}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // Search result list below the search bar
  const searchResultList = () =>
    filteredRestaurants.length > 0 ? (
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (

          <TouchableOpacity
            onPress={() => handleRestaurantPress(item)}
            style={styles.resultItem}
          >
            <Text style={styles.resultText}>
              {item.title || "Unnamed Restaurant"}
            </Text>

          </TouchableOpacity>
        )}
        style={styles.resultList}
      />

    ) : null;


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

              latitude: restaurant.location.lat,
              longitude: restaurant.location.lng,
            }}
            title={restaurant.title}

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

    maxHeight: 200,
    margin: 15,

  },
});


export default MapScreenView;
