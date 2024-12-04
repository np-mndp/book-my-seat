import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { API_URL } from "../../configs/Constants";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";

const AddRestaurantScreen = ({ navigation, route }) => {
  let { user, token } = useSelector((state) => state.auth);
  useFocusEffect(
    React.useCallback(() => {
      route?.params?.setTitle(`Add new Restaurant`);
    }, [navigation])
  );

  //Restaurant Details
  const [title, setTitle] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");
  const [expensiveRating, setExpensiveRating] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [county, setCounty] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState("");
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState();

  const handleRatingChange = (text) => {
    // Allow only numbers
    const numericValue = text.replace(/[^0-9]/g, "");
    setExpensiveRating(numericValue);
  };

  const handleSearchLocation = async (query) => {
    if (query.trim() === "") {
      // Alert.alert("Please enter a search term");
      return setPlaces();
    }

    setLoading(true); // Start loading when search begins

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=AIzaSyAyTHnJZq3WrKkL_4wAZRs9-ajlIK0EGbA`
      );

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
        setPlaces("");
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
  const handleSelectPlace = async (place) => {
    const addressParts = place?.formatted_address?.split(",");
    const country = addressParts[addressParts.length - 1].trim(); // Extracts 'Canada' from the example

    setLatitude(place?.geometry?.location?.lat);
    setLongitude(place?.geometry?.location?.lng);
    setAddress(place?.name);
    setCounty(country);
    console.log(latitude, longitude, address);
    return setPlaces();

    // navigation.replace("TabView");
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          cousine: cuisine.split(",").map((item) => item.trim()), // Convert comma-separated string to an array
          description: description,
          expensiveRating: parseInt(expensiveRating, 10), // Convert to integer
          location: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            county: county,
            address: address,
          },
          images: images.split(",").map((item) => item.trim()), // Convert comma-separated string to an array
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Restaurant added successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("ManagerProfile"), // Replace with your target screen
          },
        ]);
      } else {
        Alert.alert("Error", "Failed to add the restaurant. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", `Error occurred: ${error.message}`);
    }
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
          onChangeText={handleRatingChange}
        />
        <TextInput
          style={styles.input}
          placeholder="Images (comma-separated URLs)"
          placeholderTextColor="#999"
          value={images}
          onChangeText={setImages}
        />
        <Text style={styles.sectionTitle}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#999"
          value={address}
          onChangeText={(query) => {
            let timeout;
            setAddress(query);
            if (timeout) clearTimeout(timeout);
            if (query.trim() !== "") {
              // Set a new timeout that executes the search after 2000ms of no typing
              timeout = setTimeout(() => {
                handleSearchLocation(query); // Trigger the search function
              }, 2000);
            }
          }}
        />
        {places?.length > 0 && (
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.placeItem}
                onPress={() => handleSelectPlace(item)}
              >
                <Text style={styles.placeName}>{item.name}</Text>
                <Text style={styles.placeAddress}>
                  {item.formatted_address}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="County"
          placeholderTextColor="#999"
          value={county}
          onChangeText={setCounty}
        />
        <View style={styles.latLngContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Latitude"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={latitude.toString()}
            // onChangeText={setLatitude}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Longitude"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={longitude.toString()}
            disabled={true}
          />
        </View>

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
    fontWeight: "600",
    color: "#444",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 15,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  button: {
    backgroundColor: "#2ca850",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  latLngContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  placeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#009c5b",
  },
});

export default AddRestaurantScreen;
