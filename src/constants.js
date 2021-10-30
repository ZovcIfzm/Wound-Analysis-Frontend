//export const base_url = "https://gallagher-wound-analysis-api.herokuapp.com"
export const base_url = "";
export const base_ml_url = "https://gallagher-wound-analysis-ml.herokuapp.com";

export const maskConstants = {
  A: {
    lower_range: [
      [0, 75, 140],
      [165, 75, 140],
    ],
    upper_range: [
      [15, 255, 200],
      [180, 255, 200],
    ],
  },
  B: {
    lower_range: [
      [0, 95, 140],
      [165, 95, 140],
    ],
    upper_range: [
      [15, 255, 197],
      [180, 255, 197],
    ],
  },
  C: {
    lower_range: [
      [0, 100, 140],
      [165, 100, 140],
    ],
    upper_range: [
      [15, 255, 177],
      [180, 255, 177],
    ],
  },
  D: {
    lower_range: [
      [0, 105, 130],
      [165, 105, 130],
    ],
    upper_range: [
      [15, 255, 167],
      [180, 255, 167],
    ],
  },
  E: {
    lower_range: [
      [0, 110, 110],
      [165, 110, 110],
    ],
    upper_range: [
      [15, 255, 153],
      [180, 255, 153],
    ],
  },
};
