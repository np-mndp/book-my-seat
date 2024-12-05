import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { API_URL } from "../../configs/Constants";
import FloorPlanScreen from "./FloorPlanScreen";
import MenuActions from "./ManagerActions/MenuActions";
import TablesAction from "./ManagerActions/TablesAction";

const RestaurantScreen = ({ route, navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [addTables, setAddTables] = useState(false);
  const [addMenu, setAddMenu] = useState(false);
  const [tables, setTables] = useState(null);
  const [menu, setMenu] = useState(null);

  const { restaurant } = route.params;
  useEffect(() => {
    navigation.setOptions({ title: restaurant.title });

    fetchTables();
    fetchMenu();

    // console.log({tables, menu});
  }, []);

  // Function to fetch restaurant data
  const fetchTables = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurant.id}/tables`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const text = await response.text(); // Read the response as text

        // If text is not empty, parse it as JSON, otherwise set restaurants to null
        setTables(text ? JSON.parse(text) : null);
      } else {
        setTables(null);
        console.error("Failed to fetch restaurant Tables.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    }
  };
  const fetchMenu = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/restaurants/${restaurant.id}/menu`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const text = await response.text(); // Read the response as text

        // If text is not empty, parse it as JSON, otherwise set restaurants to null
        setMenu(text ? JSON.parse(text) : null);
      } else {
        setMenu(null);
        console.error("Failed to fetch restaurant menu.");
      }
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    }
  };

  // const onAddMenuPressed = () => {
  //   // Navigate to Add Menu screen
  //   navigation.navigate("AddMenuScreen", { restaurantId: restaurant.id });
  // };

  // const onAddTablesPressed = () => {
  //   // Navigate to Add Tables screen
  //   navigation.navigate("AddTablesScreen", { restaurantId: restaurant });
  // };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.restaurantDetailSection}>
          <Image
            source={{ uri: restaurant.images[0] }}
            style={styles.restaurantImage}
          />
          <Text style={styles.restaurantName}>{restaurant.title || "N/A"}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurant.description || "No description available."}
          </Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: restaurant.expensiveRating }, (_, index) => (
              <FontAwesome5
                key={index}
                name="dollar-sign"
                size={15}
                color="#DAA520"
              />
            ))}
          </View>
          <Text style={styles.restaurantAddress}>
            {restaurant.location.address || "N/A"}
          </Text>
          <Text style={styles.cuisineText}>
            {restaurant.cousine ? restaurant.cousine.join(", ") : "N/A"}
          </Text>
        </View>

        {tables && (
          <View style={styles.tableWrapper}>
            <View style={[styles.tableHeader, { backgroundColor: "#CFFCFC" }]}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000000",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Tables
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "100%",
                backgroundColor: "#00B3B3",
              }}
            >
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Seats
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Tables
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Place
                </Text>
              </View>
            </View>
            {tables.map((table, index) => (
              <View
              key={table.id}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  borderTopWidth: 1,
                }}
              >
                <View key={index} style={styles.tableHeader}>
                  <Text>{table.seats}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>{table.tableCount}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>{table.place}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {menu && (
          <View key={menu.id} style={styles.tableWrapper}>
            <View style={[styles.tableHeader, { backgroundColor: "#CFFCFC" }]}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000000",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                Menu
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: "100%",
                backgroundColor: "#00B3B3",
              }}
            >
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Type
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Name
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Price
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Description
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Calories
                </Text>
              </View>
              <View style={styles.tableHeader}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "#FFFF" }}
                >
                  Image
                </Text>
              </View>
            </View>
            {menu.map((item, index) => (
              <View
              key={menu.id}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  width: "100%",
                  borderTopWidth: 1,
                }}
              >
                <View key={index} style={styles.tableHeader}>
                  <Text>{item.type}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>{item.menuItem}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>{item.price}</Text>
                </View>
                <View
                  style={[styles.tableHeader, {}]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  <Text>
                    {item?.description?.length > 15
                      ? item?.description.slice(0, 15) + "..."
                      : item?.description}
                  </Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text>{item.calories}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.imagePreview}
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setAddMenu(true)}
          >
            <FontAwesome5
              name="utensils"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Menu</Text>
          </TouchableOpacity>

          {addMenu && (
            <MenuActions restaurantId={restaurant.id} setAddMenu={setAddMenu} />
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => setAddTables(true)}
          >
            <FontAwesome5
              name="table"
              size={20}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Add Tables</Text>
          </TouchableOpacity>
          {addTables && (
            <TablesAction
              restaurantId={restaurant.id}
              setAddTables={setAddTables}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  restaurantDetailSection: {
    padding: 15,
    alignItems: "center",
  },
  restaurantImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  restaurantDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },
  cuisineText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
  },
  buttonsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ca850",
    padding: 12,
    marginVertical: 5,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  tableWrapper: {
    width: "95%",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: "2%",
    marginVertical: 5,
  },
  tableHeader: {
    flex: 1,
    borderLeftWidth: 1,
    paddingHorizontal: 5,
  },
  imagePreview: {
    width: 50,
    height: 50,
    marginTop: 1,
    borderRadius: 5,
  },
});

export default RestaurantScreen;
