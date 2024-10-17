import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const navigation = useNavigation(); // Initialize navigation
  const { user, token } = useSelector((state) => state.auth);

  console.log({ "From Home page": { user, token } });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Find your</Text>
        <Text style={styles.headerText}>SEAT</Text>
        <Text style={styles.headerText}>for any occasion!</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={24} color="#666" />
        <TextInput
          placeholder="Restaurants and Menus"
          style={styles.searchInput}
        />
      </View>

      {/* Categories */}
      <View style={styles.categories}>
        <View style={styles.categoryItem}>
          <MaterialCommunityIcons name="coffee" size={40} color="#333" />
          <Text>Coffee</Text>
        </View>
        <View style={styles.categoryItem}>
          <MaterialCommunityIcons name="pizza" size={40} color="#333" />
          <Text>Pizza</Text>
        </View>
        <View style={styles.categoryItem}>
          <MaterialCommunityIcons name="hamburger" size={40} color="#333" />
          <Text>Burger</Text>
        </View>
      </View>

      {/* You might like Section */}
      <View style={styles.recommendation}>
        <Text style={styles.recommendationTitle}>You might like...</Text>
        <Image
          source={{
            uri: "https://via.placeholder.com/200",
          }}
          style={styles.restaurantImage}
        />
        <Text style={styles.restaurantName}>THE GOOD SON'S CAFE AND BAR</Text>
      </View>

      {/* See More Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Restaurant List")} // Navigate to Restaurant List
      >
        <Text style={styles.buttonText}>See More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  header: {
    backgroundColor: "#DFF3E3",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009c5b",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
  },
  recommendation: {
    alignItems: "center",
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  restaurantImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#009c5b",
  },
  button: {
    backgroundColor: "#009c5b",
    padding: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
