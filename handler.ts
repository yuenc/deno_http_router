import {
  ServerRequest,
  Response,
  Status,
  STATUS_TEXT,
} from "./deps.ts";
import { loggerError } from "./logger.ts";

type PromiseOr<T> = Promise<T> | T;

export interface Params {
  [k: string]: string;
}

interface HandlerResponse {
  // 请求响应 Response
  (request: ServerRequest, params: Params): PromiseOr<Response>;
}
interface HandlerVoid {
  // 把处理请求移交给自己
  (request: ServerRequest, params: Params): PromiseOr<void>;
}
interface HandlerNull {
  // 匹配下一个路由，如果有
  (request: ServerRequest, params: Params): PromiseOr<null>;
}

export type Handler = HandlerResponse | HandlerVoid | HandlerNull;

export const errorHandlers = {
  async notFound(request: ServerRequest) {
    try {
      await request.respond({
        status: Status.NotFound,
        body: STATUS_TEXT.get(Status.NotFound),
      });
    } catch (e) {
      loggerError(e);
    }
  },
  async internalServerError(request: ServerRequest, error: any) {
    try {
      await request.respond({
        status: Status.InternalServerError,
        body: `${STATUS_TEXT.get(Status.InternalServerError)}: \n${error}`,
      });
    } catch (e) {
      loggerError(e);
    }
  },
};
