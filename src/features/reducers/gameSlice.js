import { createSlice } from "@reduxjs/toolkit";

const comboResults = {
  excellent: 0,
  good: 0,
  miss: 0,
};

const initialState = {
  score: 0,
  totalScore: 0,
  currentCombo: 0,
  end: false,
  word: "",
  comboResults,
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
      const { comboResults, currentScore, maxNotesNumber } = action.payload;

      const missNumber =
        maxNotesNumber - (comboResults.excellent + comboResults.good);

      const results = {
        excellent: comboResults.excellent,
        good: comboResults.good,
        miss: missNumber,
      };

      state.totalScore = currentScore;
      state.comboResults = results;
      state.end = true;
    },
  },
});

export const { updateScore, updateCombo, isSongEnd, updateWord } =
  gameSlice.actions;
export default gameSlice.reducer;
