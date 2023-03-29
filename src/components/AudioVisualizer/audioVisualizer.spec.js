import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import AudioVisualizer from "./index";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../store/configureStore";
import axios from "axios";

jest.mock("axios");

describe("AudioVisualizer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component and canvas element", async () => {
    const song = {
      audioURL: "https://example.com/audio.mp3",
    };

    axios.get.mockResolvedValue({
      status: 200,
      data: new Uint8Array(),
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <AudioVisualizer song={song} isPlaying={true} />
          </BrowserRouter>
        </Provider>,
      );
    });

    const canvasElement = screen.getByTestId("audio-visualizer");

    expect(canvasElement).toBeInTheDocument();
    expect(canvasElement.tagName).toBe("CANVAS");
    expect(canvasElement).toHaveAttribute("width", `${window.innerWidth}`);
    expect(canvasElement).toHaveAttribute("height", `${window.innerHeight}`);
  });
});
