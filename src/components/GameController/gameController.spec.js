import React from "react";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import { render, screen, waitFor } from "@testing-library/react";
import GameController from "./index";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";

describe.skip("GameController Component", () => {
  const defaultProps = {
    isPlaying: true,
    isCurrentUser: true,
    handleKeyPress: jest.fn(),
    handleKeyRelease: jest.fn(),
    note: [],
  };

  test("renders all required child components", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GameController {...defaultProps} />
        </BrowserRouter>
      </Provider>,
    );

    const canvas = screen.getByTestId("canvas-container");
    const textContainer = screen.getByTestId("text-container");
    const columnsContainer = screen.getByTestId("columns-container");
    const hitBox = screen.getByTestId("hit-box");
    const keyBoxes = screen.getAllByTestId("key-box");

    expect(canvas).toBeInTheDocument();
    expect(textContainer).toBeInTheDocument();
    expect(columnsContainer).toBeInTheDocument();
    expect(hitBox).toBeInTheDocument();
    keyBoxes.forEach((keyBox) => {
      expect(keyBox).toBeInTheDocument();
    });
  });
});
