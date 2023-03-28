import "@testing-library/jest-dom";
import "jest-canvas-mock";
import "jest-styled-components";

if (typeof setImmediate === "undefined") {
  global.setImmediate = setTimeout;
}
