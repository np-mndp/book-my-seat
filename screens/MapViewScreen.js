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
import { PLACES_API_KEY } from "@env";
import { API_URL } from "../configs/Constants";
import Slider from '@react-native-community/slider';

const MapScreenView = () => {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [currentLocationMarker, setCurrentLocationMarker] = useState({
    latitude: 43.6532,
    longitude: -79.3832,
  });
  const [restaurants, setRestaurants] = useState();

  const [sliderValue, setSliderValue] = useState(10);

  const sliderValues = [10, 20, 30, 40, 50];

  const mapRef = useRef(null);

  // Fetch restaurant data from the backend
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
          lat: currentLocationMarker.latitude,
          lng: currentLocationMarker.longitude,
          radius: sliderValue,
        });

        const response = await fetchWithTimeout(
          `${API_URL}/api/restaurants?${params}`,
          { method: "GET" },
          5000 // Timeout set to 5000ms (5 seconds)
        );
        if (response.ok) {
          const json = await response.json();
          // console.log({ json });

          setRestaurants(json.length > 0 ? json : restaurants);
        } else {
          throw new Error("Failed to fetch restaurant data.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchData();
  }, [currentLocationMarker]);

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
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });

      // Update the MapView to center on the current location
      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
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

      if (data.status !== "OK") {
        console.error("Error from Places API:", data.error_message);
        return;
      }

      if (data.results) {
        setFilteredRestaurants(data.results);
        setPlaces(data.results); // Update places state for markers
      } else {
        console.log("No results found");
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false); // Hide loader after the response
    }
  };

  // Move the map to the selected place's location
  const handleRestaurantPress = (place) => {
    setCurrentLocationMarker({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    });
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
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
    setSliderValue(10)
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
            <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
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
            {/* to do: Add an icon or image for restaurants */}
            <View style={styles.resultIcon}>
              <MaterialCommunityIcons name="store" size={24} color="#009c5b" />
            </View>

            <Text style={styles.resultText}>
              {item.name || "Unnamed Place"}
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
          latitude: currentLocationMarker.latitude,
          longitude: currentLocationMarker.longitude,
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

const slider = () => (
  <View style={styles.sliderContainer}>
  <Text style={styles.sliderLabel}>Search Radius: {sliderValue} KM</Text>
  <Slider
    style={styles.slider}
    minimumValue={0}
    maximumValue={1}
    step={1 / (sliderValues.length - 1)} // Steps are spaced according to sliderValues
    value={0} // Initial position corresponds to sliderValues[0]
    onValueChange={handleSliderValueChange}
    minimumTrackTintColor="#009c5b"
    maximumTrackTintColor="#cccccc"
    thumbTintColor="#ff6347"
  />
</View>
);
 
  // Map slider positions (0 to 1) to your custom values
  const getClosestValue = (sliderValue) => {
    const scaledValue = sliderValue * (sliderValues.length - 1); // Scale sliderValue (0-1) to array indices
    const index = Math.round(scaledValue);
    return sliderValues[index];
  };

  const handleSliderValueChange = (sliderValue) => {
    const closestValue = getClosestValue(sliderValue);
    setSliderValue(closestValue);
  };
  return (
    <View style={styles.container}>
      {searchSection()}
      {slider()}
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
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  locationButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#009c5b",
    padding: 10,
    borderRadius: 25,
    marginRight: 5,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 25,
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
    maxHeight: 250,
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
  },  sliderContainer: {
    marginBottom: 5,
    // paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    paddingVertical: 5,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 30,
  },
});

export default MapScreenView;
