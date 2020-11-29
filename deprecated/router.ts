// import { Route, normalize_uri } from "./route.ts";
// import { ServerRequest, Response } from "./deps.ts";
// import { errorHandlers } from "./handler.ts";
// import { loggerError } from "./logger.ts";
// import { Middleware } from "./middleware.ts";
// import { Routes } from "./routes.ts";
// //

// async function tryRespond(request: ServerRequest, response: Response) {
//   try {
//     await request.respond(response);
//   } catch (e) {
//     loggerError(e);
//   }
// }

// export class Router {
//   middleware: Middleware = new Middleware();
//   [k: number]: Routes | undefined
//   constructor() {
//     this.middleware = new Middleware();
//   }
//   mount(this: this, base: string, routes: Route[]): this {
//     let index = -1;
//     for (const route of routes) {
//       index = route.segments.length;
//       const routes = this[index] = (this[index] ?? new Routes());
//       routes.add(base, route);
//     }
//     return this;
//   }

//   handler = (request: ServerRequest) => {
//     this.asyncHandler(request).catch(e => {
//       request.respond(e);
//     });
//   }

//   addMiddleware = this.middleware.add.bind(this.middleware);

//   private async asyncHandler(request: ServerRequest): Promise<void> {
//     // middleware
//     this.middleware.media = { request };
//     for await (const result of this.middleware) {
//       if (result === undefined) return;
//       if (result !== null) {
//         tryRespond(request, result);
//         return;
//       }
//     }
//     // routes
//     const uri = normalize_uri(request.url.split("?")[0]);
//     const segments = uri.split("/");
//     const routes = this[segments.length];
//     if (routes === undefined) {
//       errorHandlers.notFound(request);
//       return;
//     }
//     routes.media = { request, segments };
//     for await (const result of routes) {
//       if (result === undefined) return;
//       if (result !== null) {
//         tryRespond(request, result);
//         return;
//       }
//     }
//     // not found
//     errorHandlers.notFound(request);
//   }
// }

export {};
