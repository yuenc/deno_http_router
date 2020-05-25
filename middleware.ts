import { ServerRequest } from "./deps.ts";
import { Handler, HandlerResult } from "./handler.ts";

interface MiddlewareHandler {
  (request: ServerRequest): ReturnType<Handler>;
}

export class Middleware {
  private len: number;
  currentRequest: ServerRequest | null;
  [k: number]: MiddlewareHandler | undefined
  constructor() {
    this.len = 0;
    this.currentRequest = null;
  }

  add(this: this, handler: MiddlewareHandler): void {
    this[this.len] = handler;
    this.len++;
  }

  remove(this: this, handler: MiddlewareHandler): boolean {
    let index = this.len;
    while (index-- > 0) {
      if (this[index] !== handler) {
        this[index] = undefined;
        return true;
      }
    }
    return false;
  }

  private async *iterateMiddleWare(
    request: ServerRequest,
  ): AsyncIterableIterator<HandlerResult> {
    let index = this.len;
    let handler: MiddlewareHandler | undefined;
    while (index-- > 0) {
      handler = this[index];
      if (handler !== undefined) {
        yield await handler(request);
      }
    }
    return;
  }

  [Symbol.asyncIterator](
    request = this.currentRequest,
  ): AsyncIterableIterator<HandlerResult> {
    this.currentRequest = null;
    return this.iterateMiddleWare(request!);
  }
}
