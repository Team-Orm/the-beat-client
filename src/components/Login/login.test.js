import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import Login from "./index";

describe("Login Component", () => {
  it("render Login component without crashing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const loginContainer = screen.getByTestId("login-container");
    expect(loginContainer).toBeInTheDocument();
  });

  it("renders title, message, and login button", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const title = screen.getByText("The Beat");
    expect(title).toBeInTheDocument();

    const message = screen.getByText("Press Login Button to Start");
    expect(message).toBeInTheDocument();

    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();
  });
});
