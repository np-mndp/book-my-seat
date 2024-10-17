import { setUserData } from "../reducers/authReducer";
import Constants from "expo-constants";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    console.log(`Good until here/............`, {
      email,
      password,
      API_URL: "Constants.extras.API_URL",
    });

    const response = await fetch(`http://192.168.2.1:3000/api/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    console.log(response);

    const data = await response.json();
    console.log(JSON.stringify({ data }));

    if (response.ok) {
      dispatch(setUserData({ user: data.user, token: data.token }));
      return true;
    } else {
      console.log(JSON.stringify(response));
    }
  } catch (error) {
    console.log(JSON.stringify(error));
  }
};
