import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ReservationConfirmation = ({ route, navigation }) => {
  const { title, reservationData } = route.params;

  return (
    <View style={styles.container}>
      {/* Restaurant Image */}
      <Image
        source={{ uri: 'https://img.freepik.com/free-vector/check-mark-green-3d_78370-4446.jpg' }}
        style={styles.restaurantImage}
      />

      {/* Restaurant Details */}
      <View style={styles.restaurantDetails}>
        <Text style={styles.restaurantName}>Restaurant: {title}</Text>
        <Text style={styles.restaurantAddress}>Table Number: {reservationData.TableId}</Text>
      </View>

      {/* Reservation Receipt */}
      <View style={styles.receiptContainer}>
        <Text style={styles.receiptTitle}>Reservation Confirmation</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Reference No:</Text>
          <Text style={styles.receiptValue}>{reservationData.id}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Name:</Text>
          <Text style={styles.receiptValue}>{reservationData.customer.name}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Guests:</Text>
          <Text style={styles.receiptValue}>{reservationData.guests}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Time:</Text>
          <Text style={styles.receiptValue}>
            {new Date(reservationData.loadIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Date:</Text>
          <Text style={styles.receiptValue}>
            {new Date(reservationData.loadIn).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Booking History')}
        >
          <Text style={styles.buttonText}>See All Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.navigate('TabView')}
        >
          <Text style={styles.buttonText}>Home Page</Text>
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
    width: 200,
    height: 200,
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
