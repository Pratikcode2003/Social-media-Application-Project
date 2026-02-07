import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { authReducer } from "./Auth/auth.reducer";
import { postReducer } from "./Post/post.reducer";
import { messageReducer } from "./Message/Message.reducer";
import { reelsReducer } from "./Reels/reels.Reducer";
import { storyReducer } from "./Story/story.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  message:messageReducer,
  reels: reelsReducer,
  story:storyReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
