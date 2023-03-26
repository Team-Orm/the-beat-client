import "@testing-library/jest-dom";
import "jest-canvas-mock";

if (typeof setImmediate === "undefined") {
  global.setImmediate = setTimeout;
}
