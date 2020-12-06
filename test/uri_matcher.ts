import { assert } from "./deps.ts";
import { URIMatcher } from "../src/uri_matcher.ts";

Deno.test("src/uri_matcher.ts test", () => {
  const mathcer = new URIMatcher();

  const urlList: string[] = [
    "/",
    "/foo",
    "/foo/bar",
    "/foo/bar/",

    "/#GET",
    "/foo#GET",
    "/foo/bar#GET",
    "/foo/bar/#GET",
  ];

  for (const url of urlList) {
    mathcer.add(url);
    assert(mathcer.find(url)?.uri === url);
  }

  mathcer.add("/foo/bar/:name");
  assert(mathcer.find("/foo/bar/cc")?.uri === "/foo/bar/:name");
});

export {};
