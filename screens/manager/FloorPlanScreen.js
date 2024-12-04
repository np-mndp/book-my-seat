import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const FloorPlanScreen = ({ navigation, route }) => {
  // Initial tables data
  const [tables, setTables] = useState([
    { seats: "", tableCount: "", place: "" },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      route?.params?.setTitle(`Floor Plan`);
    }, [navigation])
  );

  // Add new table set
  const addTableSet = () => {
    setTables([...tables, { seats: "", tableCount: "", place: "" }]);
  };

  // Remove table set
  const removeTableSet = (index) => {
    const newTables = tables.filter((_, idx) => idx !== index);
    setTables(newTables);
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedTables = [...tables];
    updatedTables[index][field] = value;
    setTables(updatedTables);
  };

  // Handle submit action
  const handleSubmit = () => {
    // Logic for submitting the data (e.g., sending to a server or saving to Firebase)
    console.log("Tables submitted:", tables);
    // Navigate back after submitting
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restaurant Floor Plan</Text>

      <ScrollView contentContainerStyle={styles.floorPlanContainer}>
        {tables.map((table, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardHeader}>Table Set {index + 1}</Text>

            <TextInput
              style={styles.input}
              placeholder="Seats"
              value={table.seats}
              onChangeText={(text) => handleInputChange(index, "seats", text)}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Table Count"
              value={table.tableCount}
              onChangeText={(text) =>
                handleInputChange(index, "tableCount", text)
              }
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Place"
              value={table.place}
              onChangeText={(text) => handleInputChange(index, "place", text)}
            />

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeTableSet(index)}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addTableSet}>
          <Text style={styles.addButtonText}>Add Another Set of Tables</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
    width: "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2ca850",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
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
});

export default FloorPlanScreen;
