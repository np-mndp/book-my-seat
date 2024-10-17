import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const MyBookingsScreen = () => {
  // Static booking data
  const bookings = [
    { id: '1', restaurant: "Restaurant A", date: "2024-10-20", time: "18:30" },
    { id: '2', restaurant: "Restaurant B", date: "2024-10-22", time: "19:00" },
    { id: '3', restaurant: "Restaurant C", date: "2024-10-25", time: "20:00" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.restaurantName}>{item.restaurant}</Text>
            <Text style={styles.bookingDetails}>
              Date: {item.date} | Time: {item.time}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bookingItem: {
    backgroundColor: "#fff", // White background for each booking
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000", // Shadow effect
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, // For Android shadow
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Darker text color for restaurant name
  },
  bookingDetails: {
    fontSize: 16,
    color: "#555", // Lighter text color for booking details
  },
});

export default MyBookingsScreen;
