export default {
  expo: {
    name: "Book My Seat",
    slug: "book-my-seat",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    extra: {
      eas: {
        projectId: "570449e0-c62d-4572-acee-273283fb0862",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
      ],
      package: "com.birajgtm.bookmyseat",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_PLACES_API_KEY ,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow Book My Seat to use your location.",
        },
      ],
      "expo-font",
    ],
  },
};