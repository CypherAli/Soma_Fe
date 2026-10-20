/** Rebuild the CMS contract from real FE sources. Never evaluates source code. */
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cache = new Map();
const active = new Set();
const documents = [];
const instrument = process.argv.includes('--instrument');
const check = process.argv.includes('--check');
const slash = (path) => path.replaceAll('\\', '/');
function files(dir) { return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(resolve(dir, entry.name)) : [resolve(dir, entry.name)]); }
function moduleFile(path) { return [path, `${path}.ts`, `${path}.tsx`, `${path}.json`, resolve(path, 'index.ts')].find((candidate) => existsSync(candidate) && extname(candidate)); }
function sourceFile(file) {
  if (cache.has(file)) return cache.get(file);
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const declarations = new Map();
  const imports = new Map();
  for (const statement of source.statements) {
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name) && declaration.initializer) declarations.set(declaration.name.text, declaration.initializer);
    if (ts.isImportDeclaration(statement) && statement.importClause && ts.isStringLiteral(statement.moduleSpecifier)) {
      const specifier = statement.moduleSpecifier.text;
      const target = specifier.startsWith('@/') ? moduleFile(resolve(root, 'src', specifier.slice(2))) : specifier.startsWith('.') ? moduleFile(resolve(dirname(file), specifier)) : null;
      if (!target) continue;
      const bindings = statement.importClause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) for (const binding of bindings.elements) if (!binding.isTypeOnly) imports.set(binding.name.text, { target, name: binding.propertyName?.text ?? binding.name.text });
      if (statement.importClause.name) imports.set(statement.importClause.name.text, { target, name: 'default' });
    }
  }
  const parsed = { source, declarations, imports };
  cache.set(file, parsed);
  return parsed;
}
const unknown = Symbol('dynamic');
function evaluate(node, file, depth = 0) {
  if (!node || depth > 60) return unknown;
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'bindContentSource') return evaluate(node.arguments[1], file, depth + 1);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return evaluate(node.expression, file, depth + 1);
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) { const n = evaluate(node.operand, file, depth + 1); return typeof n === 'number' ? -n : unknown; }
  if (ts.isIdentifier(node)) {
    const key = `${file}#${node.text}`;
    if (active.has(key)) return unknown;
    active.add(key);
    const parsed = sourceFile(file);
    let value = unknown;
    if (parsed.declarations.has(node.text)) value = evaluate(parsed.declarations.get(node.text), file, depth + 1);
    else if (parsed.imports.has(node.text)) {
      const item = parsed.imports.get(node.text);
      if (item.target.endsWith('.json')) value = JSON.parse(readFileSync(item.target, 'utf8'));
      else value = evaluate(sourceFile(item.target).declarations.get(item.name), item.target, depth + 1);
    }
    active.delete(key);
    return value;
  }
  if (ts.isArrayLiteralExpression(node)) {
    const result = [];
    for (const element of node.elements) {
      const value = evaluate(ts.isSpreadElement(element) ? element.expression : element, file, depth + 1);
      if (value === unknown) return unknown;
      if (ts.isSpreadElement(element)) { if (!Array.isArray(value)) return unknown; result.push(...value); } else result.push(value);
    }
    return result;
  }
  if (ts.isObjectLiteralExpression(node)) {
    const result = {};
    for (const property of node.properties) {
      if (ts.isSpreadAssignment(property)) {
        const value = evaluate(property.expression, file, depth + 1);
        if (!value || typeof value !== 'object' || value === unknown) return unknown;
        Object.assign(result, value);
      } else if (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) {
        if (ts.isComputedPropertyName(property.name)) return unknown;
        const key = property.name.text;
        if (['__proto__', 'constructor', 'prototype'].includes(key)) return unknown;
        const value = evaluate(ts.isPropertyAssignment(property) ? property.initializer : property.name, file, depth + 1);
        if (value === unknown) return unknown;
        result[key] = value;
      } else return unknown;
    }
    return result;
  }
  return unknown;
}
function category(path) {
  if (/humanAtlas\/scenes|lib\/scenes|sceneModules|controlModels|layeredModels|vet\/models/.test(path)) return 'models';
  if (/quiz|examBank|drLam|atlasBank|schoolBank/i.test(path)) return 'quizzes';
  if (/knowledge|learning|generalFacts|vet\/facts|diseases|partNames/i.test(path)) return 'explanations';
  return 'interface';
}
function displayTitle(value, fallback) { return value?.title?.vi ?? value?.name?.vi ?? value?.label?.vi ?? value?.nameVi ?? value?.stem?.slice(0, 90) ?? ({ homeContent: 'Trang chủ, điều hướng & chân trang', systemGroups: 'Danh mục hệ cơ quan' }[fallback] ?? fallback); }
const relevant = (value) => /"(?:vi|en|zh|title|label|intro|description|note|explanation|stem|modelFile|promptVi)"/.test(JSON.stringify(value));
function add(id, title, source, value, group = category(source)) {
  if (source.includes('humanAtlas/scenes/') && value?.slug && Array.isArray(value.groups)) value = { ...value, replacement: { modelFile: '', hotspots: [] } };
  documents.push({ id, title, source, category: group, payload: { value } });
}
function textId(value) { let hash = 2166136261; for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619); return `t${(hash >>> 0).toString(36)}_${value.length}`; }
let surfaces = 0;
for (const file of files(resolve(root, 'src')).filter((path) => /\.(ts|tsx)$/.test(path) && !/\.test\.|\/content\/|\\content\\/.test(path))) {
  const name = slash(relative(root, file));
  if (name.startsWith('src/app/api/') || name.startsWith('src/store/') || name.includes('/bo-model-preview/')) continue;
  const parsed = sourceFile(file);
  if (/^src\/(lib|components)\//.test(name)) {
    for (const [key, node] of parsed.declarations) {
      const value = evaluate(node, file);
      if (value === unknown || !value || typeof value !== 'object' || !relevant(value)) continue;
      if (/sceneModules|humanAtlas\/scenes\/index/.test(name)) continue; // source scenes are managed individually
      if (Array.isArray(value) && value.length > 40 && value.every((item) => item && typeof item === 'object')) {
        value.forEach((item, index) => add(`data:${name}#${key}/${index}`, displayTitle(item, `${key} · ${index + 1}`), name, item));
      } else if (!Array.isArray(value) && Object.values(value).length > 1 && Object.values(value).every((item) => item && typeof item === 'object' && 'slug' in item)) {
        for (const [slug, scene] of Object.entries(value)) add(`data:${name}#${key}/${slug}`, displayTitle(scene, slug), name, scene);
      } else add(`data:${name}#${key}`, displayTitle(value, key), name, value);
    }
  }
  const texts = {};
  const edits = [];
  const collect = (node) => {
    if (ts.isJsxText(node)) {
      const text = node.text.split(/\r?\n/).map((line, index, lines) => index === 0 ? line.trimEnd() : index === lines.length - 1 ? line.trimStart() : line.trim()).filter(Boolean).join(' ');
      if (text.trim() && /\p{L}/u.test(text)) texts[textId(text)] = text;
    } else if (ts.isTemplateExpression(node)) {
      const pattern = node.head.text + node.templateSpans.map((span, index) => `{${index}}${span.literal.text}`).join('');
      if (/[\u00c0-\u024f\u1e00-\u1eff\u3400-\u9fff]/.test(pattern) && !/https?:|^\//.test(pattern)) texts[textId(pattern)] = pattern;
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const parent = node.parent;
      const attr = ts.isJsxAttribute(parent) ? parent.name.getText(parsed.source) : '';
      const visibleAttr = ['title', 'alt', 'placeholder', 'aria-label', 'label', 'description'].includes(attr);
      const jsxValue = ts.isJsxExpression(parent) || (ts.isConditionalExpression(parent) && (parent.whenTrue === node || parent.whenFalse === node));
      let localized = false;
      for (let ancestor = parent; ancestor && !ts.isSourceFile(ancestor); ancestor = ancestor.parent) {
        if (ts.isPropertyAssignment(ancestor) && /^(?:vi|en|zh|label|title|description|note|explanation|placeholder|alt)$/.test(ancestor.name.getText(parsed.source).replace(/["']/g, ''))) { localized = true; break; }
      }
      const hasNonAsciiText = /[\u00c0-\u024f\u1e00-\u1eff\u3400-\u9fff]/.test(node.text);
      if ((visibleAttr || hasNonAsciiText || localized || jsxValue) && !ts.isImportDeclaration(parent) && node.text.length > 1 && node.text.length < 10000 && !/[{}<>]|^\s*(?:https?:|\/|[.#])/.test(node.text)) texts[textId(node.text)] = node.text;
    }
    // Source files retain their React boundaries; this adds no DOM node.
    if (instrument && name.endsWith('.tsx') && !name.endsWith('/layout.tsx') && !name.includes('/Icons') && !name.includes('/icons') && ts.isReturnStatement(node) && node.expression) {
      let expression = node.expression;
      while (ts.isParenthesizedExpression(expression)) expression = expression.expression;
      if ((ts.isJsxElement(expression) || ts.isJsxSelfClosingElement(expression) || ts.isJsxFragment(expression)) && !/<ContentSurface(?:\s|>)/.test(node.expression.getText(parsed.source))) {
        edits.push({ start: node.expression.getStart(parsed.source), end: node.expression.end, text: `<ContentSurface scope=${JSON.stringify(name)}>{${node.expression.getText(parsed.source)}}</ContentSurface>` });
      }
    }
    ts.forEachChild(node, collect);
  };
  collect(parsed.source);
  if (Object.keys(texts).length) documents.push({ id: `copy:${name}`, title: `Chữ giao diện · ${name.split('/').at(-1).replace(/\.tsx?$/, '')}`, source: name, category: 'interface', payload: { texts } });
  if (edits.length) {
    let text = readFileSync(file, 'utf8');
    // Inner returns can overlap outer JSX; only outermost edit is needed here.
    const outer = edits.filter((edit) => !edits.some((other) => other !== edit && other.start <= edit.start && other.end >= edit.end));
    for (const edit of outer.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end);
    const directive = text.match(/^(?:\uFEFF)?["']use client["'];?\s*/);
    const position = directive?.[0].length ?? 0;
    text = text.slice(0, position) + '\nimport { ContentSurface } from "@/components/content/ContentProvider";\n' + text.slice(position);
    writeFileSync(file, text);
    surfaces += outer.length;
  }
}
const css = readFileSync(resolve(root, 'src/app/home.css'), 'utf8');
const themeNames = ['--paper', '--paper-2', '--paper-3', '--ink-e', '--sub-e', '--line-e', '--acc', '--acc-d'];
const appearance = Object.fromEntries(themeNames.map((name) => [name, [...css.matchAll(new RegExp(`${name}\\s*:\\s*(#[a-fA-F0-9]{3,8})\\s*;`, 'g'))].at(-1)?.[1]]).filter(([, value]) => value));
add('site:appearance', 'Màu giao diện website', 'src/app/home.css', appearance, 'interface');
for (const locale of ['vi', 'en', 'zh']) add(`messages:${locale}`, `Từ điển giao diện · ${locale}`, `messages/${locale}.json`, JSON.parse(readFileSync(resolve(root, `messages/${locale}.json`), 'utf8')), 'interface');
for (const file of files(resolve(root, 'public/kb')).filter((path) => path.endsWith('.json') && !/dimensions|report|index/.test(path))) {
  const name = slash(relative(resolve(root, 'public'), file));
  const payload = JSON.parse(readFileSync(file, 'utf8'));
  const questions = Array.isArray(payload) ? payload : payload.questions;
  if (Array.isArray(questions)) questions.forEach((question, i) => add(`json:/${name}#${i}`, displayTitle(question, `${name.split('/').at(-1)} · ${i + 1}`), `/${name}`, question, 'quizzes'));
}
const meshes = {};
for (const file of files(resolve(root, 'public/models')).filter((path) => path.endsWith('.glb'))) {
  const data = readFileSync(file);
  try { const json = JSON.parse(data.toString('utf8', 20, 20 + data.readUInt32LE(12))); meshes[`/${slash(relative(resolve(root, 'public'), file))}`] = [...new Set((json.nodes ?? []).map((node) => node.name).filter(Boolean))]; } catch { throw new Error(`Invalid GLB: ${file}`); }
}
const atlas = JSON.parse(readFileSync(resolve(root, 'public/human-atlas/atlas.json'), 'utf8'));
const parts = Array.isArray(atlas.parts) ? atlas.parts.map((part) => part.id) : Object.keys(atlas.parts ?? {});
for (const part of atlas.parts ?? []) add(`atlas:${part.id}`, part.name, '/human-atlas/atlas.json', { id: part.id, name: part.name }, 'models');
const learningFile = resolve(root, 'src/lib/humanAtlas/data/learning.generated.json');
if (existsSync(learningFile)) {
  const learning = JSON.parse(readFileSync(learningFile, 'utf8'));
  for (const [id, entry] of Object.entries(learning.entries ?? {})) add(`learning:${id}`, displayTitle(entry, id), 'src/lib/humanAtlas/data/learning.generated.json', entry, 'explanations');
  for (const [id, topic] of Object.entries(learning.topics ?? {})) add(`topic:${id}`, displayTitle(topic, id), 'src/lib/humanAtlas/data/learning.generated.json', topic, 'explanations');
}
const output = resolve(root, '../soma_be/resources/cms/catalog.json');
const studySources = {
  atlas: JSON.parse(readFileSync(resolve(root, 'public/atlas/index.json'), 'utf8')).shots.filter(shot => shot.fileQuiz && shot.hasMarker).map(({ page, hotspotKey }) => ({ page, hotspotKey })),
  schools: JSON.parse(readFileSync(resolve(root, 'public/kb/schools/index.json'), 'utf8')).schools.map(({ id, file }) => ({ id, file })),
};
documents.sort((a, b) => a.id.localeCompare(b.id));
const contractHash = createHash('sha256').update(JSON.stringify({ documents, meshes, atlasParts: parts, studySources })).digest('hex');
const result = JSON.stringify({ schemaVersion: 2, contractHash, documents, meshes, atlasParts: parts, studySources }, null, 2) + '\n';
const contractPath = resolve(root, 'src/lib/content/contract.generated.json');
const contract = JSON.stringify({ schemaVersion: 2, contractHash }, null, 2) + '\n';
const sameGeneratedText = (file, expected) => existsSync(file) && readFileSync(file, 'utf8').replace(/\r\n/g, '\n') === expected;
if (check) { if (!sameGeneratedText(output, result)) throw new Error('CMS catalog is stale. Run npm run cms:sync.'); }
else { mkdirSync(dirname(output), { recursive: true }); writeFileSync(output, result); writeFileSync(contractPath, contract); }
if (check && !sameGeneratedText(contractPath, contract)) throw new Error('FE content contract is stale. Run npm run cms:sync.');
console.log(JSON.stringify({ documents: documents.length, categories: documents.reduce((counts, doc) => ({ ...counts, [doc.category]: (counts[doc.category] ?? 0) + 1 }), {}), models: Object.keys(meshes).length, atlasParts: parts.length, surfaces }));
