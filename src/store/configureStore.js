import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gameReducer from "../features/reducers/gameSlice";

const rootReducer = combineReducers({
  game: gameReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
