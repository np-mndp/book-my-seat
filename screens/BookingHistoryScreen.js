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
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';


const BookingHistoryScreen = ({ navigation, route }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [recentBookingsVisible, setRecentBookingsVisible] = useState(true);
  const [oldBookingsVisible, setOldBookingsVisible] = useState(true);
  let { user, token } = useSelector((state) => state.auth);
  const [notificationIds, setNotificationIds] = useState({});
  const { setTitle } = route?.params;

  useFocusEffect(
    React.useCallback(() => {
      setTitle(`My Bookings`);
    }, [navigation])
  );

  useEffect(() => {
    // setTitle(`My Bookings`);
    fetchData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('Notification permissions are required to set reminders.');
      }
    }
  };
  

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

  const scheduleNotification = async (booking) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Booking Reminder",
        body: `Your booking at ${booking.Restaurant.title} is in one hour.`,
        data: { booking },
      },
      trigger: new Date(new Date(booking.loadIn).getTime() - 60 * 60 * 1000), // One hour before event
    });
    return notificationId;
  };
  
  const cancelNotification = async (notificationId) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  };

  const toggleModal = async (booking) => {
    setSelectedBooking(booking);
    setModalVisible(!isModalVisible);
  };

  const toggleNotification = async (booking) => {
    if (notificationIds[booking.id]) {
      // Cancel notification
      await cancelNotification(notificationIds[booking.id]);
      setNotificationIds((prev) => {
        const updated = { ...prev };
        delete updated[booking.id];
        return updated;
      });
      alert("Notification removed.");
    } else {
      // Schedule notification
      const notificationId = await scheduleNotification(booking);
      setNotificationIds((prev) => ({ ...prev, [booking.id]: notificationId }));
  
      // Calculate and show notification time
      const notificationTime = new Date(new Date(booking.loadIn).getTime() - 60 * 60 * 1000);
      alert(`Notification set for ${moment(notificationTime).format('dddd, MMMM Do YYYY, h:mm A')}`);
    }
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
              {item?.Restaurant?.location?.address ?? "N/A"}
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
      {recentBookingsVisible &&
        (bookings.bookings && bookings.bookings.length > 0 ? (
          <FlatList
            data={bookings.bookings}
            renderItem={({ item }) => renderBooking(item)}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Scroll fixed for ScrollView child
          />
        ) : (
          <Text style={styles.sectionHeaderText}>No booking available</Text>
        ))}

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
      {oldBookingsVisible &&
        (bookings.pastBookings && bookings.pastBookings.length > 0 ? (
          <FlatList
            data={bookings.pastBookings}
            renderItem={({ item }) => renderBooking(item)}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Scroll fixed for ScrollView child
          />
        ) : (
          <Text style={styles.sectionHeaderText}>No booking available</Text>
        ))}

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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
  <TouchableOpacity
    onPress={() => toggleNotification(selectedBooking)}
    style={[styles.notificationBox]}
  >
    <MaterialIcons
      name={notificationIds[selectedBooking?.id] ? "notifications-active" : "notifications-none"}
      size={24}
      color="#009c5b"
    />
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.closeButton]}
    onPress={() => setModalVisible(false)}
  >
    <Text style={styles.closeButtonText}>Close</Text>
  </TouchableOpacity>
</View>


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
    textAlign: "center",
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009c5b",
    padding: 10,
    flex: 0.65,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#009c5b", // Green border
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  notificationBox: {flex: 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#009c5b", // Green border
    padding: 8,
    borderRadius: 5,
}
});

export default BookingHistoryScreen;
