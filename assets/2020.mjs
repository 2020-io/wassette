#!/usr/bin/env node

import { inspect } from "util";
//const util = await import("util");

const inspect_opts = { depth: null, colors: true };

function pp(obj, opts=inspect_opts) {
  console.log(inspect(obj, opts));
}

console.log("2020 enter");
pp(process.env);
debugger;
console.log("2020 exit");
