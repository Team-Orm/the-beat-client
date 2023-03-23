import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  score: 0,
  totalScore: 0,
  combo: {
    excellent: 0,
    good: 0,
    miss: 0,
  },
  currentCombo: 0,
  end: false,
  word: "",
  roomId: "",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    updateScore: (state, action) => {
      state.score = action.payload;
    },
    updateCombo: (state, action) => {
      state.currentCombo = action.payload;
    },
    updateWord: (state, action) => {
      state.word = action.payload;
    },
    isSongEnd: (state, action) => {
      state.roomId = action.payload.roomId;
      state.totalScore = action.payload.currentScore;
      state.combo = action.payload.comboResults;
      state.end = true;
    },
  },
});

export const { updateScore, updateCombo, isSongEnd, updateWord } =
  gameSlice.actions;
export default gameSlice.reducer;
