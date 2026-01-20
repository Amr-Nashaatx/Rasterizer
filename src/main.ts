import { Vector } from "./math/vector";
import { CubeModel } from "./CubeModel";
import { Scene } from "./Scene";
import { Canvas } from "./canvas";
import { cubes } from "./data";
const scene = new Scene();

const canvas = new Canvas();
for (let c of cubes) {
  const obj = new CubeModel(canvas, c);
  scene.addObject(obj);
}

// scene.moveSelected(new Vector(0, 0, 1));

scene.moveCamera(new Vector(0, 0, 2));
scene.rotateCamera(Math.PI / 6, "Y");
// scene.rotateCamera(Math.PI / 3, "X");

scene.renderScene();
