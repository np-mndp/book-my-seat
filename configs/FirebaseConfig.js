// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import necessary firebase services
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCW81694XG-teyK3q4wQNDMur7f3qkR9gY",
    authDomain: "wip-book-your-seat.firebaseapp.com",
    projectId: "wip-book-your-seat",
    storageBucket: "wip-book-your-seat.appspot.com",
    messagingSenderId: "887743250657",
    appId: "1:887743250657:web:3eb5fa16cdb532c05737a0",
    measurementId: "G-TK753Y4SMZ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//instantiate auth object
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

//instantiate firestore object
const db = getFirestore(app);

//export the auth object to use in other files
export { auth };

//export the database object to use in other files
export { db };

// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
