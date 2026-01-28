import { VIEWPORT_DISTANCE } from "../constants";
import { Plane } from "./Plane";
import { Point } from "./point";
import { Vector } from "./vector";

type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];
export function linearInterpolate(
  P0: Point,
  P1: Point,
  P2: Point,
  attr: NumberKeys<Point>,
): {
  right: number[];
  left: number[];
} {
  let p0 = P0.clone();
  let p1 = P1.clone();
  let p2 = P2.clone();

  // order the points according to y value ascending
  [p0, p1, p2] = sortByY(p0, p1, p2);
  // compute the all attr vlaues of the tall side,
  // and the short sides for each y value.
  // note: y is the independent variable here

  const attr01 = interpolate(p0.y, p0[attr], p1.y, p1[attr]);
  const attr12 = interpolate(p1.y, p1[attr], p2.y, p2[attr]);
  const attr02 = interpolate(p0.y, p0[attr], p2.y, p2[attr]);

  attr01.pop();
  const attr012 = [...attr01, ...attr12];

  // determine which is left and which is right
  const middle = p1.y - p0.y;
  let right: number[] = [];
  let left: number[] = [];

  if (attr02[middle] < attr012[middle]) {
    left = attr02;
    right = attr012;
  } else {
    left = attr012;
    right = attr02;
  }

  return { right, left };
}
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

export function sortByY(
  p0: Point,
  p1: Point,
  p2: Point,
): [Point, Point, Point] {
  if (p1.y < p0.y) [p0, p1] = [p1, p0];
  if (p2.y < p0.y) [p0, p2] = [p2, p0];
  if (p2.y < p1.y) [p1, p2] = [p2, p1];
  return [p0, p1, p2];
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
