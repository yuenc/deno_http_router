import { Method } from "./method.ts";
import { Handler } from "./handler.ts";
import { Route } from "./route.ts";
import { Router } from "./router.ts";

export {
  Route,
};

export function createRouter() {
  return new Router();
}

export function addRequestRoute(
  method: Method,
  path: string,
  handler: Handler,
) {
  return new Route(method, path, handler);
}

export const addGetRoute = addRequestRoute.bind(null, Method.Get);
export const addPostRoute = addRequestRoute.bind(null, Method.Post);
export const addPatchRoute = addRequestRoute.bind(null, Method.Patch);
export const addDeleteRoute = addRequestRoute.bind(null, Method.Delete);

export function routesBind(routes: Route[]) {
  function pushRequestRoute(
    method: Method,
    path: string,
    handler: Handler,
  ) {
    routes.push(new Route(method, path, handler));
  }

  return {
    addRequestRoute: pushRequestRoute,
    addGetRoute: pushRequestRoute.bind(null, Method.Get),
    addPostRoute: pushRequestRoute.bind(null, Method.Post),
    addPatchRoute: pushRequestRoute.bind(null, Method.Patch),
    addDeleteRoute: pushRequestRoute.bind(null, Method.Delete),
  };
}
