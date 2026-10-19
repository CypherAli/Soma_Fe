import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { drLamBankErrors, drLamCorrect, type DrLamBank } from "./drLamBank";
import {
  completeDrLamAttempt,
  drLamElapsed,
  parseDrLamSaved,
  resumableDrLamSession,
  validDrLamSession,
  type DrLamSession,
} from "./drLamSession";

const bank = JSON.parse(
  readFileSync("public/kb/dr-lam/de-thi-thu-9.json", "utf8"),
) as DrLamBank;
const questions = bank.questions.slice(0, 3);
const session: DrLamSession = {
  examId: bank.id,
  order: questions.map((q) => q.id),
  picks: {},
  checked: [],
  index: 0,
  mode: "exam",
  startedAt: 1000,
  finishedAt: null,
};

describe("source quiz recovery and scoring", () => {
  it("rejects corrupted storage while preserving other valid attempts", () => {
    for (const raw of [
      "{",
      "null",
      "[]",
      "42",
      '{"sessions":null,"mistakes":null}',
    ])
      assert.deepEqual(parseDrLamSaved(raw), { sessions: {}, mistakes: {} });
    const saved = parseDrLamSaved(
      JSON.stringify({
        sessions: { [bank.id]: session, broken: {} },
        mistakes: { [bank.id]: [questions[0].id, questions[0].id, "other-1"] },
      }),
    );
    assert.deepEqual(saved.sessions, { [bank.id]: session });
    assert.deepEqual(saved.mistakes[bank.id], [questions[0].id]);
  });
  it("rejects mismatched sets, duplicate questions, invalid selections and timestamps", () => {
    assert.ok(validDrLamSession(session));
    for (const changes of [
      { order: [questions[0].id, questions[0].id] },
      { order: ["de-thi-thu-1-1"] },
      { picks: { [questions[0].id]: ["A", "A"] } },
      { picks: { "other-1": ["A"] } },
      { index: 3 },
      { startedAt: -1 },
      { finishedAt: 999 },
      { checked: ["other-1"] },
    ])
      assert.ok(!validDrLamSession({ ...session, ...changes }));
    assert.equal(
      resumableDrLamSession(bank, {
        ...session,
        picks: { [questions[0].id]: ["F"] },
      }),
      null,
    );
    assert.equal(
      resumableDrLamSession(bank, { ...session, order: [bank.id + "-9999"] }),
      null,
    );
    assert.deepEqual(resumableDrLamSession(bank, session), session);
  });
  it("updates mistakes only on submission, removes corrected ones, keeps skipped ones", () => {
    const picks = {
      [questions[0].id]: questions[0].answers,
      [questions[1].id]: [
        questions[1].options.find((o) => !questions[1].answers.includes(o.id))!
          .id,
      ],
    };
    const saved = { sessions: {}, mistakes: { [bank.id]: [questions[0].id] } };
    const submitted = completeDrLamAttempt(
      saved,
      { ...session, picks },
      questions,
      5000,
    );
    assert.deepEqual(submitted.mistakes[bank.id], [
      questions[1].id,
      questions[2].id,
    ]);
    assert.equal(submitted.sessions[bank.id].finishedAt, 5000);
    assert.deepEqual(saved.mistakes[bank.id], [questions[0].id]);
    assert.equal(
      completeDrLamAttempt(
        submitted,
        submitted.sessions[bank.id],
        questions,
        6000,
      ),
      submitted,
    );
  });
  it("uses real elapsed time after reload and freezes it after submission", () => {
    assert.equal(drLamElapsed(session, 6500), 5);
    assert.equal(drLamElapsed({ ...session, finishedAt: 5000 }, 9000), 4);
    assert.equal(drLamElapsed(session, 500), 0);
  });
  it("validates malformed network banks without crashing the page", () => {
    assert.deepEqual(drLamBankErrors(bank), []);
    for (const value of [
      null,
      [],
      {},
      { ...bank, questions: [null] },
      { ...bank, questions: [{ id: "bad", options: null, answers: null }] },
      { ...bank, questions: [{ ...questions[0], images: null }] },
    ]) {
      assert.ok(drLamBankErrors(value).length);
    }
  });
  it("requires the exact answer set for questions with multiple source keys", () => {
    const q = { ...questions[0], answers: ["A", "C", "D"] };
    assert.ok(drLamCorrect(q, ["D", "C", "A"]));
    assert.ok(!drLamCorrect(q, ["A", "C"]));
    assert.ok(!drLamCorrect(q, ["A", "B", "C", "D"]));
  });
});
