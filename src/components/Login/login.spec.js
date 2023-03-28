import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import Login from "./index";
import { act } from "react-dom/test-utils";
import axios from "axios";

jest.mock("axios");

describe("Login Component", () => {
  it("render Login component without crashing", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const loginContainer = screen.getByTestId("login-container");
    expect(loginContainer).toBeInTheDocument();
  });

  it("renders title, message, and login button", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const title = screen.getByText("The Beat");
    expect(title).toBeInTheDocument();

    const message = screen.getByText("Press Login Button to Start");
    expect(message).toBeInTheDocument();

    const googleLoginButton = screen.getByRole("button", {
      name: "Google Social Login",
    });
    expect(googleLoginButton).toBeInTheDocument();

    const userLoginButton = screen.getByRole("button", { name: "User Login" });
    expect(userLoginButton).toBeInTheDocument();
  });

  it("opens the login form when 'User Login' button is clicked", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>,
      );
    });

    const loginButton = screen.getByRole("button", { name: "User Login" });
    fireEvent.click(loginButton);

    const emailInput = screen.getByPlaceholderText("이메일");
    expect(emailInput).toBeInTheDocument();
  });

  it("opens the register form when 'User Register' button is clicked", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const registerButton = screen.getByRole("button", {
      name: "User Register",
    });
    fireEvent.click(registerButton);

    const nameInput = screen.getByPlaceholderText("이름");
    expect(nameInput).toBeInTheDocument();
  });

  it("logs in the user when the login form is submitted with valid inputs", async () => {
    const mockUser = {
      name: "test user111",
      email: "testuser111@example.com",
      password: "password111",
    };
    axios.post.mockResolvedValueOnce({ status: 201, data: { user: mockUser } });

    await act(async () => {
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>,
      );
    });

    const loginButton = screen.getByRole("button", { name: "User Login" });
    fireEvent.click(loginButton);

    const emailInput = screen.getByPlaceholderText("이메일");
    const passwordInput = screen.getByPlaceholderText("비밀번호");
    const submitButton = screen.getByRole("button", { name: "Login" });

    fireEvent.change(emailInput, { target: { value: mockUser.email } });
    fireEvent.change(passwordInput, { target: { value: mockUser.password } });

    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUser)),
    );
    await waitFor(() => expect(localStorage.getItem("jwt")).toBeDefined());
    await waitFor(() =>
      expect(screen.getByText("The Beat")).toBeInTheDocument(),
    );
  });
});
