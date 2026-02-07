import axios from "axios";
import { API_BASE_URL, api } from "../../config/api";
import {
  CREATE_STORY_FAILURE,
  CREATE_STORY_REQUEST,
  CREATE_STORY_SUCCESS,
  DELETE_STORY_FAILURE,
  DELETE_STORY_REQUEST,
  DELETE_STORY_SUCCESS,
  GET_STORY_FAILURE,
  GET_STORY_REQUEST,
  GET_STORY_SUCCESS,
  GET_FOLLOWING_STORIES_REQUEST,
  GET_FOLLOWING_STORIES_SUCCESS,
  GET_FOLLOWING_STORIES_FAILURE
} from "./story.actionType";

// Create new story
export const createStoryAction = (storyData) => async (dispatch) => {
  dispatch({ type: CREATE_STORY_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.post(`${API_BASE_URL}/api/story`, storyData, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    dispatch({ type: CREATE_STORY_SUCCESS, payload: data });
  } catch (error) {
    console.error("Create story error", error);
    dispatch({ type: CREATE_STORY_FAILURE, payload: error });
  }
};

// Get stories by userId
export const getStoryByUserAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_STORY_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}/api/story/user/${userId}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    dispatch({ type: GET_STORY_SUCCESS, payload: data });
  } catch (error) {
    console.error("Get story error", error);
    dispatch({ type: GET_STORY_FAILURE, payload: error });
  }
};

// NEW: Get stories from following users
export const getFollowingStoriesAction = () => async (dispatch) => {
  dispatch({ type: GET_FOLLOWING_STORIES_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    const { data } = await axios.get(`${API_BASE_URL}/api/story/following`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    dispatch({ type: GET_FOLLOWING_STORIES_SUCCESS, payload: data });
  } catch (error) {
    console.error("Get following stories error", error);
    dispatch({ type: GET_FOLLOWING_STORIES_FAILURE, payload: error });
  }
};

export const deleteStoryAction = (storyId) => async (dispatch) => {
  dispatch({ type: DELETE_STORY_REQUEST });
  try {
    const jwt = localStorage.getItem("jwt");
    await axios.delete(`${API_BASE_URL}/api/story/${storyId}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    dispatch({ type: DELETE_STORY_SUCCESS, payload: storyId });
  } catch (error) {
    console.error("Delete story error", error);
    dispatch({ type: DELETE_STORY_FAILURE, payload: error });
  }
};