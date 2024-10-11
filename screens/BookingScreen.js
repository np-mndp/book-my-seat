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

const BookingScreen = ({ navigation, route }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [guests, setGuests] = useState(1);
  const [occasion, setOccasion] = useState("");
  const [specialAccommodation, setSpecialAccommodation] = useState(false);
  const [specialRequest, setSpecialRequest] = useState("");
  const [isSpecialOccasion, setIsSpecialOccasion] = useState(false);

  const restaurant = route.params?.restaurant ?? {
    title: "THE GOOD SON'S CAFE AND BAR",
    location: { address: "124 St. Clair Ave" },
    description:
      "Aliquam id eros ipsum. Nulla vitae varius urna. Sed vulputate ligula id tellus tincidunt sodales. Phasellus et lacinia purus.",
    images: ["https://via.placeholder.com/150"],
  };

  const incrementGuests = () => {
    setGuests(guests + 1);
  };

  const decrementGuests = () => {
    if (guests > 1) {
      setGuests(guests - 1);
    }
  };

  const handleSubmit = () => {
    console.log({
      name,
      phone,
      email,
      guests,
      isSpecialOccasion,
      occasion,
      specialAccommodation,
      specialRequest,
    });

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
        value={name}
        onChangeText={setName}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
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
          <Text style={styles.guestNumber}>{guests}</Text>
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
          value={occasion}
          onChangeText={setOccasion}
        />
      )}

      {/* Special Accommodation Toggle */}
      <View style={styles.row}>
        <Switch
          value={specialAccommodation}
          onValueChange={setSpecialAccommodation}
        />
        <Text style={styles.label}>Special Accommodation required?</Text>
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

const styles = StyleSheet.create({
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
