import type { Matrix4 } from "../math/Matrix4";
import type { Point } from "../math/point";
import type { Vector } from "../math/vector";

export interface Model {
  translate(v: Vector): void;
  rotate(theta: number, axis: "X" | "Y" | "Z"): void;
  scale(sx: number, sy: number, sz: number): void;
  renderObject(viewMatrix: Matrix4): void;
  getBoundingSphere(): { center: Point; radius: number };
  deepClone(): Model;
}
