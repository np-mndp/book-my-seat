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

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState(null);

  // Dummy data for reservations
  const dummyBookings = [
    {
      id: "1",
      restaurant: "Joe's Diner",
      date: "2024-11-30",
      time: "7:00 PM",
      image:
        "https://assets.cntraveller.in/photos/63d8e5103d7229d4cf308f01/16:9/w_1024,c_limit/Prequel-lead.jpg",
    },
    {
      id: "2",
      restaurant: "La Bella Italia",
      date: "2024-11-25",
      time: "6:30 PM",
      image:
        "https://assets.cntraveller.in/photos/63d8e5103d7229d4cf308f01/16:9/w_1024,c_limit/Prequel-lead.jpg",
    },
  ];

  const userLocation = "Toronto, ON";

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
          setBookings(json);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error("Error:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                <Text style={styles.statValue}>10</Text>
                <Text style={styles.statLabel}>Last Month Resos</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>50</Text>
                <Text style={styles.statLabel}>All-Time Resos</Text>
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

        {/* Reservation List Section */}
        <View style={styles.reservationsContainer}>
          <Text style={styles.title}>Upcoming Bookings</Text>
          {bookings && (
            <FlatList
              data={bookings.bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Image
                    source={{ uri: item.Restaurant.images[0] }}
                    style={styles.bookingImage}
                  />
                  <View style={styles.bookingInfo}>
                    <Text style={styles.restaurantName}>
                      {item.Restaurant.title}
                    </Text>
                    <Text style={styles.bookingDetails}>
                      Date: {moment(item.loadIn).format("MMMM Do YYYY, h:mm a")}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>

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
    padding: 20,
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
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
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 15,
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
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  reservationsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  bookingItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  bookingInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  bookingDetails: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ProfileScreen;
