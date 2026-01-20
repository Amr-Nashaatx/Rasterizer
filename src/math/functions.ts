import { VIEWPORT_DISTANCE } from "../constants";
import { Plane } from "./Plane";
import { Point } from "./point";
import { Vector } from "./vector";

export function interpolate(i0: number, d0: number, i1: number, d1: number) {
  if (i0 === i1) return [d0];
  const values = [];
  const slope = (d1 - d0) / (i1 - i0);
  let d = d0;
  for (let i = i0; i <= i1; i++) {
    values.push(d);
    d = d + slope;
  }
  return values;
}

export function swapPoints(P0: Point, P1: Point) {
  let temp = new Point(0, 0, 0);
  temp.x = P0.x;
  temp.y = P0.y;
  temp.z = P0.z;

  P0.x = P1.x;
  P0.y = P1.y;
  P0.z = P1.z;

  P1.x = temp.x;
  P1.y = temp.y;
  P1.z = temp.z;
}

export function projectPoint(point: Point) {
  const projX = (point.x * VIEWPORT_DISTANCE) / point.z;
  const projY = (point.y * VIEWPORT_DISTANCE) / point.z;

  const projPoint = new Point(projX, projY, point.z);
  return projPoint;
}

export function computeSignedDistance(p: Plane, vertex: Point) {
  const normal = p.normal;
  const posVector = new Vector(vertex.x, vertex.y, vertex.z);

  return posVector.dot(normal) + p.D;
}

export function intersetEdgeWithPlane(edge: [Point, Point], plane: Plane) {
  let A = new Vector(edge[0].x, edge[0].y, edge[0].z);
  let B = new Vector(edge[1].x, edge[1].y, edge[1].z);
  const D = plane.D;

  // t = ( - D - N dot A ) / N dot (B - A)
  const nDotA = plane.normal.dot(A);
  const nDotAB = plane.normal.dot(B.subtract(A));

  const t = (-D - nDotA) / nDotAB;

  // point of intersection Q = A + t(B - A)
  const Q = A.add(B.subtract(A).scale(t));
  return Q.toPoint();
}
