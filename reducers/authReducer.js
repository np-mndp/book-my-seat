import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    location: { lat: null, long: null, name: null }, // Initialize location as null
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.location = action.payload.location || { lat: null, long: null,name: null }; // Save location, or set to null if not provided
    },
    setUserLocation: (state, action) => {
      state.location = action.payload; // Update only the location
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.location = { lat: null, long: null, name: null }; // Reset location on logout
    },
  },
});

export const { setUserData, setUserLocation, logout } = authSlice.actions;
export default authSlice.reducer;
