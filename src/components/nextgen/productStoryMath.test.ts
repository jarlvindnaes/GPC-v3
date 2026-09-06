import assert from "node:assert/strict";
import { test } from "node:test";
import { getStoryFrame } from "./productStoryMath.ts";

test("the story starts and finishes assembled, with a fully open middle", () => {
  assert.equal(getStoryFrame(0).separation, 0);
  assert.equal(getStoryFrame(0.52).separation, 1);
  assert.equal(getStoryFrame(1).separation, 0);
  assert.deepEqual(
    [0, 0.52, 1].map((value) => getStoryFrame(value).chapter),
    [0, 1, 2]
  );
});

test("scrubbing is continuous, reversible and stays within the assembly bounds", () => {
  for (let step = 0; step <= 1000; step++) {
    const progress = step / 1000;
    const frame = getStoryFrame(progress);
    assert(frame.separation >= 0 && frame.separation <= 1);
    assert(Math.abs(frame.separation - getStoryFrame(progress + 0.001).separation) < 0.006);
    assert.deepEqual(getStoryFrame(progress), getStoryFrame(progress));
  }
  assert.equal(getStoryFrame(-1).separation, 0);
  assert.equal(getStoryFrame(2).separation, 0);
});
