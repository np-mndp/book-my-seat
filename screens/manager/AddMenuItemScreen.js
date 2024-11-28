import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "../../configs/Constants"

// Enum for Item Type
const ItemType = {
  FOOD: "Food",
  BEVERAGE: "Beverage",
};

const AddMenuItemScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [menuItems, setMenuItems] = useState([
    {
      menuItem: "",
      description: "",
      price: "", // Price will be treated as a decimal
      images: [""],
      type: ItemType.FOOD, // Default type to "Food"
      calories: "", // Calories will be treated as an integer
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    // If field is price, parse it as a float (decimal)
    if (field === "price") {
      updatedItems[index][field] = parseFloat(value) || ""; // Default to empty if invalid input
    }
    // If field is calories, parse it as an integer
    else if (field === "calories") {
      updatedItems[index][field] = parseInt(value) || ""; // Default to empty if invalid input
    } else {
      updatedItems[index][field] = value;
    }
    setMenuItems(updatedItems);
  };

  const addItem = () => {
    setMenuItems([
      ...menuItems,
      {
        menuItem: "",
        description: "",
        price: "", // Default value for price
        images: [""],
        type: ItemType.FOOD, // Default type to "Food"
        calories: "", // Default value for calories
      },
    ]);
  };

  const handleDelete = (index) => {
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1); // Remove the item at the specified index
    setMenuItems(updatedItems);
  };

  const handleSubmit = async () => {
    if (menuItems.some(item => !item.menuItem || !item.price || !item.images[0])) {
      Alert.alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/menu-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu: menuItems,
        }),
      });

      if (response.ok) {
        Alert.alert("Menu Items Added", "The menu items have been successfully added!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to add the menu items.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add the menu items.");
      console.error("Error:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Menu Items</Text>

      {menuItems.map((item, index) => (
        <View key={index} style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Menu Item Name"
            value={item.menuItem}
            onChangeText={(text) => handleInputChange(index, "menuItem", text)}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={item.description}
            onChangeText={(text) => handleInputChange(index, "description", text)}
            multiline
            numberOfLines={4}
          />

<View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Type: </Text>
            <TouchableOpacity
              style={[styles.typeButton, item.type === ItemType.FOOD && styles.activeType]}
              onPress={() => handleInputChange(index, "type", ItemType.FOOD)}
            >
              <Text style={styles.typeButtonText}>Food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, item.type === ItemType.BEVERAGE && styles.activeType]}
              onPress={() => handleInputChange(index, "type", ItemType.BEVERAGE)}
            >
              <Text style={styles.typeButtonText}>Beverage</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Price"
            value={item.price ? item.price.toString() : ""}
            onChangeText={(text) => handleInputChange(index, "price", text.replace(/[^0-9.]/g, ""))} // Allow only numbers and decimals
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Calories"
            value={item.calories ? item.calories.toString() : ""}
            onChangeText={(text) => handleInputChange(index, "calories", text.replace(/[^0-9]/g, ""))} // Allow only numbers
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={item.images[0]}
            onChangeText={(text) => handleInputChange(index, "images", [text])}
          />

          {item.images[0] ? (
            <Image source={{ uri: item.images[0] }} style={styles.imagePreview} />
          ) : null}

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(index)}
          >
            <Text style={styles.deleteButtonText}>❌</Text>
          </TouchableOpacity>

          
        </View>
      ))}

      <TouchableOpacity onPress={addItem} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Another Item</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 26,
    fontFamily: "Roboto-Bold",  // Using Roboto Bold font
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    position: "relative", // To position the delete button
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    fontFamily: "Roboto-Regular",  // Using Roboto Regular font
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 16,
    fontFamily: "Roboto-Regular", // Using Roboto Regular font
    marginRight: 10,
    alignSelf: "center",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginRight: 10,
  },
  activeType: {
    backgroundColor: "#4CAF50",
  },
  typeButtonText: {
    color: "#fff",
    fontFamily: "Roboto-Bold", // Using Roboto Bold font for buttons
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Bold", // Using Roboto Bold font for buttons
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto-Bold", // Using Roboto Bold font for buttons
  },
  deleteButton: {
    marginTop: 10, // Adding space above the delete button
    alignSelf: "flex-end", // To align it at the right bottom
    backgroundColor: "transparent",
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
    color: "#FF0000", // Red color for delete
  },
});

export default AddMenuItemScreen;