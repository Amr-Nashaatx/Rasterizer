import { Color } from "./math/color";
import { Point } from "./math/point";
import { Canvas } from "./canvas";
import { TriangleDrawer } from "./TriangleDrawer";

const canvas = new Canvas();
const triangleDrawer = new TriangleDrawer(canvas);

let p0, p1, p2;
p0 = new Point(-200, -100, 0);
p1 = new Point(0, 200, 0);
p2 = new Point(200, -50, 0);

p0.h = 0.1;
p1.h = 0.4;
p2.h = 1;
// triangleDrawer.drawWireframeTriangle(p0, p1, p2, new Color(255, 0, 0));
triangleDrawer.drawFilledTriangle(p0, p1, p2, new Color(255, 0, 0), true);
