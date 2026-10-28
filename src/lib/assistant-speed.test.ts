import assert from 'node:assert/strict';
import { after, mock, test } from 'node:test';
import { retrieveForQuestion } from './assistant';

const previous = { AI_API_KEY: process.env.AI_API_KEY, AI_PROVIDER: process.env.AI_PROVIDER, AI_BASE_URL: process.env.AI_BASE_URL };
Object.assign(process.env, { AI_API_KEY: 'test-only-never-transmitted', AI_PROVIDER: 'openai', AI_BASE_URL: 'https://fixture.invalid' });
let llmCalls = 0;
let intent = 'lookup';
mock.method(globalThis, 'fetch', async (url: string | URL | Request) => {
  if (String(url).startsWith('https://fixture.invalid/')) {
    llmCalls++;
    return Response.json({ choices: [{ message: { content: JSON.stringify({ intent, queries: ['Gan nằm ở đâu?'] }) } }] });
  }
  return Response.json([]);
});
after(() => { mock.restoreAll(); for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });

test('clear Vietnamese and English named questions skip the classifier while keeping grounded sources', async () => {
  for (const [question, locale] of [['Tim có mấy buồng?', 'vi'], ['How many bones are in the human body?', 'en'], ['Gan nằm ở đâu?', 'vi']] as const) {
    llmCalls = 0;
    const result = await retrieveForQuestion(question, locale);
    assert.equal(result.path, 'direct', question);
    assert.equal(result.intent, 'lookup');
    assert(result.sources.some(source => source.kind === 'anatomy' || source.kind === 'overview'));
    assert.equal(llmCalls, 0, 'A clear question needs only the downstream answer call, not an AI classifier');
  }
});
test('ambiguous language still goes through query rewriting', async () => {
  llmCalls = 0; intent = 'lookup';
  const result = await retrieveForQuestion('Cái này hoạt động thế nào?', 'vi');
  assert.equal(result.path, 'rewritten');
  assert.equal(llmCalls, 1);
  assert(result.sources.some(source => source.title === 'Gan'));
});
test('a named English question without precise local sources retains the rewrite step', async () => {
  llmCalls = 0; intent = 'lookup';
  const result = await retrieveForQuestion('Where is the liver?', 'en');
  assert.equal(result.path, 'rewritten');
  assert.equal(llmCalls, 1);
});
test('a medical noun inside an unrelated task cannot bypass intent checks', async () => {
  llmCalls = 0; intent = 'offtopic';
  const result = await retrieveForQuestion('Viết một bài thơ tim là gì', 'vi');
  assert.equal(result.path, 'rewritten');
  assert.equal(result.intent, 'offtopic');
  assert.equal(result.sources.length, 0);
  assert.equal(llmCalls, 1);
});
