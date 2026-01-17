import type { Vector } from "./vector";

export class Plane {
  constructor(public normal: Vector, public D: number) {}
}
