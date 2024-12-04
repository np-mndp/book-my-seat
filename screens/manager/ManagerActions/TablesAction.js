import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "../../../configs/Constants";

const TablesAction = ({ setAddTables, restaurantId }) => {
  const { user, token } = useSelector((state) => state.auth);
  // Initial tables data
  const [tables, setTables] = useState([
    { seats: "", tableCount: "", place: "" },
  ]);

  // Add new table set
  const addTableSet = () => {
    setTables([...tables, { seats: "", tableCount: "", place: "" }]);
  };

  // Remove table set
  const removeTableSet = (index) => {
    const newTables = tables.filter((_, idx) => idx !== index);
    setTables(newTables);
    tables.length <= 1 && setAddTables(false);
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedTables = [...tables];
    updatedTables[index][field] = value;
    setTables(updatedTables);
  };

  const handleSubmit = async () => {
    if (tables.some((item) => !item.seats || !item.tableCount || !item.place)) {
      Alert.alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurantId}/tables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tables }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Tables added !",
          "The menu items have been successfully added!"
        );
        setAddTables(false);
        setTables({ seats: "", tableCount: "", place: "" });
      } else {
        Alert.alert("Error", "Failed to add the menu items.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add the menu items.");
      console.error("Error:", error.stack);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Restaurant Floor Plan</Text>

      <ScrollView contentContainerStyle={styles.floorPlanContainer}>
        {tables.map((table, index) => (
          <View key={index} style={styles.tableSet}>
            <Text style={styles.tableSetHeader}>Table Set {index + 1}</Text>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                style={[styles.input, { width: "45%" }]}
                placeholder="Seats"
                value={table.seats}
                onChangeText={(text) => handleInputChange(index, "seats", text)}
                keyboardType="number-pad"
              />

              <TextInput
                style={[styles.input, { width: "45%" }]}
                placeholder="Table Count"
                value={table.tableCount}
                onChangeText={(text) =>
                  handleInputChange(index, "tableCount", text)
                }
                keyboardType="number-pad"
              />
            </View>
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

        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
          <Text style={styles.addButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  floorPlanContainer: {
    width: "100%",
  },
  tableSet: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  tableSetHeader: {
    fontSize: 16,
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
});

export default TablesAction;
