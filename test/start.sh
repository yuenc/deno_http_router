#!/bin/sh

testDir=$(cd `dirname $0`; pwd)

deno test --allow-net $testDir/main.ts
