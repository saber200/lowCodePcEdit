export const GRID_SIZE = 20;

export const snapToGrid = (value) => {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
};

export const snapDimensionsToGrid = (width, height) => {
  return {
    width: Math.max(GRID_SIZE, snapToGrid(width)),
    height: Math.max(GRID_SIZE, snapToGrid(height))
  };
};

export const snapPositionToGrid = (x, y) => {
  return {
    x: Math.max(0, snapToGrid(x)),
    y: Math.max(0, snapToGrid(y))
  };
}; 