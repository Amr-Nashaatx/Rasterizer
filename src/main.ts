import { CubeModel } from "./CubeModel";
import { Scene } from "./Scene";
import { Canvas } from "./canvas";
import { Color } from "./math/color";
import { Point } from "./math/point";

const scene = new Scene();
const canvas = new Canvas();

// Helper function to create a cube
function createCube(x: number, y: number, z: number, color: Color) {
  const vertices = [
    new Point(-1 + x, -1 + y, -1 + z),
    new Point(1 + x, -1 + y, -1 + z),
    new Point(1 + x, 1 + y, -1 + z),
    new Point(-1 + x, 1 + y, -1 + z),
    new Point(-1 + x, -1 + y, 1 + z),
    new Point(1 + x, -1 + y, 1 + z),
    new Point(1 + x, 1 + y, 1 + z),
    new Point(-1 + x, 1 + y, 1 + z),
  ];
  const triangles = [
    { v1Index: 0, v2Index: 1, v3Index: 2, color },
    { v1Index: 0, v2Index: 2, v3Index: 3, color },
    { v1Index: 4, v2Index: 0, v3Index: 3, color },
    { v1Index: 4, v2Index: 3, v3Index: 7, color },
    { v1Index: 5, v2Index: 4, v3Index: 7, color },
    { v1Index: 5, v2Index: 7, v3Index: 6, color },
    { v1Index: 1, v2Index: 5, v3Index: 6, color },
    { v1Index: 1, v2Index: 6, v3Index: 2, color },
    { v1Index: 4, v2Index: 5, v3Index: 1, color },
    { v1Index: 4, v2Index: 1, v3Index: 0, color },
    { v1Index: 2, v2Index: 6, v3Index: 7, color },
    { v1Index: 2, v2Index: 7, v3Index: 3, color },
  ];
  return new CubeModel(canvas, { vertices, triangles });
}

// TEST SCENE: 5 cubes at different depths and positions
// Camera is at z=0 looking down the +Z axis

// Cube 1: RED - Closest (front-left)
const cube1 = createCube(-3, 0, 5, new Color(255, 0, 0));
scene.addObject(cube1);

// Cube 2: GREEN - Middle depth (center)
const cube2 = createCube(0, 0, 10, new Color(0, 255, 0));
scene.addObject(cube2);

// Cube 3: BLUE - Farthest (back-right)
const cube3 = createCube(3, 0, 15, new Color(0, 0, 255));
scene.addObject(cube3);

// Cube 4: YELLOW - Close (above center-left)
const cube4 = createCube(-1.5, 3, 7, new Color(255, 255, 0));
scene.addObject(cube4);

// Cube 5: MAGENTA - Middle (below center-right)
const cube5 = createCube(1.5, -3, 12, new Color(255, 0, 255));
scene.addObject(cube5);

console.log("=== TEST SCENE SETUP ===");
console.log("Camera: at origin (0, 0, 0) looking down +Z axis");
console.log("5 cubes created:");
console.log("  1. RED cube at (-3, 0, 5) - CLOSEST, left side");
console.log("  2. GREEN cube at (0, 0, 10) - MIDDLE, center");
console.log("  3. BLUE cube at (3, 0, 15) - FARTHEST, right side");
console.log("  4. YELLOW cube at (-1.5, 3, 7) - upper-left area");
console.log("  5. MAGENTA cube at (1.5, -3, 12) - lower-right area");

scene.renderScene();
