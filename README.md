## deno http router

### usage
* append deps.ts file
```ts
export {
  createRouter,
  Route,
  routesBind,
} from "https://deno.land/x/deno_http_router/mod.ts";

export * as server from "https://deno.land/std@0.51.0/http/server.ts";
```

* append UserRoutes.ts file
```ts
import { Route, createRoutes } from "../deps.ts";
// path /user
export function userRoutes(): Route[] {
  return routes;
}

const {
  routes,
  addGetRoute,
} = createRoutes();

addGetRoute("user/:username/", (req, param) => {
  console.log("param :", param);
  req.respond({ body: "username is " + param.username });
});
```

* append main.ts file
```ts
import { createRouter, server } from "./deps.ts";
import { userRoutes } from "./UserRoutes.ts";

const options: Deno.ListenOptions = {
  hostname: "127.0.0.1",
  port: 8000,
};

server.listenAndServe(
  options,
  createRouter()
    .mount("", userRoutes())
    .handler,
);

console.log(`http://${options.hostname}:${options.port}`);
```

* run
```bash
deno run --allow-net ./main.ts
```
dev