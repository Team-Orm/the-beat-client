import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  score: 0,
  totalScore: 0,
  combo: {
    excellent: 0,
    good: 0,
    miss: 0,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateScore: (state, action) => {
      state.score = action.payload;
    },
    updateTotalScore: (state, action) => {
      state.totalScore = action.payload;
    },
    updateCombo: (state, action) => {
      state.combo = action.payload;
    },
  },
});

export const { updateScore, updateTotalScore, updateCombo } = gameSlice.actions;
export default gameSlice.reducer;
