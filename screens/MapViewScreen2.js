import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PLACES_API_KEY } from '@env';

const MapScreenView2 = () => {
  const [search, setSearch] = useState('');
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);

  const handleSearch = async () => {
    if (!search) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${PLACES_API_KEY}`
      );
      const data = await response.json();

      if (data.results) {
        setPlaces(data.results);
        setMarkers(data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          location: {
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          },
        })));
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ padding: 10, backgroundColor: 'white' }}
        placeholder="Search for places..."
        value={search}
        onChangeText={setSearch}
      />
      <Button title="Search" onPress={handleSearch} />

      <MapView style={{ flex: 1 }}>
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.location}
            title={marker.name}
          />
        ))}
      </MapView>

      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </View>
  );
};

export default MapScreenView2;
