import { useState } from 'react';

const COMMON_PATTERNS = [
  'Two Pointer',
  'Sliding Window',
  'Hashing',
  'Binary Search',
  'Linear Scan',
  'Dynamic Programming',
  'Boyer-Moore Voting',
  'Three Pointer (Dutch National Flag)',
];

export default function PatternQuiz({ correctPattern, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Build 4 options: correct answer + 3 distractors from the common pattern list
  const options = [correctPattern, ...COMMON_PATTERNS.filter((p) => p !== correctPattern)]
    .slice(0, 4)
    .sort(() => Math.random() - 0.5);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    onAnswer(selected);
  };

  return (
    <div className="door-panel">
      <h3 className="font-display text-sm text-glow-gold mb-3">What pattern did you use?</h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {options.map((option) => (
          <button
            key={option}
            disabled={submitted}
            onClick={() => setSelected(option)}
            className={`text-sm rounded-lg px-3 py-2 border transition-colors ${
              selected === option
                ? 'border-glow-purple bg-glow-purple/10 text-glow-purple'
                : 'border-dungeon-700 bg-dungeon-900/60 text-slate-300 hover:border-dungeon-600'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={!selected} className="btn-primary w-full text-sm disabled:opacity-50">
          Submit Answer
        </button>
      ) : (
        <p className={`text-sm ${selected === correctPattern ? 'text-glow-emerald' : 'text-glow-rose'}`}>
          {selected === correctPattern ? 'Correct! Pattern mastery updated.' : `Not quite — this was ${correctPattern}.`}
        </p>
      )}
    </div>
  );
}
