import { api } from "../../config/api";

// Existing action types
export const GET_REELS_REQUEST = "GET_REELS_REQUEST";
export const GET_REELS_SUCCESS = "GET_REELS_SUCCESS";
export const GET_REELS_FAILURE = "GET_REELS_FAILURE";

export const CREATE_REEL_REQUEST = "CREATE_REEL_REQUEST";
export const CREATE_REEL_SUCCESS = "CREATE_REEL_SUCCESS";
export const CREATE_REEL_FAILURE = "CREATE_REEL_FAILURE";

// NEW: Like & Comment
export const LIKE_REEL_REQUEST = "LIKE_REEL_REQUEST";
export const LIKE_REEL_SUCCESS = "LIKE_REEL_SUCCESS";
export const LIKE_REEL_FAILURE = "LIKE_REEL_FAILURE";

export const DELETE_REEL_REQUEST = "DELETE_REEL_REQUEST";
export const DELETE_REEL_SUCCESS = "DELETE_REEL_SUCCESS";
export const DELETE_REEL_FAILURE = "DELETE_REEL_FAILURE";

// export const CREATE_COMMENT_REEL_REQUEST = "CREATE_COMMENT_REEL_REQUEST";
// export const CREATE_COMMENT_REEL_SUCCESS = "CREATE_COMMENT_REEL_SUCCESS";
// export const CREATE_COMMENT_REEL_FAILURE = "CREATE_COMMENT_REEL_FAILURE";

// Get all reels
export const getAllReelsAction = () => async (dispatch) => {
  dispatch({ type: GET_REELS_REQUEST });
  try {
    const { data } = await api.get("/api/reels");
    dispatch({ type: GET_REELS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_REELS_FAILURE, payload: error.message });
  }
};

// Create new reel
export const createReelAction = (reelData) => async (dispatch) => {
  dispatch({ type: CREATE_REEL_REQUEST });
  try {
    const { data } = await api.post("/api/reels", reelData);
    dispatch({ type: CREATE_REEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_REEL_FAILURE, payload: error.message });
  }
};

// NEW: Like a reel
export const likeReelAction = (reelId) => async (dispatch) => {
  dispatch({ type: LIKE_REEL_REQUEST });
  try {
    const { data } = await api.put(`/api/reels/${reelId}/like`);
    dispatch({ type: LIKE_REEL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LIKE_REEL_FAILURE,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const deleteReelAction = (reelId) => async (dispatch) => {
  dispatch({ type: DELETE_REEL_REQUEST });

  try {
    await api.delete(`/api/reels/${reelId}`);
    
    dispatch({
      type: DELETE_REEL_SUCCESS,
      payload: reelId, // send deleted reel id
    });
  } catch (error) {
    dispatch({
      type: DELETE_REEL_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// NEW: Add comment to reel
// export const createCommentReelAction = ({ reelId, content }) => async (dispatch) => {
//   dispatch({ type: CREATE_COMMENT_REEL_REQUEST });
//   try {
//     const { data } = await api.post(`/api/reels/comment/${reelId}`, { content });
//     dispatch({ type: CREATE_COMMENT_REEL_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({ type: CREATE_COMMENT_REEL_FAILURE, payload: error.message });
//   }
// };
