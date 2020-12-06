import { Method } from "./src/method.ts";
import { RouteHandler, Routes, RouteURI, URIRouter } from "./src/uri_router.ts";

function createRouter() {
  return new URIRouter();
}

export function createRoutes() {
  const routes: Map<RouteURI, RouteHandler> = new Map();
  const add = (method: Method, path: string, handler: RouteHandler) => {
    routes.set(`${path}#${method}`, handler);
  };
  const addGet = (path: string, handler: RouteHandler) => {
    routes.set(`${path}#${Method.Get}`, handler);
  };
  const addPost = (path: string, handler: RouteHandler) => {
    routes.set(`${path}#${Method.Post}`, handler);
  };
  const addPut = (path: string, handler: RouteHandler) => {
    routes.set(`${path}#${Method.Put}`, handler);
  };
  return {
    routes,
    add,
    addGet,
    addPost,
    addPut,
  };
}

//
//
export { createRouter, Method };
export type { Routes };
