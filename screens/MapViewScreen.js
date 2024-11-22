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
import { PLACES_API_KEY, API_URL } from "@env";

const MapScreenView = () => {
  const [location, setLocation] = useState(null);
  const [currentLocationMarker, setCurrentLocationMarker] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);

  // Handle search filtering
  useEffect(() => {
    if (searchQuery) {
      const filtered = restaurants
        .filter((restaurant) =>
          restaurant.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => a.title.localeCompare(b.title)) // Sort by name
        .slice(0, 5); // Limit to top 5
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants([]);
    }
  }, [searchQuery, restaurants]);

  // Fetch restaurant data from the backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/restaurants?lat=43.676022&lng=-79.411049`
        );
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data || []);
        } else {
          throw new Error("Failed to fetch restaurant data.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Fetch current location
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

      if (mapRef.current) {
        mapRef.current.animateToRegion(newLocation, 1000);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Fetch places from Google Places API
  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${PLACES_API_KEY}`
      );
      const data = await response.json();
      if (data.results) {
        setFilteredRestaurants(data.results);
        setPlaces(data.results);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  // Move the map to the selected place's location
  const handleRestaurantPress = (place) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: place.geometry?.location.lat || place.location.lat,
          longitude: place.geometry?.location.lng || place.location.lng,
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

  return (
    <View style={styles.container}>
      {/* Search Section */}
      <View>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search restaurants and places"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
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

          <TouchableOpacity onPress={handleResetSearch} style={styles.resetButton}>
            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      {filteredRestaurants.length > 0 && (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.place_id || item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleRestaurantPress(item)}
              style={styles.resultItem}
            >
              <MaterialCommunityIcons name="store" size={24} color="#009c5b" />
              <Text style={styles.resultText}>{item.name || item.title || "Unnamed Place"}</Text>
            </TouchableOpacity>
          )}
          style={styles.resultList}
        />
      )}

      {/* Map Section */}
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
                latitude: place.geometry?.location.lat || place.location.lat,
                longitude: place.geometry?.location.lng || place.location.lng,
              }}
              title={place.name || place.title}
            />
          ))}
          {currentLocationMarker && (
            <Marker
              coordinate={currentLocationMarker}
              title="My Location"
              pinColor="green"
            />
          )}
        </MapView>
      </View>
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
    padding: 5,
    borderRadius: 25,
    margin: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  searchButton: {
    padding: 10,
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
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 3,
  },
  resultText: {
    marginLeft: 10,
    fontSize: 16,
  },
  resultList: {
    maxHeight: 250,
    margin: 10,
  },
});

export default MapScreenView;
