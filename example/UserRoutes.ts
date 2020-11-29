import { createRoutes, Routes } from "./deps.ts";
// path /user
export function userRoutes(): Routes {
  return routes;
}

const {
  routes,
  add,
  addGet,
} = createRoutes();

addGet("user/:username/", (req, param) => {
  console.log("param :", param);
  req.respond({ body: "username is " + param.username });
});
