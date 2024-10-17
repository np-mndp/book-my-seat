import { API_URL } from "../configs/Constants";
import { setUserData } from "../reducers/authReducer";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    console.log(`Good until here/............`, {
      email,
      password,
      API_URL: "Constants.extras.API_URL",
    });

    const response = await fetch(`${API_URL}/api/user/login`, {
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
