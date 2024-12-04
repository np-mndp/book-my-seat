import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { API_URL } from "../configs/Constants";

let BookingScreen = ({ navigation, route }) => {
  let { user, token } = useSelector((state) => state.auth);

  const [loadIn, setLoadIn] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  const [loadOut, setLoadOut] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  let [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  let [customer, setCustomer] = useState(user);
  let [guests, setGuests] = useState(1);
  let [eventSpecial, setEventSpecial] = useState("");
  let [specialAccommodations, setSpecialAccommodations] = useState(false);
  let [note, setNote] = useState("");
  let [isSpecialOccasion, setIsSpecialOccasion] = useState(false);

  let restaurant = route.params?.restaurant ?? {
    title: "THE GOOD SON'S CAFE AND BAR",
    location: { address: "124 St. Clair Ave" },
    description:
      "Aliquam id eros ipsum. Nulla vitae varius urna. Sed vulputate ligula id tellus tincidunt sodales. Phasellus et lacinia purus.",
    images: ["https://via.placeholder.com/150"],
  };

  useEffect(() => {
    navigation.setOptions({ title: restaurant.title }); // Set screen title
  }, [navigation]);

  let incrementGuests = () => {
    setGuests(guests + 1);
  };

  let decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  let handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer,
          guests,
          isSpecialOccasion,
          eventSpecial,
          specialAccommodations,
          note,
          RestaurantId: route.params?.restaurant?.id,
          loadIn,
          loadOut,
        }),
      });
      // console.log(response)
      if (response.ok) {
        Alert.alert(
          "Booking Confirmed",
          `Your table for ${guests} at ${restaurant.title} has been booked!`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Booking History", {title: restaurant.title}),
            },
          ]
        );
      } else {
        Alert.alert(
          `Error occurred while trying to book a table for ${guests} at ${restaurant.title}`
        );
      }
    } catch (error) {
      Alert.alert(
        `Error occurred while trying to book a table for ${guests} at ${restaurant.title}`
      );
      console.log(`Booking Error: ${error}`);
    }
  };

  // Handle date/time picker
  const showDateTimePicker = () => {
    setOpenDateTimePicker(true);
  };

  const hideDateTimePicker = () => {
    setOpenDateTimePicker(false);
  };

  const handleDateTimeConfirm = (date) => {
    setLoadIn(moment(date).format("YYYY-MM-DD HH:mm:ss"));
    setLoadOut(moment(date).add(2, "hours").format("YYYY-MM-DD HH:mm:ss"));
    hideDateTimePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.restaurantInfo}>
        <Image
          source={{ uri: restaurant.images[0] }}
          style={styles.restaurantImage}
        />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantAddress}>
            <MaterialIcons name="location-pin" size={16} color="#cb4539" />
            {restaurant.location.address}
          </Text>
          <Text style={styles.restaurantDescription}>
            {restaurant.description || "No description available."}
          </Text>
        </View>
      </View>

      {/* Booking Form */}
      <Text style={styles.bookingTitle}>Booking Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={customer.name}
        onChangeText={(name) => setCustomer({ ...customer, name })}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Phone"
          value={customer.phone}
          onChangeText={(phone) => setCustomer({ ...customer, phone })}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="E-Mail"
          value={customer.email}
          onChangeText={(email) => setCustomer({ ...customer, email })}
          keyboardType="email-address"
        />
      </View>

      {/* Number of Guests */}
      <View style={styles.row}>
        <Text style={styles.label}>Number of guests</Text>
        <View style={styles.guestControls}>
          <TouchableOpacity
            onPress={decrementGuests}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.guestNumber]}
            onChangeText={(text) => setGuests(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            value={String(guests)}
          />
          <TouchableOpacity
            onPress={incrementGuests}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Special Occasion Toggle */}
      <View style={styles.row}>
        <Switch
          value={isSpecialOccasion}
          onValueChange={setIsSpecialOccasion}
        />
        <Text style={styles.label}>Special Occasion?</Text>
      </View>
      {isSpecialOccasion && (
        <TextInput
          style={styles.input}
          placeholder="Occasion Name"
          value={eventSpecial}
          onChangeText={setEventSpecial}
        />
      )}

      {/* Special Accommodation Toggle */}
      <View style={styles.row}>
        <Switch
          value={specialAccommodations}
          onValueChange={setSpecialAccommodations}
        />
        <Text style={styles.label}>Special Accommodation required?</Text>
      </View>

      {/* Special Requests */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes and Special Requests"
        value={note}
        onChangeText={setNote}
        multiline={true}
        numberOfLines={4}
      />

      {/* Reservation Date and Time Picker */}
      <TouchableOpacity
        onPress={showDateTimePicker}
        style={styles.datePickerButton}
      >
        <Text style={styles.datePickerText}>
          {loadIn
            ? moment(loadIn).format("MMMM Do YYYY, h:mm A")
            : "Select Date & Time"}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={openDateTimePicker}
        mode="datetime"
        date={new Date(loadIn)}
        onConfirm={handleDateTimeConfirm}
        onCancel={hideDateTimePicker}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

let styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  restaurantInfo: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  restaurantImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  restaurantDetails: {
    marginLeft: 20,
    flex: 1,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  restaurantDescription: {
    fontSize: 12,
    color: "#555",
    fontFamily: "Roboto",
  },
  bookingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    fontFamily: "Roboto",
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontFamily: "Roboto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontFamily: "Roboto",
  },
  guestControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 22,
    color: "#fff",
    fontFamily: "Roboto",
  },
  guestNumber: {
    width: 60,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Roboto",
  },
  datePickerButton: {
    backgroundColor: "#cb4539",
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Roboto",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 10,
  },
});

export default BookingScreen;
