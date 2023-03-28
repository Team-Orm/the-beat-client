import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import { BrowserRouter } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import BattleRoom from "./index";

jest.mock("axios");

describe("BattleRoom component", () => {
  beforeEach(() => {
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders BattleRoom component", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleRoom />
        </BrowserRouter>
      </Provider>,
    );

    const battleRoomContainer = screen.getAllByTestId("battleRoom-Container");
    expect(battleRoomContainer.length).toBe(2);
  });

  describe("renders UI elements correctly", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <BattleRoom initialReady={true} />
          </BrowserRouter>
        </Provider>,
      );
    });

    it("renders OutButton component", () => {
      expect(screen.getByTestId("out-button")).toBeInTheDocument();
    });

    it("renders StartButton component", () => {
      expect(screen.getByTestId("start-button")).toBeInTheDocument();
    });

    it("renders ScoreContainer components", () => {
      const scoreContainers = screen.getAllByTestId("score-container");
      expect(scoreContainers.length).toBe(2);
    });
  });

  it("OutButton click event works", async () => {
    axios.delete.mockResolvedValue({ status: 204 });

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <BattleRoom />
          </BrowserRouter>
        </Provider>,
      );
    });

    await act(async () => {
      userEvent.click(screen.getByTestId("out-button"));
    });

    expect(axios.delete).toHaveBeenCalled();
  });

  it("Countdown starts when the start button click event occurs", async () => {
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleRoom initialReady={true} initialCountingDown={false} />
        </BrowserRouter>
      </Provider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId("start-button"));
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("countdown")).toHaveTextContent("2");

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId("countdown")).toHaveTextContent("1");

    act(() => {
      jest.advanceTimersByTime(1000);
    });
  });

  it("Countdown is hidden after it reaches zero", async () => {
    jest.useFakeTimers();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleRoom initialReady={true} initialCountingDown={false} />
        </BrowserRouter>
      </Provider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId("start-button"));
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByTestId("countdown")).not.toBeInTheDocument();
  });

  describe("checking error", () => {
    beforeEach(() => {
      axios.get.mockResolvedValue({
        response: {
          status: 500,
          statusText: "Internal Server Error",
          data: { message: "500 Internal Server Error" },
        },
      });
    });

    it("Error fetching song redirects to /error route", () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <BattleRoom />
          </BrowserRouter>
        </Provider>,
      );

      expect(
        window.location.pathname === "/error" ||
          window.location.pathname === "/battles/results/undefined",
      ).toBeTruthy();
    });
  });
});
