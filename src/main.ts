import { Vector } from "./math/vector";
import { CubeModel } from "./CubeModel";
import { Scene } from "./Scene";

const scene = new Scene();

scene.addObject(CubeModel);
scene.moveSelected(new Vector(0, 0, 8));

scene.moveCamera(new Vector(0, 0, -2));
scene.rotateCamera(Math.PI / 3, "X");

scene.renderScene();
