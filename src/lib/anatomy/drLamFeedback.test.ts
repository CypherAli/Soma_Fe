import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import type { DrLamBank } from "./drLamBank";
import { drLamQuestionFeedback } from "./drLamFeedback";

const bank = JSON.parse(
  readFileSync("public/kb/dr-lam/giai-phau-chi-tren.json", "utf8"),
) as DrLamBank;
const question = bank.questions[0];

describe("source quiz answer illustration visibility", () => {
  it("withholds the real PDF hint until a practice answer is checked", () => {
    assert.ok(question.explanationImages.length > 0);
    assert.ok(question.answers.length > 1);
    assert.deepEqual(
      drLamQuestionFeedback(question, "practice", false, false),
      {
        reveal: false,
        images: [],
      },
    );
    assert.deepEqual(drLamQuestionFeedback(question, "practice", true, false), {
      reveal: true,
      images: question.explanationImages,
    });
  });

  it("keeps exam hints hidden even for a checked answer until submission", () => {
    for (const checked of [false, true]) {
      assert.deepEqual(
        drLamQuestionFeedback(question, "exam", checked, false),
        {
          reveal: false,
          images: [],
        },
      );
      assert.deepEqual(drLamQuestionFeedback(question, "exam", checked, true), {
        reveal: true,
        images: question.explanationImages,
      });
    }
  });

  it("preserves an image needed to read the question while withholding its explanation", () => {
    const stemImage = "/kb/dr-lam/images/question.webp";
    const withStemImage = { ...question, images: [stemImage] };
    for (const mode of ["practice", "exam"] as const) {
      assert.deepEqual(
        drLamQuestionFeedback(withStemImage, mode, false, false),
        {
          reveal: false,
          images: [stemImage],
        },
      );
      assert.deepEqual(
        drLamQuestionFeedback(withStemImage, mode, false, true).images,
        [stemImage, ...question.explanationImages],
      );
    }
  });

  it("does not carry images into a loading or empty question", () => {
    assert.deepEqual(
      drLamQuestionFeedback(undefined, undefined, false, false),
      {
        reveal: false,
        images: [],
      },
    );
  });
});
