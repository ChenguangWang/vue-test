/** Custom Utils (you can redefine them in component template) */
export const getGridGapDefault = (elementWidth, windowHeight) => {
  if (elementWidth > 720 && windowHeight > 480) {
    return 10;
  } else {
    return 5;
  }
};

export const getColumnCountDefault = (elementWidth) => {
  return Math.floor(elementWidth / 250);
};

export const getWindowMarginDefault = (windowHeight) => {
  return Math.round(windowHeight * 1.5);
};

export const getItemRatioHeightDefault = (height, width, columnWidth) => {
  const imageRatio = height / width;
  return Math.round(columnWidth * imageRatio);
};

/** Other utils */

export const debugLog = (condition, ...args) => {
  if (condition) {
    console.debug(...args);
  }
};
