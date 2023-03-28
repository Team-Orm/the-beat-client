import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import BattleResults from "./index";

describe("BattleResults", () => {
  it("renders without error", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleResults />
        </BrowserRouter>
      </Provider>,
    );
  });

  it("renders without error", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleResults />
        </BrowserRouter>
      </Provider>,
    );

    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("renders a winner message when the total score is greater than the opponent's score", () => {
    const mockState = {
      game: {
        score: 100,
        totalScore: 200,
        comboResults: {
          excellent: 30,
          good: 20,
          miss: 10,
        },
        currentCombo: 7,
        end: false,
        word: "",
      },
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleResults />
        </BrowserRouter>
      </Provider>,
      { initialState: mockState },
    );
    const winnerMessage = screen.getByText("Winner");
    expect(winnerMessage).toBeInTheDocument();
  });

  it("renders a loser message when the total score is less than the opponent's score", () => {
    const mockState = {
      game: {
        score: 100,
        totalScore: 50,
        comboResults: {
          excellent: 30,
          good: 20,
          miss: 10,
        },
        currentCombo: 7,
        end: false,
        word: "",
      },
    };
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleResults />
        </BrowserRouter>
      </Provider>,
      { initialState: mockState },
    );
    const loserMessage = screen.getByText("Loser");
    expect(loserMessage).toBeInTheDocument();
  });
});
