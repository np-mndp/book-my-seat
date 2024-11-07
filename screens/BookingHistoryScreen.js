import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../configs/Constants";
import { useSelector } from "react-redux";
import moment from "moment";

const BookingHistoryScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let { user, token } = useSelector((state) => state.auth);

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
        const response = await fetchWithTimeout(`${API_URL}/api/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          setBookings(json);
        } else {
          throw new Error("Failed to fetch"); // Handle server errors
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator></ActivityIndicator>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const listItem = (item) => {
    return (
      <TouchableOpacity
        onPress={
          () => console.log(`Pressed`)

          //   navigation.navigate("Booking Details", { bookingData: item })
        }
      >
        <View style={styles.bookingCard}>
          <Image
            source={{ uri: item.Restaurant.images }}
            style={styles.thumbnail}
          />

          <View style={styles.bookingInfo}>
            <Text style={styles.title}>{item.Restaurant.title}</Text>
            <View style={styles.addressContainer}>
              <MaterialIcons name="location-pin" size={16} color="#cb4539" />
              <Text style={styles.address}>
                {item.Restaurant.location.address}
              </Text>
            </View>
            <View style={styles.bookingDetailsContainer}>
              <Text style={styles.bookingDetail}>
                Guest Count: {item.guests}
              </Text>
              <Text style={styles.bookingDetail}>
                Date: {moment(item.loadIn).format("dddd, MMMM Do YYYY")}
              </Text>
              <Text style={styles.bookingDetail}>
                Special Occasion: {item.eventSpecial}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={({ item }) => listItem(item)}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  bookingCard: {
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
  bookingInfo: {
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
  bookingDetailsContainer: {
    flexDirection: "column",
  },
  bookingDetail: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
});

export default BookingHistoryScreen;
