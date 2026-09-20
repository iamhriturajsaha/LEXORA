import fs from 'fs';

// Polyfill
if (typeof global !== 'undefined' && !(global as any).DOMMatrix) {
  (global as any).DOMMatrix = class DOMMatrix {
    a=1; b=0; c=0; d=1; e=0; f=0;
    constructor() {}
  };
}

async function run() {
  try {
    const pdfParse = require('pdf-parse');
    const buf = fs.readFileSync('package.json'); // Just to see if pdfParse loads without crashing
    console.log("pdfParse loaded successfully");
  } catch (e) {
    console.error(e);
  }
}
run();
