const { buildOpSequenceHarness } = require('./opSequence');
const { buildTreeRoundTripHarness } = require('./treeRoundTrip');
const { buildCloneGraphHarness } = require('./cloneGraph');

const SPECIAL_CASE_DOORS = new Set([54, 55, 80, 83]);

/**
 * Returns the full harness source for a special-case door, or `null` if
 * that (door, language) pair isn't supported — callers should surface a
 * clear "not available in <language> yet" status rather than guessing.
 */
function buildSpecialCaseHarness(doorNumber, language, userCode) {
  if (doorNumber === 54 || doorNumber === 55) return buildOpSequenceHarness(doorNumber, language, userCode);
  if (doorNumber === 80) return buildTreeRoundTripHarness(language, userCode);
  if (doorNumber === 83) return buildCloneGraphHarness(language, userCode);
  return null;
}

module.exports = { SPECIAL_CASE_DOORS, buildSpecialCaseHarness };
