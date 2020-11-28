export enum Method {
  Get,
  Put,
  Post,
  Delete,
  Options,
  Head,
  Trace,
  Connect,
  Patch,
}

const MethodMap = [
  "GET",
  "PUT",
  "POST",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "TRACE",
  "CONNECT",
  "PATCH",
] as const;

export function method_to_str(method: Method): string {
  return MethodMap[method];
}

export function str_to_method(s: string): Method | void {
  if (s.length > 10) {
    return;
  }
  let result = MethodMap.indexOf(s as any);
  if (result !== -1) {
    return result;
  }
  result = MethodMap.indexOf(s.toUpperCase() as any);
  if (result !== -1) {
    return result;
  }
  return;
}
