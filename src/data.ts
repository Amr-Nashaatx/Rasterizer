import { Color } from "./math/color";
import { Point } from "./math/point";

let cubes: {
  vertices: Point[];
  triangles: {
    v1Index: number;
    v2Index: number;
    v3Index: number;
    color: Color;
  }[];
}[] = [];

function getCubeData(
  offsetX: number,
  offsetY: number,
  offsetZ: number,
  colorBase: Color,
) {
  return {
    vertices: [
      new Point(-1 + offsetX, -1 + offsetY, -1 + offsetZ),
      new Point(1 + offsetX, -1 + offsetY, -1 + offsetZ),
      new Point(1 + offsetX, 1 + offsetY, -1 + offsetZ),
      new Point(-1 + offsetX, 1 + offsetY, -1 + offsetZ),
      new Point(-1 + offsetX, -1 + offsetY, 1 + offsetZ),
      new Point(1 + offsetX, -1 + offsetY, 1 + offsetZ),
      new Point(1 + offsetX, 1 + offsetY, 1 + offsetZ),
      new Point(-1 + offsetX, 1 + offsetY, 1 + offsetZ),
    ],
    triangles: [
      { v1Index: 0, v2Index: 1, v3Index: 2, color: colorBase },
      { v1Index: 0, v2Index: 2, v3Index: 3, color: colorBase },
      { v1Index: 4, v2Index: 0, v3Index: 3, color: colorBase },
      { v1Index: 4, v2Index: 3, v3Index: 7, color: colorBase },
      { v1Index: 5, v2Index: 4, v3Index: 7, color: colorBase },
      { v1Index: 5, v2Index: 7, v3Index: 6, color: colorBase },
      { v1Index: 1, v2Index: 5, v3Index: 6, color: colorBase },
      { v1Index: 1, v2Index: 6, v3Index: 2, color: colorBase },
      { v1Index: 4, v2Index: 5, v3Index: 1, color: colorBase },
      { v1Index: 4, v2Index: 1, v3Index: 0, color: colorBase },
      { v1Index: 2, v2Index: 6, v3Index: 7, color: colorBase },
      { v1Index: 2, v2Index: 7, v3Index: 3, color: colorBase },
    ],
  };
}

// 1. CENTERED CUBE (Visible)
// In front of camera at Z = 5
cubes.push(getCubeData(0, 0, 5, new Color(255, 0, 0)));

// 2. BEHIND CAMERA (Fully Clipped)
// At Z = -5, this should not render at all
cubes.push(getCubeData(0, 0, -5, new Color(0, 255, 0)));

// 3. RIGHT-EDGE CUBE (Partially Clipped)
// At Z=5, the X boundary for 90° FOV is X=5.
// A cube at X=5, Z=5 will be sliced right down the middle by the Right plane.
cubes.push(getCubeData(5, 0, 5, new Color(0, 0, 255)));

export { cubes };
