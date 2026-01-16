import { Camera } from "./Camera";
import { Canvas } from "./canvas";
import type { CubeModel } from "./CubeModel";
import { Vector } from "./math/vector";

export class Scene {
  models: CubeModel[];
  canvas: Canvas;
  selectedObj: number;
  camera: Camera;
  constructor() {
    this.models = [];
    this.camera = new Camera();
    this.canvas = new Canvas();
    this.selectedObj = 0;
  }
  moveCamera(v: Vector) {
    this.camera.moveCameraGlobal(v);
  }
  rotateCamera(theta: number, axis: "X" | "Y" | "Z") {
    this.camera.rotate(theta, axis);
  }
  addObject(Model: typeof CubeModel) {
    const model = new Model(this.canvas);
    this.models.push(model);
  }
  selectObject(idx: number) {
    this.selectedObj = idx;
  }
  moveSelected(v: Vector) {
    this.models[this.selectedObj].translate(v);
  }
  rotateSelected(theta: number, axis: "X" | "Y" | "Z") {
    this.models[this.selectedObj].rotate(theta, axis);
  }
  renderScene() {
    const viewMatrix = this.camera.getViewMatrix();
    for (let m of this.models) {
      m.applyViewMatrix(viewMatrix);
      m.renderObject();
    }
  }
}
