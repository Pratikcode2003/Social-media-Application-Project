import { api } from "../../config/api";
import {
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  GET_ALL_POST_REQUEST,
  GET_ALL_POST_SUCCESS,
  GET_ALL_POST_FAILURE,
  GET_USERS_POST_REQUEST,
  GET_USERS_POST_SUCCESS,
  GET_USERS_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  SAVE_POST_REQUEST,
  SAVE_POST_SUCCESS,
  SAVE_POST_FAILURE,
  GET_SAVED_POSTS_REQUEST,
  GET_SAVED_POSTS_SUCCESS,
  GET_SAVED_POSTS_FAILURE,
  DELETE_POSTS_REQUEST,
  DELETE_POSTS_SUCCESS,
  DELETE_POSTS_FAILURE
} from "./post.actionType";

// CREATE POST
export const createPostAction = (postData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });
  try {
    const { data } = await api.post("/api/posts", postData);
    dispatch({ type: CREATE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_POST_FAILURE, payload: error });
  }
};

// GET ALL POSTS
export const getAllPostAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_POST_REQUEST });
  try {
    const { data } = await api.get("/api/posts");
    dispatch({ type: GET_ALL_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_POST_FAILURE, payload: error });
  }
};

// GET USER'S POSTS
export const getUsersPostAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_USERS_POST_REQUEST });
  try {
    const { data } = await api.get(`/api/posts/user/${userId}`);
    dispatch({ type: GET_USERS_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USERS_POST_FAILURE, payload: error });
  }
};

// LIKE POST
export const likePostAction = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const { data } = await api.put(`/api/posts/like/${postId}`);
    dispatch({ type: LIKE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: LIKE_POST_FAILURE, payload: error });
  }
};

// CREATE COMMENT
export const createCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`/api/comments/post/${reqData.postId}`, reqData.data);
    dispatch({ type: CREATE_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_COMMENT_FAILURE, payload: error });
  }
};

// SAVE POST
// SAVE POST
export const savePostAction = (postId) => async (dispatch) => {
    dispatch({ type: SAVE_POST_REQUEST });

    try {
        const { data } = await api.put(`/api/posts/save/${postId}`);

        // Data now contains the UPDATED POST object
        dispatch({
            type: SAVE_POST_SUCCESS,
            payload: data  // This is the updated post
        });

        // Optional: Also update saved posts list
        dispatch(getSavedPostsAction());

    } catch (error) {
        dispatch({ type: SAVE_POST_FAILURE, payload: error });
    }
};


// GET SAVED POSTS
export const getSavedPostsAction = () => async (dispatch) => {
  dispatch({ type: GET_SAVED_POSTS_REQUEST });
  try {
    const { data } = await api.get("/api/users/saved");
    dispatch({ type: GET_SAVED_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_SAVED_POSTS_FAILURE, payload: error });
  }
};


export const deletePostAction = (postId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_POSTS_REQUEST });

    await api.delete(`/api/posts/${postId}`);

    dispatch({
      type: DELETE_POSTS_SUCCESS,
      payload: postId,
    });
  } catch (error) {
    dispatch({
      type: DELETE_POSTS_FAILURE,
      payload: error.message,
    });
  }
};
