import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Button,
  Image
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { PLACES_API_KEY } from "@env";
import { API_URL } from "../configs/Constants";
import Slider from "@react-native-community/slider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const MapScreenView = ({ navigation })=> {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState([]);
  // const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [currentLocationMarker, setCurrentLocationMarker] = useState();
  const [restaurants, setRestaurants] = useState(); //results from backend
  const [sliderValue, setSliderValue] = useState(10);
  // const [bottomSheetVisibility, setBottomSheetVisibility] = useState(false);

  const sliderValues = [10, 20, 30, 40, 50];
  const snapPoints = useMemo(() => ["25%", "50%", "70%"], ["50%"]);
  const initialIndex = -1; // Ensure the BottomSheet starts in a closed state

  //ref for mapview
  const mapRef = useRef(null);
  // Ref for the Bottom Sheet
  const bottomSheetRef = useRef(null);

  // Function to open the Bottom Sheet
  const handleOpenBottomSheet = useCallback(() => {
    // console.log("On Open bottom sheet")
    bottomSheetRef.current?.expand(); // Expands to the first snap point
  }, []);

  // Function to close the Bottom Sheet
  const handleCloseBottomSheet = useCallback(() => {
    console.log("On close bottom sheet")
    bottomSheetRef.current?.close(); // Closes the Bottom Sheet
  }, []);

  // const showAlert = (data) => {
  //   Alert.alert(
  //     data.title,
  //     data.message,
  //     [
  //       {
  //         text: "OK",
  //         onPress: () => console.log("OK Pressed"),
  //         style: "default",
  //       },
  //     ],
  //     { cancelable: true } // User can dismiss the alert by tapping outside
  //   );
  // };

  // Fetch user's location when the component mounts
  useEffect(() => {
    const requestLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          Alert.alert("Error", "Permission for location was denied!");
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setCurrentLocationMarker((prev) => ({
          ...prev,
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        }));

        const newLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        // Update the MapView to center on the current location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newLocation, 1000);
        }
      } catch (error) {
        console.error("Error requesting location:", error);
        Alert.alert("Error", "Could not request for location, make sure you have given permission.");
      }
      // handleCloseBottomSheet()
    };
    requestLocation();
  }, []);

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
          console.log({ json });
          setRestaurants(json);
          // if(json.length > 0){
            handleOpenBottomSheet()
          // }
        } else {
          throw new Error("Failed to fetch restaurant data.");
          Alert.alert("Error", "Could not fetch restaurant data. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
        Alert.alert("Error", "Could not fetch restaurant data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    if (currentLocationMarker) {
      fetchData();
    }
  }, [currentLocationMarker, sliderValue]);

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
        setPlaces(data.results); // Update places state for markers
        // Animate to the first result's location
        const firstPlace = data.results[0];
        const region = {
          latitude: firstPlace.geometry.location.lat,
          longitude: firstPlace.geometry.location.lng,
          latitudeDelta: 0.01, // Adjust for desired zoom level
          longitudeDelta: 0.01,
        };

        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 1000); // Animate map to first result
        }
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
  const handlePlacesPress = (place) => {
    setCurrentLocationMarker({
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      title: place.name,
    });

    setLocation({
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
    setPlaces([]);
    // console.log(places)
    // console.log("PLACES========")
  };

  // Reset search query and results
  const handleResetSearch = () => {
    setSearchQuery("");
    setPlaces([]);
    setCurrentLocationMarker();
    setLocation();
    setSliderValue(10);
    handleCloseBottomSheet();
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
    places.length > 0 ? (
      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePlacesPress(item)}
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
        style={StyleSheet.absoluteFillObject}
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
            title={
              currentLocationMarker.title
                ? currentLocationMarker.title
                : "My Location"
            }
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

  const listItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Restaurant Details", { restaurantData: item })
        }
      >
        <View style={styles.restaurantItem}>
          <Image source={{ uri: item.images[0] }} style={styles.thumbnail} />

          <View style={styles.restaurantInfo}>
            <Text style={[styles.title, styles.primaryColor]}>
              {item.title}
            </Text>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-pin" size={16} color="#cb4539" />
              <Text style={styles.address}>{item.location.address}</Text>
            </View>
            <View style={styles.ratingContainer}>
              {Array.from({ length: item.expensiveRating }, (_, index) => (
                <FontAwesome
                  key={index}
                  name="dollar"
                  size={15}
                  color="#DAA520"
                />
              ))}
              {/* <FontAwesome name="dollar" size={15} color="black" />
              <Text style={styles.rating}>{item.expensiveRating}</Text> */}

              {/* {RatingStars(item.expensiveRating)} */}

              {/* <Text style={styles.expensiveness}>{item.expensiveRating}</Text> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
      {searchSection()}
      {slider()}
      {searchResultList()}
      {mapSection()}

      {/* Bottom Sheet */}
      
      <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={initialIndex}
      enablePanDownToClose // Allows dragging down to close
    >
      {/* Content inside Bottom Sheet */}
      <BottomSheetView style={styles.sheetContentContainer}>
  {restaurants && restaurants.length > 0 ? (
    <>
      <Text style={styles.sheetTitle}>Restaurants Nearby Locator</Text>
      <FlatList
        data={restaurants}
        renderItem={({ item }) => listItem(item)}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
  ) : (
    <>
      <Text style={styles.noDataMessage}>No restaurants available nearby.</Text>
      <Text style={styles.noDataMessage}>Try using a new location or increasing search radius</Text>
    </>
  )}
  <TouchableOpacity onPress={handleCloseBottomSheet} style={styles.closeButton}>
    <Text style={styles.closeButtonText}>Close</Text>
  </TouchableOpacity>
</BottomSheetView>
    </BottomSheet>
    </GestureHandlerRootView>
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
    ...StyleSheet.absoluteFillObject, // Full screen for MapView
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
  },
  sliderContainer: {
    marginBottom: 5,
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
  gestureContainer: {
    ...StyleSheet.absoluteFillObject, // Full screen to capture gestures
    justifyContent: 'flex-end', // Ensures BottomSheet is positioned at the bottom
  },
  sheetContentContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,  // Optional: for rounded bottom edges
    borderBottomRightRadius: 10, // Optional: for rounded bottom edges
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 5, // Add shadow effect
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sheetSubtitle: {
    fontSize: 14,
    color: '#666',
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
  noDataMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    margin: 8,
  },
  closeButton: {
    backgroundColor: '#009c5b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 4, // Add subtle shadow effect
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});


export default MapScreenView;
