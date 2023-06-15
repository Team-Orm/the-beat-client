import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound component", () => {
  it("renders a 404 error message", () => {
    render(
      <BrowserRouter path="nomatch">
        <NotFound />
      </BrowserRouter>,
    );

    const errorMessage = screen.getByText("404 Not Found");
    expect(errorMessage).toBeInTheDocument();
  });
});
