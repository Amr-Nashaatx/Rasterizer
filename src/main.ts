import { Canvas } from "./canvas";
import { Vector } from "./math/vector";
import { CubeModel } from "./CubeModel";

const canvas = new Canvas();

const object = new CubeModel(canvas);
object.translate(new Vector(0, 0, 8));
// object.rotate(Math.PI / 3, "X");
object.scale(2, 2, 1);
object.renderObject();
