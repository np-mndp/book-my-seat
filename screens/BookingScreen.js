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
  Switch,
} from "react-native";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { API_URL } from "../configs/Constants";

let BookingScreen = ({ navigation, route }) => {
  let { user, token } = useSelector((state) => state.auth);
  let [startDate, setStartDate] = useState(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  let [openStartDate, setOpenStartDate] = useState(false);
  let [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD HH:mm:ss"));
  let [openEndDate, setOpenEndDate] = useState(false);
  let [customer, setCustomer] = useState(user);
  let [guests, setGuests] = useState(1);
  let [eventSpecial, setEventSpecial] = useState("");
  let [specialAccommodations, setSpecialAccommodations] = useState(false);
  let [specialRequest, setSpecialRequest] = useState("");
  let [isSpecialOccasion, setIsSpecialOccasion] = useState(false);

  let restaurant = route.params?.restaurant ?? {
    title: "THE GOOD SON'S CAFE AND BAR",
    location: { address: "124 St. Clair Ave" },
    description:
      "Aliquam id eros ipsum. Nulla vitae varius urna. Sed vulputate ligula id tellus tincidunt sodales. Phasellus et lacinia purus.",
    images: ["https://via.placeholder.com/150"],
  };

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
          specialRequest,
          RestaurantId: route.params?.restaurant?.id,
        }),
      });
      if (response.ok) {
        Alert.alert(
          "Booking Confirmed",
          `Your table for ${guests} at ${restaurant.title} has been booked!`,
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      }
    } catch (error) {
      Alert.alert(
        `Error occured while trying to book a table for ${guests} at ${restaurant.title} has been booked! `
      );
      console.log(`Booking Error: ${error}`);
    }
    // console.log({
    //   customer,
    //   guests,
    //   isSpecialOccasion,
    //   eventSpecial,
    //   specialAccommodations,
    //   specialRequest,
    // });

    Alert.alert(
      "Booking Confirmed",
      `Your table for ${guests} at ${restaurant.title} has been booked!`,
      [{ text: "OK", onPress: () => navigation.navigate("Home") }]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Restaurant Image and Details */}
      <View style={styles.restaurantInfo}>
        <Image
          source={{ uri: restaurant.images[0] }}
          style={styles.restaurantImage}
        />
        <View style={styles.restaurantDetails}>
          <Text style={styles.restaurantName}>{restaurant.title}</Text>
          <Text style={styles.restaurantAddress}>
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
            style={styles.guestNumber}
            onChangeText={(text) => setGuests(text.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
          >
            {guests}
          </TextInput>
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

      <View style={[styles.column, { justifyContent: "space-around" }]}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text>Start Date Time</Text>
          <TouchableOpacity onPress={() => setOpenStartDate(true)}>
            <Text>
              {moment(startDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Text>End Date Time</Text>
          <TouchableOpacity onPress={() => setOpenEndDate(true)}>
            <Text>
              {moment(endDate).format("dddd, MMMM Do YYYY, h:mm:ss a")}
            </Text>
          </TouchableOpacity>
        </View>

        {openStartDate && (
          <DateTimePickerModal
            isVisible={true}
            mode="datetime"
            is24Hour={false}
            minimumDate={new Date()}
            onConfirm={(dateTime) => {
              console.log(`Confirmed Date and time: ${dateTime}`);
              setStartDate(moment(dateTime).toISOString());
              setOpenStartDate(false);
            }}
            onCancel={console.log("Cancelled")}
          />
        )}
        {openEndDate && (
          <DateTimePickerModal
            isVisible={true}
            mode="datetime"
            is24Hour={false}
            minimumDate={new Date(startDate)}
            onConfirm={(dateTime) => {
              console.log(`Confirmed Date and time: ${dateTime}`);
              setEndDate(moment(dateTime).toISOString());
              setOpenEndDate(false);
            }}
            onCancel={console.log("Cancelled")}
          />
        )}
        {/* <RNDateTimePicker value={startDate} />
        <RNDateTimePicker mode="time" value={startDate} /> */}
        {/* <Text>{endDate}</Text> */}
        {/* <RNDateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={() => console.log("On Change triggered")}
        /> */}
      </View>

      {/* Special Requests */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Notes and Special Requests"
        value={specialRequest}
        onChangeText={setSpecialRequest}
        multiline={true}
        numberOfLines={4}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
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
  restaurantName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009c5b",
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  restaurantDescription: {
    fontSize: 12,
    color: "#666",
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  guestControls: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
  },
  guestButton: {
    width: 30,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonText: {
    fontSize: 18,
  },
  guestNumber: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#009c5b",
    paddingVertical: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;
