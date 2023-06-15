import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "./index";

describe("Loading Component", () => {
  it("renders loading spinner and text", () => {
    const text = "Loading...";
    render(<Loading text={text} />);

    const spinner = screen.getByTestId("spinner");
    const loadingText = screen.getByText(text);

    expect(spinner).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
