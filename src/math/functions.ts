import { VIEWPORT_DISTANCE } from "../constants";
import type { Plane } from "./Plane";
import { Point } from "./point";
import type { Triangle } from "./Triangle";
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

export function clipTriangle(tri: Triangle, plane: Plane) {
  const signedDistances = [];
  signedDistances.push(computeSignedDistance(plane, tri.v0));
  signedDistances.push(computeSignedDistance(plane, tri.v1));
  signedDistances.push(computeSignedDistance(plane, tri.v2));

  const allNegative =
    signedDistances[0] < 0 && signedDistances[1] < 0 && signedDistances[2] < 0;
  const allPositive =
    signedDistances[0] > 0 && signedDistances[1] > 0 && signedDistances[2] > 0;

  let posCount = 0;
  let negCount = 0;
  for (let d of signedDistances) {
    if (d > 0) posCount++;
    if (d < 0) negCount++;
  }
  const onlyOneIsPositive = posCount === 1 ? true : false;
  const onlyOneIsNegative = negCount === 1 ? true : false;

  if (allPositive) return [tri];
  else if (allNegative) return [];
  else if (onlyOneIsPositive) {
  } else if (onlyOneIsNegative) {
  }
}
