import type { Canvas } from "./canvas";
import type { Color } from "./math/color";
import { projectPoint } from "./math/functions";
import type { Point } from "./math/point";
import { Triangle } from "./Triangle";

interface TriangleVertices {
  v1Index: number;
  v2Index: number;
  v3Index: number;
  color: Color;
}

export class MeshObject {
  private triangle: Triangle;
  constructor(
    private verticesList: Point[],
    private trianglesList: TriangleVertices[],
    private canvas: Canvas
  ) {
    this.canvas = canvas;
    this.triangle = new Triangle(this.canvas);
  }

  private renderTriangleWireframe(
    triangleVertices: TriangleVertices,
    projectedList: Point[]
  ) {
    const p1 = projectedList[triangleVertices.v1Index];
    const p2 = projectedList[triangleVertices.v2Index];
    const p3 = projectedList[triangleVertices.v3Index];

    const color = triangleVertices.color;

    this.triangle.drawWireframeTriangle(p1, p2, p3, color);
  }

  renderObject() {
    const projected: Point[] = [];
    for (let v of this.verticesList) {
      projected.push(projectPoint(v));
    }

    for (let t of this.trianglesList) {
      this.renderTriangleWireframe(t, projected);
    }
  }
}
