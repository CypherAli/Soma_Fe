import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(readFileSync(resolve(root, '../soma_be/resources/cms/catalog.json'), 'utf8'));
const sources = new Map();
for (const doc of catalog.documents) {
  const match = doc.id.match(/^data:(.*?)#([^/]+)/);
  if (match) {
    const names = sources.get(match[1]) ?? new Set();
    names.add(match[2]); sources.set(match[1], names);
  }
}
const slash = (value) => value.replaceAll('\\', '/');
const parse = (file, text) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const allFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? allFiles(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
function insertImport(text, statement) {
  const directive = text.match(/^(?:\uFEFF)?["']use client["'];?\s*/);
  const index = directive?.[0].length ?? 0;
  return text.slice(0, index) + `\n${statement}\n` + text.slice(index);
}
function apply(text, edits) {
  for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
  return text;
}

let registered = 0;
for (const [name, keys] of sources) {
  const file = resolve(root, name);
  let text = readFileSync(file, 'utf8');
  const source = parse(file, text);
  const edits = [];
  for (const statement of source.statements) if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !keys.has(declaration.name.text) || !declaration.initializer) continue;
      const value = declaration.initializer;
      if (ts.isCallExpression(value) && value.expression.getText(source) === 'bindContentSource') continue;
      edits.push({ start: value.getStart(source), end: value.end, text: `bindContentSource(${JSON.stringify(`data:${name}#${declaration.name.text}`)}, ${value.getText(source)})` });
    }
  }
  if (edits.length) {
    text = insertImport(apply(text, edits), 'import { bindContentSource } from "@/lib/content/source";');
    writeFileSync(file, text); registered += edits.length;
  }
}

let consumers = 0;
for (const file of allFiles(resolve(root, 'src')).filter((path) => path.endsWith('.tsx') && !slash(path).includes('/content/'))) {
  let text = readFileSync(file, 'utf8');
  const name = slash(relative(root, file));
  text = text.replaceAll('<ContentSurface>', `<ContentSurface scope=${JSON.stringify(name)}>`);
  if (text.includes('cmsContent.resolve(cmsSource')) { writeFileSync(file, text); continue; }
  const source = parse(file, text);
  const available = new Set(sources.get(name) ?? []);
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings || !ts.isNamedImports(statement.importClause.namedBindings)) continue;
    const specifier = statement.moduleSpecifier.text;
    const target = specifier.startsWith('@/') ? resolve(root, 'src', specifier.slice(2)) : specifier.startsWith('.') ? resolve(dirname(file), specifier) : '';
    const actual = target && [target, `${target}.ts`, `${target}.tsx`, resolve(target, 'index.ts')].find((path) => existsSync(path) && /\.tsx?$/.test(path));
    const keys = actual && sources.get(slash(relative(root, actual)));
    if (!keys) continue;
    for (const binding of statement.importClause.namedBindings.elements) if (!binding.isTypeOnly && keys.has(binding.propertyName?.text ?? binding.name.text)) available.add(binding.name.text);
  }
  const edits = [];
  const aliases = new Set();
  const client = /^\s*["']use client["']/.test(text);
  for (const statement of source.statements) {
    if (!ts.isFunctionDeclaration(statement) || !statement.body || !statement.name || !/^[A-Z]/.test(statement.name.text)) continue;
    const locals = new Set();
    const namesIn = (binding) => { if (ts.isIdentifier(binding)) locals.add(binding.text); else for (const element of binding.elements ?? []) if (element.name) namesIn(element.name); };
    for (const parameter of statement.parameters) namesIn(parameter.name);
    for (const child of statement.body.statements) if (ts.isVariableStatement(child)) for (const declaration of child.declarationList.declarations) namesIn(declaration.name);
    const used = new Set();
    const visit = (node) => {
      if (ts.isIdentifier(node) && available.has(node.text) && !locals.has(node.text) && !(ts.isPropertyAccessExpression(node.parent) && node.parent.name === node) && !(ts.isPropertyAssignment(node.parent) && node.parent.name === node)) used.add(node.text);
      ts.forEachChild(node, visit);
    };
    visit(statement.body);
    if (!used.size) continue;
    for (const key of used) aliases.add(key);
    edits.push({ start: statement.body.getStart(source) + 1, end: statement.body.getStart(source) + 1, text: `\n  const cmsContent = ${client ? 'useContent()' : 'await getContent()'};\n${[...used].map((key) => `  const ${key} = cmsContent.resolve(cmsSource${key}());`).join('\n')}\n` });
    if (!client && !statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword)) edits.push({ start: statement.getStart(source) + statement.getText(source).indexOf('function'), end: statement.getStart(source) + statement.getText(source).indexOf('function'), text: 'async ' });
    consumers++;
  }
  if (edits.length) {
    text = apply(text, edits);
    text = insertImport(text, client ? 'import { useContent } from "@/components/content/ContentProvider";' : 'import { getContent } from "@/lib/content/server";');
    text += '\n' + [...aliases].map((key) => `function cmsSource${key}() { return ${key}; }`).join('\n') + '\n';
  }
  writeFileSync(file, text);
}
console.log(JSON.stringify({ registered, consumers }));
