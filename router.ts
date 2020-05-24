import { Route, normalize_uri } from "./route.ts";
import { ServerRequest, Response } from "./deps.ts";
import { Handler, errorHandlers, Params } from "./handler.ts";
import { loggerError } from "./logger.ts";
import { str_to_method, Method } from "./method.ts";
//

async function match_route(
  routes: Route[],
  method: Method,
  segments: string[],
): Promise<
  {
    handler: Handler;
    params: Params;
    index: number;
  } | null
> {
  for (let index = 0; index < routes.length; index++) {
    const route = routes[index];
    const params = route.match(method, segments);
    if (params !== null) {
      return {
        handler: route.handler,
        params,
        index,
      };
    }
  }
  return null;
}

interface MiddlewareHandler {
  (request: ServerRequest): ReturnType<Handler>;
}

export class Router {
  private mwHandlers: MiddlewareHandler[] = [];
  [k: number]: Route[] | undefined
  mount(this: this, base: string, routes: Route[]): this {
    for (const route of routes) {
      route.set_uri(base, route.uri);
      this.routes(route.segments.length).push(route);
    }
    return this;
  }

  middleware(this: this, handler: MiddlewareHandler): this {
    this.mwHandlers.push(handler);
    return this;
  }

  handler = this.asyncHandler.bind(this);

  private async asyncHandler(request: ServerRequest): Promise<void> {
    const mwResponseOrVoid = await this.mwHandlersLoop(request);
    if (mwResponseOrVoid !== undefined) {
      try {
        request.respond(mwResponseOrVoid);
      } catch (e) {
        loggerError(e);
      }
      return;
    }
    const routeResponseOrVoid = await this.routesLoop(request);
    if (routeResponseOrVoid !== undefined) {
      try {
        request.respond(routeResponseOrVoid);
      } catch (e) {
        loggerError(e);
      }
      return;
    }
  }

  private async routesLoop(request: ServerRequest): Promise<Response | void> {
    const uri = normalize_uri(request.url.split("?")[0]);
    const method = str_to_method(request.method);
    const segments = uri.split("/");
    const routes = this[segments.length];
    if (routes === undefined || method === undefined) {
      errorHandlers.notFound(request);
      return;
    }
    while (true) {
      if (routes.length === 0) {
        break;
      }
      const matched = await match_route(
        routes,
        method,
        segments,
      );
      if (matched === null) {
        break;
      }
      try {
        const result = await matched.handler(request, matched.params);
        if (result !== null) {
          return result;
        }
        routes.splice(matched.index, 1);
      } catch (e) {
        loggerError(e);
      }
    }
    errorHandlers.notFound(request);
  }

  private async mwHandlersLoop(
    request: ServerRequest,
  ): Promise<Response | void> {
    for (const mwHandler of this.mwHandlers) {
      const responseOrVoid = await mwHandler(request);
      if (responseOrVoid !== null) {
        return responseOrVoid;
      }
    }
    return;
  }

  private routes(index: number): Route[] {
    if (this[index] === undefined) {
      this[index] = [];
    }
    return this[index]!;
  }
}
