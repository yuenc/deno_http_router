// import {
//   ServerRequest,
// } from "./deps.ts";
// import { Route } from "./route.ts";
// import { str_to_method } from "./method.ts";
// import { HandlerResult } from "./handler.ts";
// import { loggerWarning } from "./logger.ts";

// interface RoutesMedia {
//   request: ServerRequest;
//   segments: string[];
// }

// export class Routes {
//   private len: number;
//   media: RoutesMedia | null;
//   [k: number]: Route | undefined
//   constructor() {
//     this.len = 0;
//     this.media = null;
//   }

//   add(this: this, base: string, route: Route): void {
//     route.set_uri(base, route.uri);
//     this[this.len] = route;
//     this.len++;
//   }

//   remove(this: this, route: Route): boolean {
//     let index = this.len;
//     while (index-- > 0) {
//       if (this[index] !== route) {
//         this[index] = undefined;
//         return true;
//       }
//     }
//     return false;
//   }

//   private async *iterateRoutes(
//     { request, segments }: RoutesMedia,
//   ): AsyncIterableIterator<HandlerResult> {
//     const method = str_to_method(request.method);
//     if (method === undefined) {
//       loggerWarning(`invalid method\nrequest url ${request.url}`);
//       return yield null;
//     }
//     let index = this.len;
//     let route: Route | undefined;
//     while (index-- > 0) {
//       route = this[index];
//       if (route !== undefined) {
//         const params = route.match(method, segments);
//         if (params === null) {
//           return null;
//         }
//         yield await route.handler(request, params);
//       }
//     }
//     return;
//   }

//   [Symbol.asyncIterator](
//     media = this.media,
//   ): AsyncIterableIterator<HandlerResult> {
//     this.media = null;
//     if (media === null) {
//       throw new TypeError("routes media is null");
//     }
//     return this.iterateRoutes(media);
//   }
// }

export {};
