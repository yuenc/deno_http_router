import { Method } from "./src/method.ts";
import { createRoutes, Routes, URIRouter } from "./src/uri_router.ts";

function createRouter() {
  return new URIRouter();
}

//
//
export { createRouter, createRoutes, Method };
export type { Routes };
