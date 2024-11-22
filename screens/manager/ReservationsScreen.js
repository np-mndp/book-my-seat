import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons

const ReservationsScreen = ({ navigation }) => {
  // Dummy data for reservations
  const reservations = [
    { id: "1", name: "John Doe", people: 4, time: "12:30 PM" },
    { id: "2", name: "Jane Smith", people: 2, time: "1:00 PM" },
    { id: "3", name: "Sam Wilson", people: 6, time: "1:30 PM" },
    { id: "4", name: "Anna Lee", people: 3, time: "2:00 PM" },
    { id: "5", name: "Tommy Taylor", people: 5, time: "2:30 PM" },
    { id: "6", name: "Emily Johnson", people: 2, time: "3:00 PM" },
    { id: "7", name: "David Brown", people: 4, time: "3:30 PM" },
    { id: "8", name: "Sarah White", people: 7, time: "4:00 PM" },
  ];

  // Calculate first and last reservation times and total people
  const firstResoTime = reservations[0]?.time;
  const lastResoTime = reservations[reservations.length - 1]?.time;
  const totalPeople = reservations.reduce((total, res) => total + res.people, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reservations</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <MaterialIcons name="schedule" size={24} color="#2ca850" />
          <Text style={styles.summaryText}>First reservation time: {firstResoTime}</Text>
        </View>
        <View style={styles.summaryItem}>
          <MaterialIcons name="people" size={24} color="#e67e22" />
          <Text style={styles.summaryText}>Total number of people: {totalPeople}</Text>
        </View>
        <View style={styles.summaryItem}>
          <MaterialIcons name="schedule" size={24} color="#3498db" />
          <Text style={styles.summaryText}>Last reservation time: {lastResoTime}</Text>
        </View>
      </View>

      {/* List of reservations */}
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reservationCard}>
            <Text style={styles.cardHeader}>{item.name}</Text>
            <View style={styles.reservationDetails}>
              <Text style={styles.detailText}>People: {item.people}</Text>
              <Text style={styles.detailText}>Time: {item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  reservationCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  reservationDetails: {
    paddingLeft: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#2ca850",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    marginBottom: 50,
  },
});

export default ReservationsScreen;