import { log } from "./deps.ts";

// get core logger
const logger = log.getLogger("http_router");

export const loggerDebug = (msg: string, ...args: unknown[]): string =>
  logger.debug(msg, ...args);
export const loggerInfo = (msg: string, ...args: unknown[]): string =>
  logger.info(msg, ...args);
export const loggerWarning = (msg: string, ...args: unknown[]): string =>
  logger.warning(msg, ...args);
export const loggerError = (msg: string, ...args: unknown[]): string =>
  logger.error(msg, ...args);
export const loggerCritical = (msg: string, ...args: unknown[]): string =>
  logger.critical(msg, ...args);
