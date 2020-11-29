import { Response, ServerRequest, Status, STATUS_TEXT } from "./deps.ts";
import { loggerError } from "./logger.ts";
import { Method } from "./method.ts";
import { Middleware } from "./middleware.ts";
import { URIMatcher, URIParams } from "./uri_matcher.ts";
//

type Handler = (request: ServerRequest, params: URIParams) => unknown;

type RouteUri = string;

export type Routes = Map<RouteUri, Handler>;

function HTTP_NOT_FOUND(request: ServerRequest) {
  request.respond({
    status: Status.NotFound,
    body: STATUS_TEXT.get(Status.NotFound),
  }).catch(loggerError);
}

export function createRoutes() {
  const routes: Map<RouteUri, Handler> = new Map();
  const add = (method: Method, path: string, handler: Handler) => {
    routes.set(`${path}#${method}`, handler);
  };
  const addGet = (path: string, handler: Handler) => {
    routes.set(`${path}#${Method.Get}`, handler);
  };
  const addPost = (path: string, handler: Handler) => {
    routes.set(`${path}#${Method.Post}`, handler);
  };
  const addPut = (path: string, handler: Handler) => {
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

async function tryRespond(request: ServerRequest, response: Response) {
  try {
    await request.respond(response);
  } catch (e) {
    loggerError(e);
  }
}

export class URIRouter {
  routes: Routes = new Map();
  matcher: URIMatcher = new URIMatcher();
  middleware: Middleware = new Middleware();
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

  handler = (request: ServerRequest) => {
    this.requestHandler(request).catch((e) => {
      request.respond(e);
    });
  };

  addMiddleware = this.middleware.add.bind(this.middleware);

  private async requestHandler(request: ServerRequest): Promise<unknown> {
    // middleware
    this.middleware.media = { request };
    for await (const result of this.middleware) {
      if (result === undefined) return;
      if (result !== null) {
        tryRespond(request, result);
        return;
      }
    }
    // routes
    const urlPath = request.url.split("?")[0];
    const uriNode = this.matcher.find(urlPath);
    if (uriNode !== null) {
      const handler = this.routes.get(uriNode.uri!)!;
      return handler(request, uriNode.params!);
    }
    // not found
    HTTP_NOT_FOUND(request);
  }
}
