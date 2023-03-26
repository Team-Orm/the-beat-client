import React, { useState } from "react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render, screen, act } from "@testing-library/react";
import store from "../../store/configureStore";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import BattleRoom from "./index";

jest.mock("axios");

describe("BattleRoom component", () => {
  test("renders BattleRoom component", () => {
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

    test("renders OutButton component", () => {
      expect(screen.getByTestId("out-button")).toBeInTheDocument();
    });

    test("renders StartButton component", () => {
      expect(screen.getByTestId("start-button")).toBeInTheDocument();
    });

    test("renders ScoreContainer components", () => {
      const scoreContainers = screen.getAllByTestId("score-container");
      expect(scoreContainers.length).toBe(2);
    });
  });

  test("OutButton click event works", async () => {
    axios.delete.mockResolvedValue({ status: 204 });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <BattleRoom />
        </BrowserRouter>
      </Provider>,
    );

    await act(async () => {
      userEvent.click(screen.getByTestId("out-button"));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(axios.delete).toHaveBeenCalled();
  });

  test("Countdown starts when the start button click event occurs", async () => {
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

  test("Countdown is hidden after it reaches zero", async () => {
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

    test("Error fetching song redirects to /error route", () => {
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
