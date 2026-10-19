import assert from 'node:assert/strict';

// Run against a local production server. Every request below is rejected before
// any model call, newsletter write, or authenticated backend mutation.
const baseUrl = process.env.SOMA_TEST_URL || 'http://localhost:3100';
const cases = [
  ...['assistant', 'chat', 'pathology-chat', 'subscribe'].flatMap(route => [
    { route, body: 'null', status: 400 },
    { route, body: '{', status: 400 },
  ]),
  { route: 'assistant', body: JSON.stringify({ question: 42 }), status: 400 },
  { route: 'chat', body: JSON.stringify({ question: {} }), status: 400 },
  { route: 'pathology-chat', body: JSON.stringify({ question: 'gan', mode: 'invalid' }), status: 400 },
  { route: 'pathology-chat', body: JSON.stringify({ question: 'gan', mode: 'disease' }), status: 400 },
  { route: 'pathology-chat', body: JSON.stringify({ question: 'gan', locale: 'invalid' }), status: 400 },
  { route: 'subscribe', body: JSON.stringify({ email: [] }), status: 400 },
  ...['pdf-mcq', 'quiz-compose', 'study-plan'].map(route => ({ route, body: '{}', status: 401 })),
];

for (const { route, body, status } of cases) {
  const response = await fetch(new URL(`/api/${route}`, baseUrl), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, status, `${route}: ${body}`);
  const payload = await response.json();
  assert.equal(typeof payload.error, 'string', `${route}: expected a JSON error`);
}

console.log(`Passed ${cases.length} API boundary cases against ${baseUrl}.`);
