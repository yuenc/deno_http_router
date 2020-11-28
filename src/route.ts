import { Method } from "./method.ts";
import { Handler, Params } from "./handler.ts";

export function normalize_uri(uri: string) {
  const segments = [""];
  for (const segment of uri.split("/")) {
    if (segment !== "") {
      segments.push(segment);
    }
  }
  return segments.join("/");
}

export class Route {
  method: Method;
  handler: Handler;
  base: string;
  uri: string;
  segments: string[];

  constructor(method: Method, path: string, handler: Handler) {
    this.base = "";
    this.handler = handler;
    this.method = method;
    this.uri = normalize_uri(path);
    this.segments = this.uri.split("/");
  }

  set_uri(this: this, base: string, path: string) {
    this.base = normalize_uri(base);
    this.uri = normalize_uri(`${base}/${path}`);
    this.segments = this.uri.split("/");
    console.log(this.uri);
  }

  match(method: Method, segments: string[]): Params | null {
    if (method !== this.method) {
      return null;
    }
    if (segments.length !== this.segments.length) {
      return null;
    }
    const params: Params = {};
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (segment[0] === ":") {
        params[segment.substring(1)] = segments[i];
      } else if (segment !== segments[i]) {
        return null;
      }
    }
    return params;
  }

  match_by_path(method: Method, path: string): Params | null {
    const uri = normalize_uri(path);
    const segments = uri.split("/");
    return this.match(method, segments);
  }
}
