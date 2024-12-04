// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import Geolocation from '@react-native-community/geolocation';
// import { useDispatch } from 'react-redux';
// import { setUserData } from '../actions'; // your action to set user data
// import { useNavigation } from '@react-navigation/native';
// import { API_URL } from '../configs/Constants';
// import { useDispatch } from 'react-redux';

// const SplashScreen = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch current location
//     Geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
        
//         // Save the location to Redux after fetching
//         dispatch(setUserData({
//           location: { lat: latitude, long: longitude },
//         }));
        
//         // Navigate to the home screen
//         setLoading(false);
//         navigation.replace('Home');
//       },
//       (error) => {
//         console.error('Error getting location:', error);
//         setLoading(false);
//         navigation.replace('Home');
//       },
//       { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//     );
//   }, [dispatch, navigation]);

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#14AE5C" />
//       ) : (
//         <Text style={styles.text}>Loading your location...</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#E5FAF1',
//   },
//   text: {
//     fontSize: 24,
//     color: '#14AE5C',
//   },
// });

// export default SplashScreen;


import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Book My Seat!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SplashScreen;
