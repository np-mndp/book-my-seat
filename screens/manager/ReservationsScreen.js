import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator, RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // For icons
import { API_URL } from "../../configs/Constants";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const ReservationsScreen = ({ navigation, route }) => {
  let { user, token } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { title, setTitle } = route?.params;
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setTitle(`Reservations`);
    }, [navigation])
  );

  useEffect(() => {
    fetchData();
  }, []);

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
        // Sort bookings by loadIn date
        const sortedBookings = json.bookings.sort((a, b) =>
          moment(a.loadIn).isBefore(moment(b.loadIn)) ? -1 : 1
        );
        setBookings(sortedBookings);
      } else {
        throw new Error(`Failed to fetch ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error.stack);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData()
      .then(() => setRefreshing(false)) // Stop refreshing after data fetch
      .catch(() => setRefreshing(false)); // Handle any errors
  };

  // Calculate first and last reservation times and total people from API response
  const firstResoTime = bookings.length > 0 ? moment(bookings[0].loadIn).calendar() : "";
  const lastResoTime =
    bookings.length > 0
      ? moment(bookings[bookings.length - 1].loadIn).calendar()
      : "";
  const totalPeople = bookings.reduce((total, booking) => total + booking.guests, 0);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#009c5b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <MaterialIcons name="schedule" size={24} color="#2ca850" />
          <Text style={styles.summaryText}>
            First reservation time: {firstResoTime}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <MaterialIcons name="people" size={24} color="#e67e22" />
          <Text style={styles.summaryText}>
            Total number of people: {totalPeople}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <MaterialIcons name="schedule" size={24} color="#3498db" />
          <Text style={styles.summaryText}>
            Last reservation time: {lastResoTime}
          </Text>
        </View>
      </View>

      {/* List of reservations */}
      <FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reservationCard}>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.cardHeader, { color: "#e67e22" }]}>
                {item.customer?.name}
              </Text>
              <Text> @ </Text>
              <Text style={[styles.cardHeader, { color: "#2ca850" }]}>
                {item.Restaurant?.title}
              </Text>
            </View>
            <View style={styles.reservationDetails}>
              <Text style={styles.detailText}>People: {item.guests}</Text>
              <Text style={styles.detailText}>
                Time: {moment(item.loadIn).calendar()}
              </Text>
              {item.eventSpecial && (
                <Text style={styles.detailText}>Event: {item.eventSpecial}</Text>
              )}
              {item.note && (
                <Text style={styles.detailText}>Note: {item.note}</Text>
              )}
              {item.specialAccomodations && (
               <Text style={styles.detailText}>
               {`Special Accommodations: ${
                 item.specialAccomodations && Object.keys(item.specialAccomodations).length > 0 
                   ? JSON.stringify(item.specialAccomodations) 
                   : "N/A"
               }`}
             </Text>
              
               )}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  reservationCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
  },
  reservationDetails: {
    paddingLeft: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 5,
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
  listContainer: {
    marginBottom: 50,
  },
});

export default ReservationsScreen;
