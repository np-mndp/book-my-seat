import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { API_URL } from "../configs/Constants";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { location, user, token } = useSelector((state) => state.auth);
  const [newBookings, setNewBookings] = useState(null);
  const [oldBookings, setOldBookings] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setTitle } = route?.params;

  useFocusEffect(
    React.useCallback(() => {
      setTitle(`Profile`);
    }, [navigation])
  );

  const userLocation = location.name;

  const onSignOutPressed = () => {
    Alert.alert("Sign Out", "User Signed out successfully!", [
      {
        text: "OK",
        onPress: () => {
          navigation.replace("Login");
          dispatch(logoutUser());
        },
      },
    ]);
  };

  const onUpdateLocation = () => {
    navigation.replace("SetLocation");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const json = await response.json();
          setNewBookings(json.bookings); // upcoming bookings
          setOldBookings(json.pastBookings); // old bookings
        } else {
          throw new Error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Profile Header Section */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: user?.profilePicture || "https://via.placeholder.com/100",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || "John Doe"}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {newBookings ? newBookings.length : 0}
                </Text>
                <Text style={styles.statLabel}>Upcoming Resos</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>
                  {oldBookings ? oldBookings.length : 0}
                </Text>
                <Text style={styles.statLabel}>Old Resos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.detailsCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>
              {user?.email || "john.doe@example.com"}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user?.phone || "123-456-7890"}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.infoRow}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.value}>{userLocation}</Text>
          </View>
        </View>

        {/* Upcoming Bookings Section */}
        <View style={styles.reservationsContainer}>
          <Text style={styles.title}>Upcoming Bookings</Text>
          {newBookings?.length > 0 ? (
            <FlatList
              data={newBookings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Image
                    source={{
                      uri:
                        item?.Restaurant?.images?.[0] || "fallback-image-uri",
                    }}
                    style={styles.bookingImage}
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.restaurantName}>
                      {item?.Restaurant?.title || "Unknown Restaurant"}
                    </Text>
                    <Text style={styles.bookingDetails}>
                      Date:{" "}
                      {moment(item?.loadIn).isValid()
                        ? moment(item.loadIn).format("MMMM Do YYYY, h:mm a")
                        : "Invalid Date"}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.midText}>No Upcoming Bookings</Text>
          )}
        </View>

        {/* Old Bookings Section */}
        <View style={styles.reservationsContainer}>
          <Text style={styles.title}>Old Bookings</Text>
          {oldBookings?.length > 0 ? (
            <FlatList
              data={oldBookings}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Image
                    source={{
                      uri:
                        item?.Restaurant?.images?.[0] || "fallback-image-uri",
                    }}
                    style={styles.bookingImage}
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.restaurantName}>
                      {item?.Restaurant?.title || "Unknown Restaurant"}
                    </Text>
                    <Text style={styles.bookingDetails}>
                      Date:{" "}
                      {moment(item?.loadIn).isValid()
                        ? moment(item.loadIn).format("MMMM Do YYYY, h:mm a")
                        : "Invalid Date"}
                    </Text>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.midText}>No Old Bookings</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.updateLocationButton}
          onPress={onUpdateLocation}
        >
          <Text style={styles.signOutButtonText}>Update My Location</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={onSignOutPressed}
        >
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2ca850",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
  },
  detailsCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginVertical: 10,
  },
  reservationsContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  bookingItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  bookingInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  bookingDetails: {
    fontSize: 14,
    color: "#555",
  },
  midText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    padding: 15,
  },
  updateLocationButton: {
    backgroundColor: "#2ca850",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProfileScreen;
