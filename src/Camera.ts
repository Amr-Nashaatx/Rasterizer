import { Matrix4 } from "./math/Matrix4";
import { Point } from "./math/point";
import { Vector } from "./math/vector";

export class Camera {
  transform: Matrix4;
  constructor() {
    this.transform = Matrix4.identity();
  }

  moveCamera(v: Vector) {
    const translationMatrix = Matrix4.createTranslationMatrix4(v.x, v.y, v.z);
    this.transform = this.transform.multiply(translationMatrix);
  }
  rotate(theta: number, axis: "X" | "Y" | "Z") {
    let rotationMatrix: Matrix4 = Matrix4.identity();
    if (axis === "X")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationXMatrix(theta)
      );
    else if (axis === "Y")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationYMatrix(theta)
      );
    else if (axis === "Z")
      rotationMatrix = rotationMatrix.multiply(
        Matrix4.createRotationZMatrix(theta)
      );

    this.transform = this.transform.multiply(rotationMatrix);
  }

  getViewMatrix() {
    const invRot = this.transform.extractRotation().transpose();
    const pos = this.transform.extractPosition();
    const invPos = invRot.multiplyVector(pos).scale(-1);

    return Matrix4.embedRotation3WithTranslation(invRot, invPos);
  }
}
