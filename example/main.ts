import { createRouter, server } from "./deps.ts";
import { userRoutes } from "./UserRoutes.ts";

const options: Deno.ListenOptions = {
  hostname: "127.0.0.1",
  port: 8000,
};

server.listenAndServe(
  options,
  createRouter()
    .mount(userRoutes())
    .handler,
);

console.log(`http://${options.hostname}:${options.port}`);
