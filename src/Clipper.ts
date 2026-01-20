import type { CubeModel } from "./CubeModel";
import { computeSignedDistance, intersetEdgeWithPlane } from "./math/functions";
import type { Plane } from "./math/Plane";
import { Triangle } from "./math/Triangle";

export class Clipper {
  static clipInstance(instance: CubeModel, planes: Plane[]) {
    let clippedInstance: CubeModel | null = instance;
    for (const p of planes) {
      clippedInstance = this.clipInstanceAgainstPlane(clippedInstance, p);
      if (!clippedInstance) return null;
    }
    return clippedInstance;
  }
  private static clipInstanceAgainstPlane(instance: CubeModel, plane: Plane) {
    const { center, radius } = instance.getBoundingSphere();
    const d = computeSignedDistance(plane, center);

    if (d > radius) return instance;
    else if (d < -radius) return null;
    else {
      const clippedInstance = instance.deepClone();
      clippedInstance.triangles = this.clipTrianglesAgainstPlane(
        clippedInstance.triangles,
        plane,
      );
      return clippedInstance;
    }
  }

  private static clipTrianglesAgainstPlane(tris: Triangle[], plane: Plane) {
    const clippedTris: Triangle[] = [];
    for (let t of tris) {
      clippedTris.push(...this.clipTriangle(t, plane));
    }
    return clippedTris;
  }

  private static clipTriangle(tri: Triangle, plane: Plane) {
    const signedDistances = [
      { p: tri.v0, d: computeSignedDistance(plane, tri.v0) },
      { p: tri.v1, d: computeSignedDistance(plane, tri.v1) },
      { p: tri.v2, d: computeSignedDistance(plane, tri.v2) },
    ];

    const inside = signedDistances.filter((v) => v.d >= 0);
    const outside = signedDistances.filter((v) => v.d < 0);

    // Case 1: All points inside
    if (inside.length === 3) {
      return [tri];
    }

    // Case 2: All points outside
    if (inside.length === 0) {
      return [];
    }

    // Case 3: One point inside (Triangle -> Smaller Triangle)
    if (inside.length === 1) {
      const A = inside[0].p;
      const B = outside[0].p;
      const C = outside[1].p;

      const B1 = intersetEdgeWithPlane([A, B], plane);
      const C1 = intersetEdgeWithPlane([A, C], plane);

      const newTri = new Triangle(A, B1, C1);
      newTri.addColor(tri.color);
      return [newTri];
    }

    // Case 4: Two points inside (Triangle -> Quadrilateral -> 2 Triangles)
    if (inside.length === 2) {
      const A = inside[0].p;
      const B = inside[1].p;
      const C = outside[0].p; // The only negative point

      // Create intersection points on the edges crossing the plane
      const A1 = intersetEdgeWithPlane([A, C], plane);
      const B1 = intersetEdgeWithPlane([B, C], plane);

      // Form two triangles to represent the quadrilateral (A-B-B1-A1)
      const newTri1 = new Triangle(A, B, B1);
      const newTri2 = new Triangle(A, B1, A1);
      newTri1.addColor(tri.color);
      newTri2.addColor(tri.color);

      return [newTri1, newTri2];
    }
    return [];
  }
}
