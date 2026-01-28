import type { Canvas } from "./canvas";
import { Color } from "./math/color";
import { projectPoint } from "./math/functions";
import { Matrix4 } from "./math/Matrix4";
import { Point } from "./math/point";
import type { Vector } from "./math/vector";
import { TriangleDrawer } from "./TriangleDrawer";
import { Triangle } from "./math/Triangle";

interface ModelData {
  vertices: Point[];
  triangles: {
    v1Index: number;
    v2Index: number;
    v3Index: number;
    color: Color;
  }[];
}
export class CubeModel {
  private triangleDrawer: TriangleDrawer;
  transform: Matrix4;
  triangles: Triangle[];
  constructor(
    private canvas: Canvas,
    data: ModelData | Triangle[],
  ) {
    this.triangleDrawer = new TriangleDrawer(this.canvas);
    this.transform = Matrix4.identity();
    if (Array.isArray(data)) {
      this.triangles = data;
    } else {
      this.triangles = this.buildFromModelData(data);
    }
  }
  private buildFromModelData(data: ModelData): Triangle[] {
    return data.triangles.map((t) => {
      const p1 = data.vertices[t.v1Index].clone();
      const p2 = data.vertices[t.v2Index].clone();
      const p3 = data.vertices[t.v3Index].clone();

      const tri = new Triangle(p1, p2, p3);
      tri.addColor(t.color);
      return tri;
    });
  }
  translate(v: Vector) {
    const translateMatrix = Matrix4.createTranslationMatrix4(v.x, v.y, v.z);
    this.transform = this.transform.multiply(translateMatrix);
  }
  rotate(theta: number, axis: "X" | "Y" | "Z") {
    let rotationMatrix: Matrix4 = Matrix4.identity();
    if (axis === "X")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationXMatrix(theta),
      );
    else if (axis === "Y")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationYMatrix(theta),
      );
    else if (axis === "Z")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationZMatrix(theta),
      );

    this.transform = this.transform.multiply(rotationMatrix);
  }
  scale(sx: number, sy: number, sz: number) {
    this.transform = this.transform.multiply(
      Matrix4.createScaleMatrix4(sx, sy, sz),
    );
  }
  getBoundingSphere() {
    if (this.triangles.length === 0) {
      const pos = this.transform.extractPosition();
      return { center: new Point(pos.x, pos.y, pos.z), radius: 0 };
    }

    const firstVert = this.triangles[0].v0;
    let minX = firstVert.x;
    let minY = firstVert.y;
    let minZ = firstVert.z;

    let maxX = minX;
    let maxY = minY;
    let maxZ = minZ;

    // iterate through all vertices for every triangle, find extremes
    for (const tri of this.triangles) {
      const vertices = [tri.v0, tri.v1, tri.v2];
      for (const v of vertices) {
        if (v.x < minX) minX = v.x;
        if (v.y < minY) minY = v.y;
        if (v.z < minZ) minZ = v.z;

        if (v.x > maxX) maxX = v.x;
        if (v.y > maxY) maxY = v.y;
        if (v.z > maxZ) maxZ = v.z;
      }
    }

    const localCenter = new Point(
      (minX + maxX) / 2,
      (minY + maxY) / 2,
      (minZ + maxZ) / 2,
    );

    let maxDistSq = 0;
    for (const tri of this.triangles) {
      const vertices = [tri.v0, tri.v1, tri.v2];
      for (const v of vertices) {
        const distSq =
          Math.pow(v.x - localCenter.x, 2) +
          Math.pow(v.y - localCenter.y, 2) +
          Math.pow(v.z - localCenter.z, 2);
        if (distSq > maxDistSq) maxDistSq = distSq;
      }
    }

    const localRadius = Math.sqrt(maxDistSq);

    // To handle non-uniform scaling (sx, sy, sz), we find the max scale
    const [scaleX, scaleY, scaleZ] = this.transform.extractScale();

    const worldRadius = localRadius * Math.max(scaleX, scaleY, scaleZ);
    const worldCenter = this.transform.multiplyPoint(localCenter);

    return { center: worldCenter, radius: worldRadius };
  }

  deepClone() {
    const clonedTriangles = this.triangles.map((tri) => tri.clone());
    const clone = new CubeModel(this.canvas, clonedTriangles);

    clone.transform = new Matrix4([...this.transform.m]);
    return clone;
  }
  renderObject(viewMatrix: Matrix4) {
    const modelViewMatrix = viewMatrix.multiply(this.transform);

    for (let tri of this.triangles) {
      // 1. Transform LOCAL points to VIEW space
      const v0View = modelViewMatrix.multiplyPoint(tri.v0);
      const v1View = modelViewMatrix.multiplyPoint(tri.v1);
      const v2View = modelViewMatrix.multiplyPoint(tri.v2);

      // 2. Projection
      const p0 = projectPoint(v0View);
      const p1 = projectPoint(v1View);
      const p2 = projectPoint(v2View);

      const projectedTri = new Triangle(p0, p1, p2);
      projectedTri.addColor(tri.color);

      this.triangleDrawer.drawFilledTriangle(projectedTri, false);
    }
  }
}
