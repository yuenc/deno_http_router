#!/bin/sh

exampleDir=$(cd `dirname $0`; pwd)

deno run --allow-net $exampleDir/main.ts
