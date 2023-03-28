import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Error from "./index";

describe("renders Error component", () => {
  it("renders Error component", () => {
    const error = {
      status: "500",
      text: "Internal Server Error",
      message: "Something went wrong.",
    };
    render(
      <BrowserRouter>
        <Error location={{ state: error }} />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(`${error.status}, ${error.text}`),
    ).toBeInTheDocument();
    expect(screen.getByText(error.message)).toBeInTheDocument();
  });
});
