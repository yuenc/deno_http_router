import { Route, createRoutes } from "./deps.ts";
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
