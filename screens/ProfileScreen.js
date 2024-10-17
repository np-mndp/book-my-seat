import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Importing icons

const ProfileScreen = ({ navigation }) => {
  // Static user data
  const userName = "Mandeep Neupane"; // Replace with dynamic data later
  const userEmail = "john.doe@example.com"; // Replace with dynamic data later
  const userPhone = "+1 234 567 8901"; // Replace with dynamic data later
  const userLocation = "Toronto, ON"; // Replace with dynamic data later

  const onSignOutPressed = () => {
    // Logic for sign out (navigate to login page)
    console.log("Sign out pressed");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="account-circle" size={80} color="#009c5b" />
        <Text style={styles.title}>{userName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userEmail}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userPhone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>{userLocation}</Text>
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={onSignOutPressed}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa", // Light background color
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555", // Darker label color
  },
  value: {
    fontSize: 16,
    color: "#333", // Darker text color for value
  },
  signOutButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ff4757", // Red color for sign out button
    borderRadius: 5,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
