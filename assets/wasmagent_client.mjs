#!/usr/bin/env node

import wasmagent_utils from "./wasmagent_utils.mjs";
import util from "util";
import http from "http";

let retval = 0;

// pretty print an obj using util.inspect()
function pp(obj, 
  opts={ colors: true, compact: true, sorted: true, depth: 0, showProxy: true, showHidden: true, getters: true }) {
  console.log(util.inspect(obj, opts));
}

console.log("here");
pp(process.env);
debugger;
process.exit(retval);
