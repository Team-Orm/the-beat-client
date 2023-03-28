import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error from "./index";

test("renders Error component", () => {
  const error = {
    status: "500",
    text: "Internal Server Error",
    message: "Something went wrong.",
  };
  render(
    <MemoryRouter>
      <Error location={{ state: error }} />
    </MemoryRouter>,
  );

  expect(
    screen.getByText(`${error.status}, ${error.text}`),
  ).toBeInTheDocument();
  expect(screen.getByText(error.message)).toBeInTheDocument();
});
