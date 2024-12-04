import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    location: { lat: null, long: null },
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.location = action.payload.location; // Save location
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.location = { lat: null, long: null }; // Reset location on logout
    },
  },
});

export const { setUserData, logout } = authSlice.actions;
export default authSlice.reducer;