import { 
    FOLLOW_USER_SUCCESS, 
    GET_ALL_USERS_FAILURE, 
    GET_ALL_USERS_REQUEST, 
    GET_ALL_USERS_SUCCESS, 
    GET_PROFILE_REQUEST, 
    GET_PROFILE_SUCCESS, 
    GET_PROFILE_FAILURE,
    LOGIN_FAILURE, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGOUT, 
    REGISTER_FAILURE, 
    REGISTER_REQUEST, 
    REGISTER_SUCCESS, 
    SEARCH_USER_SUCCESS,
    UNFOLLOW_USER_SUCCESS, 
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    SEARCH_USER_REQUEST,
    SEARCH_USER_FAILURE
} from "./auth.actionType";

const initialState = {
    jwt: null,
    error: null,
    loading: false,
    user: null,
    searchUser: [],
    allUsers: [],
    registerSuccess: false, // Add this for registration success state
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case GET_PROFILE_REQUEST:
            return { ...state, loading: true, error: null }

        case REGISTER_REQUEST:
            return { ...state, loading: true, error: null, registerSuccess: false }

        case GET_PROFILE_SUCCESS:
        case UPDATE_PROFILE_SUCCESS:
            return { ...state, user: action.payload, error: null, loading: false }

        case LOGIN_SUCCESS:
            return { 
                ...state, 
                jwt: action.payload.token, 
                user: action.payload.user,
                loading: false, 
                error: null,
                registerSuccess: false // Reset registration success
            }

        case REGISTER_SUCCESS:
            // Handle registration success differently - don't store JWT or user
            return { 
                ...state, 
                loading: false, 
                error: null,
                registerSuccess: true, // Set flag for successful registration
                jwt: null, // Don't store JWT
                user: null // Don't store user
            }

        case SEARCH_USER_REQUEST:
            return { ...state, loading: true, error: null }

        case SEARCH_USER_SUCCESS:
            return { ...state, searchUser: action.payload, loading: false, error: null }
        
        case SEARCH_USER_FAILURE:
        case GET_PROFILE_FAILURE:
        case UPDATE_PROFILE_FAILURE:
            return { ...state, loading: false, error: action.payload }

        case LOGIN_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload,
                jwt: null,
                user: null 
            }

        case REGISTER_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload,
                registerSuccess: false
            }

        case FOLLOW_USER_SUCCESS:
        case UNFOLLOW_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };

        case GET_ALL_USERS_REQUEST:
            return { ...state, loading: true };

        case GET_ALL_USERS_SUCCESS:
            return {
                ...state,
                allUsers: action.payload,
                loading: false,
                error: null
            };

        case GET_ALL_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case LOGOUT:
            return {
                jwt: null,
                user: null,
                error: null,
                loading: false,
                searchUser: [],
                allUsers: [],
                registerSuccess: false
            };

        default:
            return state
    }
}