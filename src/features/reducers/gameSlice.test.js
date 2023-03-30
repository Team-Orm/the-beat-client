import gameReducer, {
  updateScore,
  updateCombo,
  endSong,
  updateWord,
} from "./gameSlice";

describe("gameSlice", () => {
  const initialState = {
    score: 0,
    totalScore: 0,
    comboResults: {
      excellent: 0,
      good: 0,
      miss: 0,
    },
    currentCombo: 0,
    end: false,
    word: "",
  };

  it("should handle initial state", () => {
    expect(gameReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should update score", () => {
    const score = 100;
    const expectedState = { ...initialState, score };

    expect(gameReducer(initialState, updateScore(score))).toEqual(
      expectedState,
    );
  });

  it("should update combo", () => {
    const currentCombo = 2;
    const expectedState = { ...initialState, currentCombo };

    expect(gameReducer(initialState, updateCombo(currentCombo))).toEqual(
      expectedState,
    );
  });

  it("should set song end state", () => {
    const payload = {
      comboResults: { excellent: 3, good: 2 },
      currentScore: 120,
      maxNotesNumber: 10,
    };
    const expectedState = {
      ...initialState,
      totalScore: payload.currentScore,
      comboResults: { excellent: 3, good: 2, miss: 5 },
      end: true,
    };

    expect(gameReducer(initialState, endSong(payload))).toEqual(expectedState);
  });

  it("should update word", () => {
    const word = "Example";
    const expectedState = { ...initialState, word };

    expect(gameReducer(initialState, updateWord(word))).toEqual(expectedState);
  });
});
