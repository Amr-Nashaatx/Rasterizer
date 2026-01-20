# Rasterizer

A small, experimental TypeScript rasterizer demo using the HTML5 Canvas and Vite.

## Purpose

Minimal starter for exploring software rasterization techniques in the browser.

## Key Capabilities

- **Custom Math Library**: Implements strictly typed Vector, Matrix4, and Point classes for 3D transformations.
- **Camera System**: Features a full 6-DOF camera with local and global movement/rotation and View Matrix calculation.
- **Pipeline Stages**: Implements a 3D rendering pipeline including frustum clipping against 6 planes and perspective projection.

## What you can do

Since this is a rasterizer framework without a runtime UI, interactions are done programmatically:

- **Programmatic Scene Creation**: Use `Scene` and `CubeModel` to compose 3D scenes in `src/main.ts`.
- **Camera Control**: Manipulate the camera position and rotation via code (e.g., `scene.moveCamera`, `scene.rotateCamera`).

## Prerequisites

- Node.js (14+) and npm

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open the app at the address printed by Vite (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project layout

- [index.html](index.html)
- [src/main.ts](src/main.ts) — App entry point and scene setup
- [src/Scene.ts](src/Scene.ts) — Scene graph and camera management
- [src/TriangleDrawer.ts](src/TriangleDrawer.ts) — Triangle rasterization and shading
- [src/Clipper.ts](src/Clipper.ts) — Frustum clipping logic
- [src/math](src/math) — Custom math library
