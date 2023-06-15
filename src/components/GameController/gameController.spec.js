import React from "react";
import { Provider } from "react-redux";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import store from "../../store/configureStore";
import GameController, { Column, Key } from "./index";
import "jest-styled-components";
import userEvent from "@testing-library/user-event";
import { COLUMN_RGB_COLORS } from "../../store/constants";
import { calculateScore, getColor } from "../../features/utils";

describe("GameController Component", () => {
  const dummyNote = [{ key: "s", time: 0 }];

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => cb());
  });

  afterEach(() => {
    window.requestAnimationFrame.mockRestore();
  });

  it("renders all required child components", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GameController
            isCurrentUser={true}
            sendKeyPressToOpponents={jest.fn()}
            sendKeyReleaseToOpponents={jest.fn()}
            initialNotes={[...dummyNote]}
          />
        </BrowserRouter>
      </Provider>,
    );

    const canvas = screen.getByTestId("canvas-container");
    const textContainer = screen.getByTestId("text-container");
    const columnsContainer = screen.getByTestId("columns-container");
    const hitBox = screen.getByTestId("hit-box");

    let keyBoxes = [];
    for (let i = 0; i < 6; i++) {
      const keyBox = screen.getByTestId(`key-container-${i}`);

      keyBoxes.push(keyBox);
    }

    keyBoxes.map((keyBox) => {
      expect(keyBox).toBeInTheDocument();
    });

    expect(canvas).toBeInTheDocument();
    expect(textContainer).toBeInTheDocument();
    expect(columnsContainer).toBeInTheDocument();
    expect(hitBox).toBeInTheDocument();
  });

  it("key events when key pressed", async () => {
    const sendKeyPressToOpponentsMock = jest.fn();
    const sendKeyReleaseToOpponentsMock = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GameController
            isCurrentUser={true}
            sendKeyPressToOpponents={sendKeyPressToOpponentsMock}
            sendKeyReleaseToOpponents={sendKeyReleaseToOpponentsMock}
            initialNotes={[...dummyNote]}
          />
        </BrowserRouter>
      </Provider>,
    );

    await act(async () => {
      userEvent.keyboard("s");
    });

    await waitFor(() => {
      expect(sendKeyPressToOpponentsMock).toHaveBeenCalledTimes(1);
      expect(sendKeyPressToOpponentsMock).toHaveBeenCalledWith("s");
      expect(sendKeyReleaseToOpponentsMock).toHaveBeenCalledTimes(1);
      expect(sendKeyReleaseToOpponentsMock).toHaveBeenCalledWith("s");
    });

    await act(async () => {
      userEvent.keyboard("d");
    });

    await waitFor(() => {
      expect(sendKeyPressToOpponentsMock).toHaveBeenCalledTimes(2);
      expect(sendKeyPressToOpponentsMock).toHaveBeenCalledWith("d");
      expect(sendKeyReleaseToOpponentsMock).toHaveBeenCalledTimes(2);
      expect(sendKeyReleaseToOpponentsMock).toHaveBeenCalledWith("d");
    });
  });

  it("does not call sendKeyPressToOpponents and sendKeyReleaseToOpponents when isCurrentUser is false", async () => {
    const sendKeyPressToOpponentsMock = jest.fn();
    const sendKeyReleaseToOpponentsMock = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GameController
            isCurrentUser={false}
            sendKeyPressToOpponents={sendKeyPressToOpponentsMock}
            sendKeyReleaseToOpponents={sendKeyReleaseToOpponentsMock}
            initialNotes={[...dummyNote]}
          />
        </BrowserRouter>
      </Provider>,
    );

    await act(async () => {
      userEvent.keyboard("s");
    });

    await waitFor(() => {
      expect(sendKeyPressToOpponentsMock).toHaveBeenCalledTimes(0);
      expect(sendKeyReleaseToOpponentsMock).toHaveBeenCalledTimes(0);
    });
  });

  it("key applies the correct background color when active", () => {
    render(
      <Key active index={0}>
        S
      </Key>,
    );
    const keyElement = screen.getByText("S");

    const keyColor = getColor(0);
    const removeSpaceColor = keyColor.replaceAll(" ", "");

    expect(keyElement).toHaveStyleRule(
      "background",
      `rgba(${removeSpaceColor},1)`,
    );
  });

  it("column applies the correct background color when active", () => {
    render(<Column active index={0} />);
    const columnElement = screen.getByTestId("column-container-0");

    const keyColor = getColor(0);
    const removeSpaceColor = keyColor.replaceAll(" ", "");

    expect(columnElement).toHaveStyleRule(
      "background",
      `linear-gradient(to top,rgba(${removeSpaceColor},0.8),rgba(${removeSpaceColor},0))`,
    );
  });

  it("returns the expected score for different input values", () => {
    const input1 = "excellent";
    const expectedOutput1 = 100;

    const input2 = "good";
    const expectedOutput2 = 70;

    expect(calculateScore(input1)).toBe(expectedOutput1);
    expect(calculateScore(input2)).toBe(expectedOutput2);
  });

  it("returns 0 for invalid inputs", () => {
    const input1 = "invalid";
    const expectedOutput1 = 0;

    const input2 = null;
    const expectedOutput2 = 0;

    const input3 = undefined;
    const expectedOutput3 = 0;

    expect(calculateScore(input1)).toBe(expectedOutput1);
    expect(calculateScore(input2)).toBe(expectedOutput2);
    expect(calculateScore(input3)).toBe(expectedOutput3);
  });

  it("returns the correct color for different indices", () => {
    const index1 = 0;
    const expectedColor1 = COLUMN_RGB_COLORS[0];

    const index2 = 5;
    const expectedColor2 = COLUMN_RGB_COLORS[0];

    const index3 = 1;
    const expectedColor3 = COLUMN_RGB_COLORS[1];

    const index4 = 4;
    const expectedColor4 = COLUMN_RGB_COLORS[1];

    const index5 = 2;
    const expectedColor5 = COLUMN_RGB_COLORS[2];

    const index6 = 3;
    const expectedColor6 = COLUMN_RGB_COLORS[2];

    expect(getColor(index1)).toBe(expectedColor1);
    expect(getColor(index2)).toBe(expectedColor2);
    expect(getColor(index3)).toBe(expectedColor3);
    expect(getColor(index4)).toBe(expectedColor4);
    expect(getColor(index5)).toBe(expectedColor5);
    expect(getColor(index6)).toBe(expectedColor6);
  });
});
