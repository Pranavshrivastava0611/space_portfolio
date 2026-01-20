# 🌌 Cinematic Space Portfolio (Next.js + WebGL + Theatre.js)

## Project Overview

This is a **client-rendered cinematic WebGL portfolio** built using **Next.js (App Router)**.  
The experience places the user in a **vast explorable space** with nebulae, stars, and glowing planets.

Each planet represents a **portfolio section**.  
When the user approaches a planet, a **gravity-based cinematic transition** is triggered using **Theatre.js**.

This is **not a traditional website** and **not a game** — it is a **cinematic interactive experience**.

---

## ⚠️ Rendering Strategy (CRITICAL)

This project is:

- ❌ **NOT Server-Side Rendered**
- ❌ **NOT Static Pre-rendered**
- ✅ **FULLY Client-Side Rendered**

### Why:
- WebGL must access `window`, `document`, and GPU
- No blocking hydration
- No waiting for assets

### Rule:
> **Nothing WebGL-related should run on the server**

---

## Next.js Architecture Rules

### 1️⃣ App Router Only

Use:
```txt
/app
  /page.tsx
  /layout.tsx
2️⃣ WebGL Scene Must Be a Client Component
Every file that touches:

three

@react-three/fiber

@theatre/*

MUST start with:

"use client";
Recommended Folder Structure
app/
 ├─ layout.tsx
 ├─ page.tsx
 ├─ providers.tsx
 └─ globals.css

components/
 ├─ CanvasRoot.tsx
 ├─ SpaceScene.tsx
 ├─ Camera/
 │   ├─ FreeRoamCamera.tsx
 │   └─ CinematicCamera.tsx
 ├─ Planets/
 │   ├─ Planet.tsx
 │   └─ planets.data.ts
 ├─ Effects/
 │   ├─ Starfield.tsx
 │   ├─ Nebula.tsx
 │   └─ PostProcessing.tsx

theatre/
 ├─ project.ts
 └─ sheets.ts

lib/
 ├─ gravity.ts
 └─ math.ts
Canvas Initialization (Client Only)
CanvasRoot.tsx
Single <Canvas />

Fullscreen

Mounted once

Rules:
No re-mounting the Canvas

No conditional Canvas rendering

Interaction Modes (Very Important)
🟢 Mode 1: Free Roam (Default)
User can move the camera freely

Light drift / mouse-based movement

No Theatre.js animations running

Lowest performance cost

Used for:

Exploration

First impression

No waiting or blocking

🔵 Mode 2: Cinematic Mode (Theatre.js)
Triggered when:

Camera enters a planet’s gravity radius

Actions:

Disable user camera controls

Hand camera control to Theatre.js

Play a pre-defined cinematic timeline

Transition environment & UI

Used for:

Planet entry

Section reveal

Visual storytelling

Planet Gravity System (Conceptual)
Each planet has:

{
  position: Vector3,
  gravityRadius: number,
  sectionId: string,
  theme: {
    color,
    fog,
    glow
  }
}
Logic:
Continuously calculate distance between camera and planet

When distance < gravityRadius:

Switch to cinematic mode

Trigger Theatre.js sequence

Smooth camera curve toward planet

⚠️ No teleporting. All motion must be eased.

Theatre.js Usage Rules
Use Theatre.js ONLY for:
Camera position & rotation

Camera FOV

Light color & intensity

Fog density

Bloom strength

Planet glow intensity

Section timing

DO NOT use Theatre.js for:
Free roam movement

Physics or gravity math

Continuous particle animation

Starfield drift

Performance Guidelines (Mandatory)
Initial render must be instant

Load only:

Starfield

Nebula background

Low-poly planets

Heavy effects enabled only during cinematic mode

Avoid large textures on first load

No blocking async calls before render

UX Goals
No loaders

No spinners

No “Please wait”

Immediate visual feedback

Calm, cinematic pacing

Must run smoothly on mid-range laptops

Tech Stack (Locked)
Next.js (App Router)

React (Client Components)

React Three Fiber

Three.js

Theatre.js (cinematics only)

@react-three/drei

Postprocessing (bloom, fog)

Development Phases
Phase 1 – Foundation
Canvas mount

Starfield

Nebula background

Free roam camera

One glowing planet

Phase 2 – Cinematic Entry
Gravity detection

Theatre.js camera sequence

Environment transition

Phase 3 – Section Worlds
Unique environment per planet

Section UI overlays

Phase 4 – Polish
Bloom tuning

Audio (optional)

Mobile fallback mode

Final Vision
This should feel like entering a universe, not opening a website.
The experience must feel smooth, calm, cinematic, and immediate.


If you want, next I can:
- Convert this into a **short AI prompt**
- Create a **task checklist**
- Add a **starter Next.js + R3F boilerplate**
- Review this for **performance pitfalls**

Just say the word 🚀