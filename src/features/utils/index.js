import { COLUMN_RGB_COLORS } from "../../store/constants";

export const calculateScore = (word) => {
  let score;

  switch (word) {
    case "excellent":
      score = 100;
      break;
    case "good":
      score = 70;
      break;
    case "miss":
      score = 0;
      break;
    default:
      score = 0;
  }

  return score;
};

export const getColor = (index) => {
  switch (index) {
    case 0:
    case 5:
      return COLUMN_RGB_COLORS[0];
    case 1:
    case 4:
      return COLUMN_RGB_COLORS[1];
    default:
      return COLUMN_RGB_COLORS[2];
  }
};
