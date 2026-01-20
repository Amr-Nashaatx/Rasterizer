import { Camera } from "./Camera";
import { Canvas } from "./canvas";
import { Clipper } from "./Clipper";
import type { CubeModel } from "./CubeModel";
import { Plane } from "./math/Plane";
import { Vector } from "./math/vector";

export class Scene {
  models: CubeModel[];
  canvas: Canvas;
  selectedObj: number;
  camera: Camera;
  clippingPlanes: Plane[];
  constructor(clippingPlanes?: Plane[]) {
    this.models = [];
    this.camera = new Camera();
    this.canvas = new Canvas();
    this.clippingPlanes = clippingPlanes
      ? clippingPlanes
      : this.buildPerspectiveFrustum();
    this.selectedObj = 0;
  }

  private buildPerspectiveFrustum(): Plane[] {
    // Perspective frustum parameters
    const fov = Math.PI / 3; // 60 degrees
    const aspectRatio = 1.0; // Square viewport
    const nearPlane = 0.1;
    const farPlane = 100;

    // Calculate half angles
    const halfFovY = fov / 2;
    const halfFovX = Math.atan(Math.tan(halfFovY) * aspectRatio);

    // sin and cos of the half angles
    const sinFovX = Math.sin(halfFovX);
    const cosFovX = Math.cos(halfFovX);
    const sinFovY = Math.sin(halfFovY);
    const cosFovY = Math.cos(halfFovY);

    // Normalize for unit normals
    const normalizeX = Math.sqrt(sinFovX * sinFovX + cosFovX * cosFovX);
    const normalizeY = Math.sqrt(sinFovY * sinFovY + cosFovY * cosFovY);

    return [
      // Left plane: normal = (sin(fovX), 0, cos(fovX))
      new Plane(new Vector(sinFovX / normalizeX, 0, cosFovX / normalizeX), 0),

      // Right plane: normal = (-sin(fovX), 0, cos(fovX))
      new Plane(new Vector(-sinFovX / normalizeX, 0, cosFovX / normalizeX), 0),

      // Bottom plane: normal = (0, sin(fovY), cos(fovY))
      new Plane(new Vector(0, sinFovY / normalizeY, cosFovY / normalizeY), 0),

      // Top plane: normal = (0, -sin(fovY), cos(fovY))
      new Plane(new Vector(0, -sinFovY / normalizeY, cosFovY / normalizeY), 0),

      // Near plane: z = nearPlane
      new Plane(new Vector(0, 0, 1), -nearPlane),

      // Far plane: z = farPlane
      new Plane(new Vector(0, 0, -1), farPlane),
    ];
  }

  private transformPlanesByCamera(planes: Plane[]): Plane[] {
    // Transform planes by the camera's transform matrix
    // This makes the frustum follow the camera's position and orientation
    const cameraTransform = this.camera.transform;
    const rotation = cameraTransform.extractRotation();

    return planes.map((plane) => {
      // Transform the normal by the rotation
      const transformedNormal = rotation.multiplyVector(plane.normal);

      // Transform the D value by camera position
      const cameraPos = cameraTransform.extractPosition();
      const transformedD = plane.D - cameraPos.dot(transformedNormal);

      return new Plane(transformedNormal, transformedD);
    });
  }
  moveCamera(v: Vector) {
    this.camera.moveCameraGlobal(v);
  }
  rotateCamera(theta: number, axis: "X" | "Y" | "Z") {
    this.camera.rotate(theta, axis);
  }
  addObject(object: CubeModel) {
    this.models.push(object);
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
    const transformedPlanes = this.transformPlanesByCamera(this.clippingPlanes);
    for (let m of this.models) {
      const clipped = Clipper.clipInstance(m, transformedPlanes);
      if (clipped) clipped.renderObject(viewMatrix);
    }
  }
}
