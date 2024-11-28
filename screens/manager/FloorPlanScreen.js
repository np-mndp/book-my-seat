import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

const FloorPlanScreen = ({ navigation }) => {
  // Dummy data for tables
  const tables = [
    { id: "1", number: 1, x: 1, y: 1 },
    { id: "2", number: 2, x: 2, y: 1 },
    { id: "3", number: 3, x: 3, y: 1 },
    { id: "4", number: 4, x: 1, y: 2 },
    { id: "5", number: 5, x: 2, y: 2 },
    { id: "6", number: 6, x: 3, y: 2 },
    { id: "7", number: 7, x: 1, y: 3 },
    { id: "8", number: 8, x: 2, y: 3 },
    { id: "9", number: 9, x: 3, y: 3 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restaurant Floor Plan</Text>

      <ScrollView contentContainerStyle={styles.floorPlanContainer}>
        {/* Render Tables */}
        {tables.map((table) => (
          <View
            key={table.id}
            style={[
              styles.table,
              { left: `${table.x * 30}%`, top: `${table.y * 30}%` },
            ]}
          >
            <Text style={styles.tableNumber}>{table.number}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.editButton]}
        onPress={() => navigation.navigate('EditFloorPlanScreen')} // Navigate to the edit screen
      >
        <Text style={styles.buttonText}>Edit Restaurant Layout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  floorPlanContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    borderWidth: 2,
    borderColor: "#ddd",
    marginBottom: 20,
    backgroundColor: "#e2e2e2",
  },
  table: {
    position: "absolute",
    width: 40, // Reduced size
    height: 40, // Reduced size
    backgroundColor: "#3498db",
    borderRadius: 8, // Slightly more rounded
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  tableNumber: {
    fontSize: 14, // Smaller font size for the table number
    color: "#fff",
    fontWeight: "bold",
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
  editButton: {
    backgroundColor: "#f39c12", // Change the color for the edit button
    marginTop: 10,
  },
});

export default FloorPlanScreen;