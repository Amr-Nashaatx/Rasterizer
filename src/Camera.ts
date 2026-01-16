import { Matrix4 } from "./math/Matrix4";
import { Vector } from "./math/vector";

export class Camera {
  transform: Matrix4;

  constructor() {
    this.transform = Matrix4.identity();
  }

  /**
   * Moves the camera in LOCAL space.
   * If you want to move in world space, swap the multiplication order.
   */
  moveCameraLocal(v: Vector) {
    const translation = Matrix4.createTranslationMatrix4(v.x, v.y, v.z);
    // Transform * Translation = Local movement
    this.transform = this.transform.multiply(translation);
  }

  moveCameraGlobal(v: Vector) {
    const translation = Matrix4.createTranslationMatrix4(v.x, v.y, v.z);
    this.transform = translation.multiply(this.transform);
  }
  /**
   * Rotates the camera.
   * For FPS-style controls, Y rotation is usually global (left-multiplied)
   * while X rotation is local (right-multiplied).
   */
  rotate(theta: number, axis: "X" | "Y" | "Z") {
    let rot: Matrix4;

    if (axis === "X") {
      rot = Matrix4.createRotationXMatrix(theta);
      // Local rotation (pitch)
      this.transform = this.transform.multiply(rot);
    } else if (axis === "Y") {
      rot = Matrix4.createRotationYMatrix(theta);
      // Global rotation (yaw) - prevents "tilting" the horizon
      this.transform = rot.multiply(this.transform);
    } else {
      rot = Matrix4.createRotationZMatrix(theta);
      this.transform = this.transform.multiply(rot);
    }
  }

  /**
   * The View Matrix is the inverse of the Camera's World Matrix.
   */
  getViewMatrix() {
    const invRot = this.transform.extractRotation().transpose();
    const pos = this.transform.extractPosition();
    const invPos = invRot.multiplyVector(pos).scale(-1);

    return Matrix4.embedRotation3WithTranslation(invRot, invPos);
  }
}
