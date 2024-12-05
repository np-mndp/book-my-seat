import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "../../../configs/Constants";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Enum for Item Type
const ItemType = {
  FOOD: "Food",
  BEVERAGE: "Beverage",
};

const MenuActions = ({ restaurantId, setAddMenu }) => {
  const { token } = useSelector((state) => state.auth);
  console.log(restaurantId);

  const [menuItems, setMenuItems] = useState([
    {
      menuItem: "",
      description: "",
      price: "",
      images: [""],
      type: ItemType.FOOD,
      calories: "",
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedItems = [...menuItems];
    if (field === "price") {
      updatedItems[index][field] = parseFloat(value) || "";
    } else if (field === "calories") {
      updatedItems[index][field] = parseInt(value) || "";
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
        price: "",
        images: [""],
        type: ItemType.FOOD,
        calories: "",
      },
    ]);
  };

  const handleDelete = (index) => {
    const updatedItems = [...menuItems];
    updatedItems.splice(index, 1);
    setMenuItems(updatedItems);

    menuItems.length <= 1 && setAddMenu(false);
  };

  const handleSubmit = async () => {
    if (
      menuItems.some((item) => !item.menuItem || !item.price || !item.images[0])
    ) {
      Alert.alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurantId}/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            menu: menuItems,
          }),
        }
      );

      if (response.ok) {
        Alert.alert(
          "Menu Items Added",
          "The menu items have been successfully added!"
        );
        setAddMenu(false);
        setMenuItems({
          menuItem: "",
          description: "",
          price: "",
          images: [""],
          type: ItemType.FOOD,
          calories: "",
        });
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
      <View style={styles.card}>
        <Text style={styles.title}>Add Menu Items</Text>
        {menuItems?.map((item, index) => (
          <View key={index} style={styles.cardContent}>
            <TextInput
              style={styles.input}
              placeholder="Menu Item Name"
              value={item.menuItem}
              onChangeText={(text) =>
                handleInputChange(index, "menuItem", text)
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={item.description}
              onChangeText={(text) =>
                handleInputChange(index, "description", text)
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Type: </Text>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  item.type === ItemType.FOOD && styles.activeType,
                ]}
                onPress={() => handleInputChange(index, "type", ItemType.FOOD)}
              >
                <Text style={styles.typeButtonText}>Food</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  item.type === ItemType.BEVERAGE && styles.activeType,
                ]}
                onPress={() =>
                  handleInputChange(index, "type", ItemType.BEVERAGE)
                }
              >
                <Text style={styles.typeButtonText}>Beverage</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TextInput
                style={[styles.input, { width: "45%" }]}
                placeholder="Price"
                value={item.price ? item.price.toString() : ""}
                onChangeText={(text) =>
                  handleInputChange(
                    index,
                    "price",
                    text.replace(/[^0-9.]/g, "")
                  )
                }
                keyboardType="numeric"
              />

              <TextInput
                style={[styles.input, { width: "45%" }]}
                placeholder="Calories"
                value={item.calories ? item.calories.toString() : ""}
                onChangeText={(text) =>
                  handleInputChange(
                    index,
                    "calories",
                    text.replace(/[^0-9]/g, "")
                  )
                }
                keyboardType="numeric"
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={item.images[0]}
              onChangeText={(text) =>
                handleInputChange(index, "images", [text])
              }
            />

            {item.images[0] ? (
              <Image
                source={{ uri: item.images[0] }}
                style={styles.imagePreview}
              />
            ) : null}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(index)}
            >
              {/* <Text style={styles.deleteButtonText}>❌</Text> */}
              <MaterialIcons name="cancel" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity onPress={addItem} style={styles.addButton}>
            {/* <Text style={styles.addButtonText}>Add Another Item</Text> */}
            <MaterialIcons name="add-circle" size={24} color="green" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardContent: {
    marginBottom: 15,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
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
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
    width: "45%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    // flex: 1,
    width: "45%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    backgroundColor: "transparent",
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
    color: "#FF0000",
  },
});

export default MenuActions;
