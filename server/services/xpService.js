const BASE_XP = { easy: 100, medium: 250, hard: 500, boss: 1000 };

/**
 * Calculates total XP earned for a door completion, including bonuses.
 * @param {Object} params
 * @param {string} params.difficulty
 * @param {number} params.attempts
 * @param {number} params.hintsUsed
 * @param {boolean} params.isFirstAttempt
 */
function calculateXP({ difficulty, attempts, hintsUsed }) {
  const base = BASE_XP[difficulty] || BASE_XP.easy;
  let bonus = 0;

  const isFirstAttempt = attempts <= 1;
  const usedNoHints = hintsUsed === 0;

  if (isFirstAttempt) bonus += Math.round(base * 0.2); // first attempt bonus
  if (usedNoHints) bonus += Math.round(base * 0.15); // no-hint bonus
  if (isFirstAttempt && usedNoHints) bonus += Math.round(base * 0.15); // "perfect solution" bonus

  return { base, bonus, total: base + bonus };
}

module.exports = { calculateXP, BASE_XP };
