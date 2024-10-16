import React from 'react';
import {MapView, Marker} from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';

export default function MapViewScreen() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} />

      <Marker >
 <View style={{backgroundColor: "red", padding: 10}}>
   <Text>SF</Text>
 </View>
</Marker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
