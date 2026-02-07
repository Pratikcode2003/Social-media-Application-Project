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

const initialState = {
  stories: [],
  loading: false,
  error: null
};

export const storyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_STORY_REQUEST:
    case GET_STORY_REQUEST:
    case GET_FOLLOWING_STORIES_REQUEST:
      return { ...state, loading: true, error: null };
    
    case CREATE_STORY_SUCCESS:
      return { ...state, stories: [action.payload, ...state.stories], loading: false };
    
    case GET_STORY_SUCCESS:
    case GET_FOLLOWING_STORIES_SUCCESS:
      return { ...state, stories: action.payload, loading: false };
    
    case CREATE_STORY_FAILURE:
    case GET_STORY_FAILURE:
    case GET_FOLLOWING_STORIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_STORY_REQUEST:
      return { ...state, loading: true };

    case DELETE_STORY_SUCCESS:
      return {
        ...state,
        loading: false,
        stories: state.stories.filter(
          (story) => story.id !== action.payload
        ),
      };

    case DELETE_STORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};