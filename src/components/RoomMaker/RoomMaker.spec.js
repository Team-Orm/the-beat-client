import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import RoomMaker from "./index";
import axios from "axios";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

const mockedSongs = [
  {
    _id: "1",
    title: "song 1",
    artist: "artist 1",
    imageURL: "http://localhost:3000/song1.jpg",
    audioURL: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
  },
  {
    _id: "2",
    title: "song 2",
    artist: "artist 2",
    imageURL: "http://localhost:3000/song2.jpg",
    audioURL: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
  },
  {
    _id: "3",
    title: "song 3",
    artist: "artist 3",
    imageURL: "http://localhost:3000/song3.jpg",
    audioURL: "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
  },
];

describe("RoomMaker", () => {
  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = jest.fn();
    window.HTMLMediaElement.prototype.pause = jest.fn();
  });

  beforeEach(async () => {
    localStorage.setItem("jwt", "dummy_token");
    window.HTMLMediaElement.prototype.pause = jest.fn();

    axios.get.mockResolvedValue({
      status: 200,
      data: { songs: mockedSongs },
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <RoomMaker />
        </MemoryRouter>,
      );
    });
  });

  it("renders the container", () => {
    const container = screen.getByTestId("room-maker-container");
    expect(container).toBeInTheDocument();
  });

  it("renders the play button", () => {
    const playButton = screen.getByText(/BGM ON/i);
    expect(playButton).toBeInTheDocument();
  });

  it("renders the list of songs", async () => {
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
    const songContainers = mockedSongs.map((song) =>
      screen.getByTestId(`${song._id.toString()}`),
    );

    expect(songContainers.length).toBe(mockedSongs.length);

    mockedSongs.forEach((song, index) => {
      const songContainer = songContainers[index];
      const songTitle = screen.getByText(`${song.title} - ${song.artist}`);
      const profileImage = songContainer.querySelector("img");

      expect(songContainer).toBeInTheDocument();
      expect(songTitle).toBeInTheDocument();
      expect(profileImage).toHaveAttribute("src", song.imageURL);
    });
  });

  it("toggles play button and BGM", async () => {
    const playButton = screen.getByText(/BGM ON/i);
    const mockPlay = jest.spyOn(window.HTMLMediaElement.prototype, "play");
    const selectedSongId = "2";

    await act(async () => {
      fireEvent.click(playButton);
    });
    expect(playButton.textContent).toBe("⏸️ BGM OFF");
    const songElement = screen.getByTestId(selectedSongId);

    await act(async () => {
      fireEvent.mouseEnter(songElement);
    });

    expect(mockPlay).toHaveBeenCalledTimes(1);

    await act(async () => {
      fireEvent.click(playButton);
    });
    expect(playButton.textContent).toBe("🎵 BGM ON");
  });

  it("selects a song and shows checkbox", async () => {
    const selectedSongId = "2";

    await act(async () => {
      fireEvent.click(screen.getByTestId(selectedSongId));
    });
    const selectedSongContainer = screen.getByTestId(selectedSongId);

    expect(selectedSongContainer.querySelector(".sc-fsYeqs")).toHaveTextContent(
      "✅",
    );
  });
});
