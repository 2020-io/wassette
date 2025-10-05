console.log("wasm.js document", document);
wasm = document.querySelector("#wasm");
console.log("wasm", wasm);
if (wasm) {
  console.log("Setting wasm element");
  wasm.innerText = "WASM";
}

console.log("wasm.js window", window);
if (window && window.location)
  console.log("wasm.js window.location", window.location);

/* This is jiust for debugging
body = document.querySelector("body");
console.log("body", body);
if (body) {
  console.log("body innerText", body.innerText);
  console.log("body innerHTML", body.innerHTML);
}

iframe = document.querySelector("iframe");
console.assert(!iframe);
if (iframe) {
  current_window = iframe.currentWindow;
  console.log("iframe currentWindow", current_window);
  if (current_window) {
    iframe_document = current_window.document;
    console.log("iframe document", iframe_document);
  }
}
*/
