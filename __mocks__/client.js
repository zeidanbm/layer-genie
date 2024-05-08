const util = require("util");

global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");
const html = fs
  .readFileSync(path.join(__dirname, "..", "test", "data", "index.html"))
  .toString();
let dom = new JSDOM(html);
global.document = dom.window.document;
global.window = dom.window;

module.exports = dom;
