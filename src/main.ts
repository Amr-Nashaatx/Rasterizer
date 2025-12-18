import { Drawer } from "./drawer";
import { Color } from "./math/color";
import { Point } from "./math/point";
const drawer = new Drawer();

let p0, p1;
p0 = new Point(-50, -200);
p1 = new Point(60, 240);
drawer.drawLine(p0, p1, new Color(0, 0, 0));

//  (−200,−100)−(240,120),
p0 = new Point(-200, -100);
p1 = new Point(240, 120);
drawer.drawLine(p0, p1, new Color(0, 0, 0));
