import { render, screen, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "../../store/configureStore";

import App from "./index";

test("renders App component", async () => {
  await act(async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>,
    );
  });

  await waitFor(() => screen.getByText("The Beat"));

  expect(screen.getByText("The Beat")).toBeInTheDocument();
});
