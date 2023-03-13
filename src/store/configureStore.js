import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { sampleReducer } from "../features/reducers/sample";

const rootReducer = combineReducers({
  sample: sampleReducer.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
