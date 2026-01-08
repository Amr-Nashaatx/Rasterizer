import { Color } from "./math/color";
import { Point } from "./math/point";
import { Canvas } from "./canvas";
import { TriangleDrawer } from "./TriangleDrawer";
import { LineDrawer } from "./LineDrawer";
import { projectPoint } from "./math/functions";

const canvas = new Canvas();
const triangleDrawer = new TriangleDrawer(canvas);

const lineDrawer = new LineDrawer(canvas);

const A = new Point(-1, 0, 5);
const B = new Point(1, 0, 5);
// The four "front" vertices
// const vAf = new Point(-2, -0.5, 1);
// const vBf = new Point(-2, 0.5, 1);
// const vCf = new Point(-1, 0.5, 3);
// const vDf = new Point(-1, 0.5, 1);

// The four "back" vertices
// const vAb = new Point(-200, -50, 200);
// const vBb = new Point(-200, 50, 200);
// const vCb = new Point(-100, 50, 200);
// const vDb = new Point(-100, -50, 200);

// lineDrawer.drawLine(A, B, new Color(0, 0, 255));
lineDrawer.drawLine(projectPoint(A), projectPoint(B), new Color(0, 0, 255));
