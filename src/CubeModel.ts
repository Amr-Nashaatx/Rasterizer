import type { Canvas } from "./canvas";
import { Color } from "./math/color";
import { projectPoint } from "./math/functions";
import { Matrix4 } from "./math/Matrix4";
import { Point } from "./math/point";
import type { Vector } from "./math/vector";
import { TriangleDrawer } from "./TriangleDrawer";
import { Triangle } from "./math/Triangle";

const cubeVertices = [
  // Front face (z = -1)
  new Point(-1, -1, -1), // 0
  new Point(1, -1, -1), // 1
  new Point(1, 1, -1), // 2
  new Point(-1, 1, -1), // 3

  // Back face (z = 1)
  new Point(-1, -1, 1), // 4
  new Point(1, -1, 1), // 5
  new Point(1, 1, 1), // 6
  new Point(-1, 1, 1), // 7
];
const trianglesData = [
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

export class CubeModel {
  private triangleDrawer: TriangleDrawer;
  private verticesList: Point[];
  private trianglesData: typeof trianglesData;
  transform: Matrix4;
  constructor(private canvas: Canvas) {
    this.canvas = canvas;
    this.triangleDrawer = new TriangleDrawer(this.canvas);
    this.verticesList = cubeVertices;
    this.trianglesData = trianglesData;
    this.transform = Matrix4.identity();
  }

  translate(v: Vector) {
    const translateMatrix = Matrix4.createTranslationMatrix4(v.x, v.y, v.z);
    this.transform = this.transform.multiply(translateMatrix);
  }
  rotate(theta: number, axis: "X" | "Y" | "Z") {
    let rotationMatrix: Matrix4 = Matrix4.identity();
    if (axis === "X")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationXMatrix(theta)
      );
    else if (axis === "Y")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationYMatrix(theta)
      );
    else if (axis === "Z")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationZMatrix(theta)
      );

    this.transform = this.transform.multiply(rotationMatrix);
  }
  scale(sx: number, sy: number, sz: number) {
    this.transform = this.transform.multiply(
      Matrix4.createScaleMatrix4(sx, sy, sz)
    );
  }
  applyViewMatrix(view: Matrix4) {
    this.transform = this.transform.multiply(view);
  }
  renderObject() {
    const transformedAndProjected: Point[] = new Array(
      this.verticesList.length
    );
    for (let i = 0; i < this.verticesList.length; i++) {
      const transformedVertex = this.transform.multiplyPoint(
        this.verticesList[i]
      );
      const projectedVertex = projectPoint(transformedVertex);
      transformedAndProjected[i] = projectedVertex;
    }
    const trianglesList = this.trianglesData.map((t) => {
      const p1 = transformedAndProjected[t.v1Index];
      const p2 = transformedAndProjected[t.v2Index];
      const p3 = transformedAndProjected[t.v3Index];

      const tri = new Triangle(p1, p2, p3);
      tri.addColor(t.color);
      return tri;
    });

    for (let t of trianglesList) {
      this.triangleDrawer.drawWireframeTriangle(t);
    }
  }
}
