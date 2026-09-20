import { extractText, getDocumentProxy } from 'unpdf';
import * as fs from 'fs';

async function run() {
  try {
    // We don't have a PDF, let's just make sure it loads
    console.log("unpdf loaded");
  } catch(e) {
    console.error(e);
  }
}
run();
