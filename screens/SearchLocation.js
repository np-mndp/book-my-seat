import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import { setUserData } from '../actions'; // Your action to set user data

const SearchLocation = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dispatch = useDispatch();

  const handleLocationSelect = (data, details) => {
    const location = {
      lat: details.geometry.location.lat,
      long: details.geometry.location.lng,
    };

    setSelectedLocation(location);
    dispatch(setUserData({ location }));
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a location"
        onPress={handleLocationSelect}
        query={{
          key: 'YOUR_GOOGLE_PLACES_API_KEY',
          language: 'en',
        }}
        styles={{
          container: { flex: 1, marginTop: 20 },
          textInput: {
            borderColor: '#14AE5C',
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          },
        }}
      />
      {selectedLocation && (
        <Text style={styles.locationText}>
          Selected Location: {selectedLocation.lat}, {selectedLocation.long}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  locationText: {
    marginTop: 20,
    fontSize: 18,
    color: '#14AE5C',
  },
});

export default SearchLocation;
