// Narrow, reproducible mitigations for advisories without an upstream release.
// npm audit will continue to report the original package versions.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const packages = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8')).packages;
let changed = 0;
function patch(file, before, after, marker) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (text.includes(marker)) return;
  if (!text.includes(before)) throw new Error(`Security patch no longer matches ${file}; review the upstream fix before changing this guard.`);
  fs.writeFileSync(file, text.replace(before, after));
  changed++;
}
for (const key of Object.keys(packages)) {
  const folder = path.join(root, key);
  if (!key || !fs.existsSync(path.join(folder, 'package.json'))) continue;
  const { name, version } = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
  if (name === 'braces' && version === '3.0.3') {
    // GHSA-vfj7-8cjw-p6xm: reject deep input before AST parsing and recursive walkers.
    patch(path.join(folder, 'lib/parse.js'), '      depth++;', "      depth++;\n      // SOMA security: bound brace nesting before recursive walkers.\n      if (depth > 64) throw new RangeError('Brace nesting exceeds 64 levels');", 'SOMA security: bound brace');
    const helper = `'use strict';\nmodule.exports = ast => {\n  const stack = [[ast, 0]], seen = new Set();\n  while (stack.length) {\n    const [node, depth] = stack.pop();\n    if (!node || typeof node !== 'object') continue;\n    if (depth > 128 || seen.has(node) || seen.size > 65536) throw new RangeError('Brace AST exceeds safe depth or size');\n    seen.add(node);\n    if (Array.isArray(node.nodes)) for (const child of node.nodes) stack.push([child, depth + 1]);\n  }\n};\n`;
    fs.writeFileSync(path.join(folder, 'lib/soma-depth.js'), helper);
    for (const [file, declaration] of [['compile.js', 'const compile = (ast, options = {}) => {'], ['expand.js', 'const expand = (ast, options = {}) => {'], ['stringify.js', 'module.exports = (ast, options = {}) => {']]) {
      patch(path.join(folder, 'lib', file), declaration, declaration + "\n  // SOMA security: validate direct AST callers too.\n  require('./soma-depth')(ast);", 'SOMA security: validate direct AST');
    }
  }
  if (name === 'node-forge' && version === '1.4.0') {
    // GHSA-86w9-cpqp-85rv: the nested DigestAlgorithm sequence must contain no extra elements.
    patch(path.join(folder, 'lib/rsa.js'), 'obj.value.length !== 2) {', "obj.value.length !== 2 ||\n            // SOMA security: require the exact captured DigestAlgorithm fields.\n            obj.value[0].value.length !== (Object.prototype.hasOwnProperty.call(capture, 'parameters') ? 2 : 1)) {", 'SOMA security: require the exact');
  }
  if (name === 'decode-uri-component' && version === '0.2.2') {
    // GHSA-vcc3-ghjq-m6fr: bound the recursive fallback across an entire decode call.
    const file = path.join(folder, 'index.js');
    patch(file, "var token = '%[a-f0-9]{2}';", "// SOMA security: bounded fallback work, preserving undecodable text.\nvar remainingWork = 0;\nvar token = '%[a-f0-9]{2}';", 'SOMA security: bounded fallback');
    patch(file, 'function decodeComponents(components, split) {', "function decodeComponents(components, split) {\n\t// SOMA security: no unbounded recursive decoding.\n\tif (--remainingWork < 0 || components.length > 128) return components;", 'SOMA security: no unbounded');
    patch(file, 'module.exports = function (encodedURI) {', "module.exports = function (encodedURI) {\n\t// SOMA security: reset the synchronous per-call budget.\n\tremainingWork = 4096;", 'SOMA security: reset');
    patch(file, 'var tokens = input.match(singleMatcher) || [];', "var tokens = input.match(singleMatcher) || [];\n\t\t// SOMA security: preserve long malformed sequences without quadratic retries.\n\t\tif (tokens.length > 128) return input;", 'SOMA security: preserve long malformed');
  }
  if (name === 'sprintf-js' && ['1.0.3', '1.1.3'].includes(version)) {
    // GHSA-hp3w-g68c-fv3c: reject unbounded width/precision, including direct format callers.
    const file = path.join(folder, 'src/sprintf.js');
    const before = 'sprintf.format = function(parse_tree, argv) {';
    if (version === '1.0.3') patch(file, before, before + "\n        // SOMA security: cap allocation from formatting directives.\n        parse_tree.forEach(function(node) { if (Array.isArray(node) && (+node[6] > 10000 || +node[7] > 10000)) throw new RangeError('Format width or precision exceeds 10000'); });", 'SOMA security: cap allocation');
    else throw new Error('Review sprintf-js 1.1.3 formatting entry point before applying its precision guard.');
  }
}
console.log(`Dependency security guards applied: ${changed} files updated.`);
