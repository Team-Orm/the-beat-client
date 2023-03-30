import { createSlice } from "@reduxjs/toolkit";

const comboResults = {
  excellent: 0,
  good: 0,
  miss: 0,
};

const user = {
  displayName: "",
  photoURL: "",
};

const battleUserResults = {
  comboResults,
  score: 0,
  user,
};

const initialState = {
  score: 0,
  totalScore: 0,
  currentCombo: 0,
  end: false,
  word: "",
  comboResults,
  battleUserResults,
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
    endSong: (state, action) => {
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
    resetRecords: (state) => {
      const initialResults = {
        excellent: 0,
        good: 0,
        miss: 0,
      };

      state.comboResults = initialResults;
      state.currentCombo = 0;
      state.totalScore = 0;
      state.end = false;
      state.word = "";
    },
    getBattleUserResults: (state, action) => {
      const { score, comboResults, user } = action.payload;

      state.battleUserResults.comboResults = comboResults;
      state.battleUserResults.user = user;
      state.battleUserResults.score = score;
    },
  },
});

export const {
  updateScore,
  updateCombo,
  endSong,
  updateWord,
  resetRecords,
  getBattleUserResults,
} = gameSlice.actions;
export default gameSlice.reducer;
