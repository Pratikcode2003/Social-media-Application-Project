import axios from "axios"
import { api, API_BASE_URL } from "../../config/api"
import { FOLLOW_USER_SUCCESS, GET_ALL_USERS_FAILURE, GET_ALL_USERS_REQUEST, GET_ALL_USERS_SUCCESS, GET_PROFILE_FAILURE, GET_PROFILE_REQUEST, GET_PROFILE_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, SEARCH_USER_FAILURE, SEARCH_USER_REQUEST, SEARCH_USER_SUCCESS, UNFOLLOW_USER_SUCCESS, UPDATE_PROFILE_FAILURE, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS } from "./auth.actionType"
import { LOGOUT } from "./auth.actionType";
export const loginUserAction = (loginData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, loginData.data);

        console.log("login success", data);

        if (data.token) {
            localStorage.setItem("jwt", data.token);
            
            // Immediately get user profile after login
            const profileResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            });
            
            // Dispatch both token and user data
            dispatch({ 
                type: LOGIN_SUCCESS, 
                payload: {
                    token: data.token,
                    user: profileResponse.data
                }
            });

        }

    } catch (error) {
        console.log("----------", error);
        dispatch({ type: LOGIN_FAILURE, payload: error });
    }
};


// localStorage.setItem("jwt", data.token)
            
            // // Get user profile after registration
            // const profileResponse = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            //     headers: {
            //         Authorization: `Bearer ${data.token}`
            //     }
            // });
            
export const registerUserAction = (loginData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST })
    try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, loginData.data)
        
        console.log("register success", data);

        // Don't store JWT in localStorage
        // Don't automatically get profile
        // Just return success message
        
        dispatch({ 
            type: REGISTER_SUCCESS, 
            payload: {
                message: "Registration successful",
                success: true
            }
        })
        
    } catch (error) {
        console.log(error);
        dispatch({ 
            type: REGISTER_FAILURE, 
            payload: error.response?.data?.message || "Registration failed" 
        })
    }
}

export const getProfileAction = (jwt) => async (dispatch) => {
    dispatch({ type: GET_PROFILE_REQUEST })
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });

        console.log("profile---", data);

        dispatch({ type: GET_PROFILE_SUCCESS, payload: data })
    } catch (error) {
        console.log("------", error);
        dispatch({ type: GET_PROFILE_FAILURE, payload: error })
    }
}

export const UpdateProfileAction = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST })
    try {
        const { data } = await api.put(`${API_BASE_URL}/api/users`, reqData)

        console.log("update profile---", data);

        dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data })
    } catch (error) {
        console.log("----", error);
        dispatch({ type: UPDATE_PROFILE_FAILURE, payload: error })
    }
}

export const searchUser = (query) => async (dispatch) => {
    dispatch({ type: SEARCH_USER_REQUEST })
    try {
        const { data } = await api.get(`/api/users/search?query=${query}`, {
        });

        console.log("search user---", data);

        dispatch({ type: SEARCH_USER_SUCCESS, payload: data })
    } catch (error) {
        console.log("------", error);
        dispatch({ type: SEARCH_USER_FAILURE, payload: error })
    }
}



export const logoutAction = () => (dispatch) => {
  // clear stored auth data
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");

  dispatch({ type: LOGOUT });
};


export const followUserAction = (userId) => async (dispatch) => {
  try {
    const { data } = await api.put(`/api/users/follow/${userId}`);
    console.log("follow user---", data);

    dispatch({
      type: FOLLOW_USER_SUCCESS,
      payload: data, // backend should return updated logged-in user
    });
  } catch (error) {
    console.log("follow error---", error);
  }
};

export const unfollowUserAction = (userId) => async (dispatch) => {
  try {
    const { data } = await api.put(`/api/users/unfollow/${userId}`);
    console.log("unfollow user---", data);

    dispatch({
      type: UNFOLLOW_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("unfollow error---", error);
  }
};

export const getAllUsersAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_USERS_REQUEST });

  try {
    const { data } = await api.get("/api/users");
    console.log("all users ---", data);

    dispatch({
      type: GET_ALL_USERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("get all users error ---", error);

    dispatch({
      type: GET_ALL_USERS_FAILURE,
      payload: error,
    });
  }
};
