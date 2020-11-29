import { Response, ServerRequest } from "./deps.ts";

type MHSyncResult = Response | null | undefined;
type MiddlewareHandler = (request: ServerRequest) => Promise<MHSyncResult>;

interface MiddlewareMedia {
  request: ServerRequest;
}

export class Middleware {
  private len: number;
  media: MiddlewareMedia | null;
  [k: number]: MiddlewareHandler | undefined
  constructor() {
    this.len = 0;
    this.media = null;
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
    { request }: MiddlewareMedia,
  ): AsyncIterableIterator<MHSyncResult> {
    let index = this.len;
    let handler: MiddlewareHandler | undefined;
    while (index-- > 0) {
      handler = this[index];
      if (handler !== undefined) {
        yield await handler(request);
      }
    }
  }

  [Symbol.asyncIterator](
    media = this.media,
  ): AsyncIterableIterator<MHSyncResult> {
    this.media = null;
    if (media === null) {
      throw new TypeError("current request is null");
    }
    return this.iterateMiddleWare(media);
  }
}
