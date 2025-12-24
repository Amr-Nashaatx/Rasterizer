# Rasterizer

A small, experimental TypeScript rasterizer demo using the HTML5 Canvas and Vite.

Purpose

- Minimal starter for exploring software rasterization techniques in the browser.

Features

- Simple canvas-based rasterization pipeline
- Small, readable TypeScript codebase for learning and extension

side note: After my experiment with my previous ray tracer project, 
using Typescript is making my life way easier than before, Types are extremely important in these types of projects.

Prerequisites

- Node.js (14+) and npm

Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

Open the app at the address printed by Vite (typically http://localhost:5173).

Build for production

```bash
npm run build
npm run preview
```

Project layout

- [index.html](index.html)
- [src/main.ts](src/main.ts) — app entry
- [src/canvas.ts](src/canvas.ts) — canvas setup and helpers
- [src/drawer.ts](src/drawer.ts) — rasterization/drawing routines
- [src/constants.ts](src/constants.ts)
- [src/math](src/math) — `color.ts`, `point.ts`, `vector.ts`
