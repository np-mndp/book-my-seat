import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';

const ReservationConfirmation = () => {
  return (
    <View style={styles.container}>
      {/* Restaurant Image */}
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/03/24/73/92/360_F_324739203_keeq8udvv0P2h1MLYJ0GLSlTBagoXS48.jpg' }}
        style={styles.restaurantImage}
      />

      {/* Restaurant Details */}
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>The Good Son's Cafe and Bar</Text>
        <Text style={styles.restaurantAddress}>123 Main St, Cityville</Text>
      </View>

      {/* Reservation Receipt */}
      <View style={styles.receiptContainer}>
        <Text style={styles.receiptTitle}>Reservation Confirmation</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Reference No:</Text>
          <Text style={styles.receiptValue}>ABC12345</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Name:</Text>
          <Text style={styles.receiptValue}>John Doe</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Guests:</Text>
          <Text style={styles.receiptValue}>4</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Time:</Text>
          <Text style={styles.receiptValue}>7:30 PM</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Date:</Text>
          <Text style={styles.receiptValue}>March 15, 2024</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => console.log("Call Restaurant")}>
          <Text style={styles.buttonText}>Call Restaurant</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.returnButton} onPress={() => console.log("Return")}>
          <Text style={styles.buttonText}>Return</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantDetails: {
    marginVertical: 10,
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ca850', // Green color to match UI
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#888',
  },
  receiptContainer: {
    width: '90%',
    backgroundColor: '#e0f7df',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  receiptTitle: {
    fontSize: 18, // Increased font size
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2ca850',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 16, // Increased font size
    color: '#555',
  },
  receiptValue: {
    fontSize: 16, // Increased font size
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#2ca850', // Match the green color in your UI
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  returnButton: {
    flex: 1,
    backgroundColor: '#2ca850', // Match the green color in your UI
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReservationConfirmation;