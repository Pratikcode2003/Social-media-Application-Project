import { DELETE_POSTS_FAILURE } from "../Post/post.actionType";
import {
  GET_REELS_REQUEST,
  GET_REELS_SUCCESS,
  GET_REELS_FAILURE,
  CREATE_REEL_REQUEST,
  CREATE_REEL_SUCCESS,
  CREATE_REEL_FAILURE,
  LIKE_REEL_REQUEST,
  LIKE_REEL_SUCCESS,
  LIKE_REEL_FAILURE,
  DELETE_REEL_SUCCESS,
  DELETE_REEL_REQUEST,
  // CREATE_COMMENT_REEL_REQUEST,
  // CREATE_COMMENT_REEL_SUCCESS,
  // CREATE_COMMENT_REEL_FAILURE
} from "./reels.action";

const initialState = {
  reels: [],
  loading: false,
  error: null
};

export const reelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REELS_REQUEST:
    case CREATE_REEL_REQUEST:
      // case CREATE_COMMENT_REEL_REQUEST:
      return { ...state, loading: true };

    case GET_REELS_SUCCESS:
      return { ...state, loading: false, reels: action.payload };

    case CREATE_REEL_SUCCESS:
      return { ...state, loading: false, reels: [action.payload, ...state.reels] };

    case LIKE_REEL_REQUEST:
    case DELETE_REEL_REQUEST:
      return { ...state, actionLoading: true };


    case LIKE_REEL_SUCCESS:
      return {
        ...state,
        actionLoading: false,
        reels: state.reels.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };


    // case CREATE_COMMENT_REEL_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     reels: state.reels.map((r) =>
    //       r.id === action.payload.reelId
    //         ? { ...r, comments: [...(r.comments || []), action.payload] }
    //         : r
    //     )
    //   };
    case DELETE_REEL_SUCCESS:
      return {
        ...state,
        reels: state.reels.filter(
          (reel) => reel.id !== action.payload
        ),
      };


    case GET_REELS_FAILURE:
    case CREATE_REEL_FAILURE:
    case LIKE_REEL_FAILURE:
    case DELETE_POSTS_FAILURE:
      // case CREATE_COMMENT_REEL_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
