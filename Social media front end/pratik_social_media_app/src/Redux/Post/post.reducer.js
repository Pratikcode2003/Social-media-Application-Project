import {
    CREATE_COMMENT_SUCCESS,
    CREATE_POST_FAILURE,
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    GET_ALL_POST_FAILURE,
    GET_ALL_POST_REQUEST,
    GET_ALL_POST_SUCCESS,
    LIKE_POST_FAILURE,
    LIKE_POST_REQUEST,
    LIKE_POST_SUCCESS,
    GET_USERS_POST_REQUEST,
    GET_USERS_POST_SUCCESS,
    GET_USERS_POST_FAILURE,
    SAVE_POST_SUCCESS,
    SAVE_POST_FAILURE,
    SAVE_POST_REQUEST,
    GET_SAVED_POSTS_REQUEST,
    GET_SAVED_POSTS_SUCCESS,
    GET_SAVED_POSTS_FAILURE,
    DELETE_POSTS_SUCCESS,
    DELETE_POSTS_REQUEST,
    DELETE_POSTS_FAILURE
} from "./post.actionType";

const initialState = {
    post: null,
    loading: false,
    error: null,
    posts: [],
    savedPosts: [], // ✅ saved posts
    newComment: null
};

export const postReducer = (state = initialState, action) => {
    switch (action.type) {

        // REQUESTS
        case CREATE_POST_REQUEST:
        case GET_ALL_POST_REQUEST:
        case LIKE_POST_REQUEST:
        case GET_USERS_POST_REQUEST:
        case SAVE_POST_REQUEST:
        case GET_SAVED_POSTS_REQUEST:
        case DELETE_POSTS_REQUEST:
            return { ...state, loading: true, error: null };

        // SUCCESS
        case CREATE_POST_SUCCESS:
            return {
                ...state,
                post: action.payload,
                posts: [action.payload, ...state.posts],
                loading: false,
                error: null
            };

        case GET_ALL_POST_SUCCESS:
        case GET_USERS_POST_SUCCESS:
            return { ...state, posts: action.payload, loading: false, error: null };

        case LIKE_POST_SUCCESS:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post.id === action.payload.id ? action.payload : post
                ),
                loading: false,
                error: null
            };

        case SAVE_POST_SUCCESS:
            return {
                ...state,
                // Update the specific post in posts array
                posts: state.posts.map(post =>
                    post.id === action.payload.id ? action.payload : post
                ),
                loading: false,
                error: null
            };

        case GET_SAVED_POSTS_SUCCESS:
            return {
                ...state,
                savedPosts: action.payload,
                loading: false,
                error: null
            };

        case CREATE_COMMENT_SUCCESS:
            return { ...state, newComment: action.payload, loading: false, error: null };

        case DELETE_POSTS_SUCCESS:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.payload),
                savedPosts: state.savedPosts?.filter(post => post.id !== action.payload),
            };

        // FAILURES
        case CREATE_POST_FAILURE:
        case GET_ALL_POST_FAILURE:
        case LIKE_POST_FAILURE:
        case GET_USERS_POST_FAILURE:
        case SAVE_POST_FAILURE:
        case GET_SAVED_POSTS_FAILURE:
        case DELETE_POSTS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
