import { Response, ServerRequest, Status, STATUS_TEXT } from "./deps.ts";
import { loggerError } from "./logger.ts";
import { Method } from "./method.ts";
import { URIMatcher, URIParams } from "./uri_matcher.ts";
//

export type MiddlewareNextFunc = () => void;
export type MiddlewareDoneFunc = () => void;

export type MiddlewareHandler = (
  request: ServerRequest,
  next: MiddlewareNextFunc,
  done: MiddlewareDoneFunc,
) => unknown;

export type RouteHandler = (
  request: ServerRequest,
  params: URIParams,
) => unknown;

export type RouteURI = string;

export type Routes = Map<RouteURI, RouteHandler>;

function HTTP_NOT_FOUND(request: ServerRequest) {
  request.respond({
    status: Status.NotFound,
    body: STATUS_TEXT.get(Status.NotFound),
  }).catch(loggerError);
}

export class URIRouter {
  routes: Routes = new Map();
  matcher: URIMatcher = new URIMatcher();
  middlewares: Set<MiddlewareHandler> = new Set();
  mount(this: this, routes: Routes): this {
    for (const [key, value] of routes) {
      if (this.routes.has(key)) {
        throw `route uri '${key}' has already been declared`;
      } else {
        this.routes.set(key, value);
        this.matcher.add(key);
      }
    }
    return this;
  }

  addMiddleware = (func: MiddlewareHandler) => {
    this.middlewares.add(func);
  };
  deleteMiddleware = (func: MiddlewareHandler) => {
    this.middlewares.delete(func);
  };

  handler = (request: ServerRequest) => {
    this.handleMiddlewares(request, () => {
      this.handleRoutes(request).catch((e) => {
        request.respond(e);
      });
    });
  };

  private handleMiddlewares(request: ServerRequest, next: () => unknown) {
    const values = this.middlewares.values();
    const middlewareDone = () => {};
    const middlewareNext = () => {
      const result = values.next();
      if (!result.done) {
        const handler: MiddlewareHandler = result.value;
        handler(request, middlewareNext, middlewareDone);
      } else {
        next();
      }
    };
    middlewareNext();
  }

  private async handleRoutes(request: ServerRequest): Promise<unknown> {
    const urlPath = request.url.split("?")[0] + "#" +
      request.method.toUpperCase();
    console.log("urlPath", urlPath);
    const uriNode = this.matcher.find(urlPath);
    if (uriNode && uriNode.uri) {
      const handler = this.routes.get(uriNode.uri);
      if (handler !== undefined) {
        return handler(request, uriNode.params);
      }
    }
    // not found
    HTTP_NOT_FOUND(request);
  }
}
