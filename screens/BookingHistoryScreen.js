import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../configs/Constants";
import { useSelector } from "react-redux";
import moment from "moment";
import { ReactNativeModal } from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [recentBookingsVisible, setRecentBookingsVisible] = useState(true);
  const [oldBookingsVisible, setOldBookingsVisible] = useState(true);
  let { user, token } = useSelector((state) => state.auth);

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

  const toggleModal = (booking) => {
    setSelectedBooking(booking);
    setModalVisible(!isModalVisible);
  };

  const renderBooking = (item) => (
    <TouchableOpacity onPress={() => toggleModal(item)}>
      <View style={styles.bookingCard}>
        <Image
          source={{ uri: item.Restaurant.images[0] }}
          style={styles.thumbnail}
        />
        <View style={styles.bookingInfo}>
          <Text style={styles.title}>{item.Restaurant.title}</Text>
          <View style={styles.addressContainer}>
            <MaterialIcons name="location-pin" size={16} color="#cb4539" />
            <Text style={styles.address}>
            {selectedBooking?.Restaurant?.location?.address ?? "N/A"}
            </Text> 
          </View>
          <View style={styles.bookingDetailsContainer}>
            <Text style={styles.bookingDetail}>
              Date: {moment(item.loadIn).format("dddd, MMMM Do YYYY")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>My bookings</Text>
      {/* Recent Bookings */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setRecentBookingsVisible(!recentBookingsVisible)}
      >
        <Text style={styles.sectionHeaderText}>Upcoming Bookings</Text>
        <MaterialIcons
          name={
            recentBookingsVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
          }
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      {recentBookingsVisible && (
  bookings.bookings && bookings.bookings.length > 0 ? (
    <FlatList
      data={bookings.bookings}
      renderItem={({ item }) => renderBooking(item)}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false} // Scroll fixed for ScrollView child
    />
  ) : (
    <Text style={styles.sectionHeaderText}>No booking available</Text>
  )
)}

      {/* Old Bookings */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setOldBookingsVisible(!oldBookingsVisible)}
      >
        <Text style={styles.sectionHeaderText}>Past Bookings</Text>
        <MaterialIcons
          name={
            oldBookingsVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
          }
          size={24}
          color="#666"
        />
      </TouchableOpacity>
      {oldBookingsVisible && (
  bookings.pastBookings && bookings.pastBookings.length > 0 ? (
    <FlatList
      data={bookings.pastBookings}
      renderItem={({ item }) => renderBooking(item)}
      keyExtractor={(item) => item.id.toString()}
      scrollEnabled={false} // Scroll fixed for ScrollView child
    />
  ) : (
    <Text style={styles.sectionHeaderText}>No booking available</Text>
  )
)}

      {/* Booking Details Modal */}
      <ReactNativeModal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        {selectedBooking ? (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedBooking.Restaurant.title}
            </Text>
            <Image
              source={{ uri: selectedBooking.Restaurant.images[0] }}
              style={styles.modalImage}
            />
            <Text style={styles.modalDetail}>
              Address: {selectedBooking?.Restaurant?.location?.address ?? "N/A"}
            </Text>
            <Text style={styles.modalDetail}>
              Date:{" "}
              {moment(selectedBooking.loadIn).format("dddd, MMMM Do YYYY")}
            </Text>
            <Text style={styles.modalDetail}>
              Guest Count: {selectedBooking.guests}
            </Text>
            <Text style={styles.modalDetail}>
              Special Occasion: {selectedBooking.eventSpecial}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Fallback content when no booking is selected
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>No booking selected</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </ReactNativeModal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    margin: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#14AE5C",
    textAlign: "center",
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center"
  },
  bookingCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bookingInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#009c5b",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default BookingHistoryScreen;
