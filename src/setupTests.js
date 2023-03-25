import "@testing-library/jest-dom";

if (typeof setImmediate === "undefined") {
  global.setImmediate = setTimeout;
}
