"use client";

import { getProject, type IProject } from "@theatre/core";

const project: IProject = getProject("SpacePortfolio");

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  import("@theatre/studio").then((studio) => {
    studio.default.initialize();
  });
}

export { project };
