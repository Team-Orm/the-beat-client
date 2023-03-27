import React from "react";
import axios from "axios";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import Lobby from "./index";

jest.mock("axios");

describe("Lobby Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        rooms: [
          {
            _id: "641e2ea048f3de2770b138f1",
            song: "6417c11a73a58fddc091e294",
            createdBy: "Test",
            uid: "aaaaa1111122222",
          },
        ],
      },
    });
  });

  it("renders headerContainer without crashing", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const headerContainer = screen.getByTestId("header-container");
    expect(headerContainer).toBeInTheDocument();
  });

  it("renders lobbyContainer without crashing", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const lobbyContainer = screen.getByTestId("lobby-container");
    expect(lobbyContainer).toBeInTheDocument();
  });

  it("renders UI elements correctly", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const makeRoomButton = screen.getByRole("button", {
      name: "방 만들기",
    });
    expect(makeRoomButton).toBeInTheDocument();

    const logoutButton = screen.getByRole("button", {
      name: "Logout",
    });
    expect(logoutButton).toBeInTheDocument();

    const chatButton = screen.getByRole("button", { name: "Send" });
    expect(chatButton).toBeInTheDocument();

    const createdBy = screen.getByText((content, element) => {
      return content.includes("Test");
    });
    expect(createdBy).toBeInTheDocument();
  });

  it("handles chat message input and send chat", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const chatInput = screen.getByRole("textbox");
    expect(chatInput).toBeInTheDocument();

    fireEvent.change(chatInput, { target: { value: "Test chat message" } });
    expect(chatInput.value).toBe("Test chat message");

    const chatButton = screen.getByRole("button", { name: "Send" });
    fireEvent.click(chatButton);
  });

  it("navigates to the room when a room is clicked", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const roomElement = screen.getByText((content, element) => {
      return content.includes("Test");
    });

    await act(async () => {
      fireEvent.click(roomElement);
    });

    expect(window.location.pathname).toBe("/login");
  });

  it("navigates to /room/create when '방 만들기' button is clicked", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Lobby />
        </BrowserRouter>,
      );
    });

    const makeRoomButton = screen.getByRole("button", {
      name: "방 만들기",
    });

    await act(async () => {
      fireEvent.click(makeRoomButton);
    });

    expect(window.location.pathname).toBe("/login");
  });
});
