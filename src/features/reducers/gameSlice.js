import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  score: 0,
  totalScore: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateScore: (state, action) => {
      state.score = action.payload;
    },
    totalScore: (state, action) => {
      state.totalScore = action.payload;
    },
  },
});

export const { updateScore, totalScore } = gameSlice.actions;
export default gameSlice.reducer;
