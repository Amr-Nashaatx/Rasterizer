import { Canvas } from "./canvas";
import { Color } from "./math/color";
import { Point } from "./math/point";
import { MeshObject } from "./MeshObject";

const cubeVertices = [
  // Front face (z = 5)
  new Point(-1, -1, 5), // 0
  new Point(1, -1, 5), // 1
  new Point(1, 1, 5), // 2
  new Point(-1, 1, 5), // 3

  // Back face (z = 7)
  new Point(-1, -1, 7), // 4
  new Point(1, -1, 7), // 5
  new Point(1, 1, 7), // 6
  new Point(-1, 1, 7), // 7
];

const triangleVertices = [
  { v1Index: 0, v2Index: 1, v3Index: 2, color: new Color(255, 0, 0) },
  { v1Index: 0, v2Index: 2, v3Index: 3, color: new Color(255, 0, 0) },

  { v1Index: 4, v2Index: 0, v3Index: 3, color: new Color(0, 255, 0) },
  { v1Index: 4, v2Index: 3, v3Index: 7, color: new Color(0, 255, 0) },

  { v1Index: 5, v2Index: 4, v3Index: 7, color: new Color(0, 0, 255) },
  { v1Index: 5, v2Index: 7, v3Index: 6, color: new Color(0, 0, 255) },

  { v1Index: 1, v2Index: 5, v3Index: 6, color: new Color(255, 255, 0) },
  { v1Index: 1, v2Index: 6, v3Index: 2, color: new Color(255, 255, 0) },

  { v1Index: 4, v2Index: 5, v3Index: 1, color: new Color(128, 0, 128) },
  { v1Index: 4, v2Index: 1, v3Index: 0, color: new Color(128, 0, 128) },

  { v1Index: 2, v2Index: 6, v3Index: 7, color: new Color(0, 255, 255) },
  { v1Index: 2, v2Index: 7, v3Index: 3, color: new Color(0, 255, 255) },
];

const canvas = new Canvas();

const object = new MeshObject(cubeVertices, triangleVertices, canvas);
object.renderObject();
