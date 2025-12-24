import { LineDrawer } from "./LineDrawer";
import { Color } from "./math/color";
import { Point } from "./math/point";
import { Canvas } from "./canvas";
import { TriangleDrawer } from "./TriangleDrawer";

const canvas = new Canvas();
const triangleDrawer = new TriangleDrawer(canvas);

let p0, p1, p2;
p0 = new Point(-50, -200);
p1 = new Point(60, 240);
p2 = new Point(-200, -100);

// triangleDrawer.drawWireframeTriangle(p0, p1, p2, new Color(255, 0, 0));
triangleDrawer.drawFilledTriangle(
  new Point(-200, -100, 0),
  new Point(0, 200, 0),
  new Point(200, -50, 0),
  new Color(255, 0, 0)
);
