/**
 * specialCaseTestData.js
 * -----------------------
 * Doors 54 (Min Stack), 55 (Implement Queue using Stacks), 80 (Serialize/
 * Deserialize Binary Tree) and 83 (Clone Graph) don't fit the "one method,
 * JSON args -> JSON result" shape the generic harnesses assume — they're
 * either a sequence of operations on a stateful object, or a structural
 * round-trip. Ground truth for all four is computed directly here in
 * plain JS (op-sequence problems: a small trusted reference stack/queue
 * implementation; round-trip problems: canonicalizing the input itself),
 * so no compiler/child process is needed at seed time.
 *
 * See server/execution/specialCases/ for the matching per-language
 * *judge* harnesses that run the user's actual submission for these doors.
 */

const SPECIAL_CASE_DOORS = new Set([54, 55, 80, 83]);

// ---------- Door 54: Min Stack ----------
function opSequenceMinStack() {
  const ops = ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin', 'push', 'getMin'];
  const args = [[-2], [0], [-3], [], [], [], [], [-5], []];
  // Trusted plain-JS reference implementation
  const stack = [];
  const mins = [];
  const expected = ops.map((op, i) => {
    const a = args[i];
    if (op === 'push') {
      stack.push(a[0]);
      mins.push(mins.length ? Math.min(mins[mins.length - 1], a[0]) : a[0]);
      return null;
    }
    if (op === 'pop') { stack.pop(); mins.pop(); return null; }
    if (op === 'top') return stack[stack.length - 1];
    if (op === 'getMin') return mins[mins.length - 1];
    return null;
  });
  return { ops, args, expected };
}

// ---------- Door 55: Implement Queue using Stacks ----------
function opSequenceMyQueue() {
  const ops = ['push', 'push', 'peek', 'pop', 'empty', 'push', 'pop', 'pop', 'empty'];
  const args = [[1], [2], [], [], [], [3], [], [], []];
  const q = [];
  const expected = ops.map((op, i) => {
    const a = args[i];
    if (op === 'push') { q.push(a[0]); return null; }
    if (op === 'pop') return q.shift();
    if (op === 'peek') return q[0];
    if (op === 'empty') return q.length === 0;
    return null;
  });
  return { ops, args, expected };
}

// ---------- Door 80: Serialize/Deserialize Binary Tree (round trip) ----------
// Canonicalizes a level-order tree array exactly the way the language
// harnesses' _build_treenode/_print_treenode helpers do (BFS rebuild,
// trim only *trailing* nulls) — see harnesses/python.js etc.
function canonicalizeTreeArray(arr) {
  if (!arr.length || arr[0] === null) return [];
  const build = (a) => {
    const root = { val: a[0], left: null, right: null };
    const queue = [root];
    let i = 1;
    while (queue.length && i < a.length) {
      const node = queue.shift();
      if (i < a.length) {
        const v = a[i++];
        if (v !== null) { node.left = { val: v, left: null, right: null }; queue.push(node.left); }
      }
      if (i < a.length) {
        const v = a[i++];
        if (v !== null) { node.right = { val: v, left: null, right: null }; queue.push(node.right); }
      }
    }
    return root;
  };
  const root = build(arr);
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (node === null) { out.push(null); continue; }
    out.push(node.val);
    queue.push(node.left);
    queue.push(node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}

const TREE_ROUND_TRIP_CASES = [
  { type: 'Basic Key', isHidden: false, difficulty: 'hard', arr: [1, 2, 3, null, null, 4, 5] },
  { type: 'Edge Case Key', isHidden: false, difficulty: 'medium', arr: [] },
  { type: 'Boundary Key', isHidden: true, difficulty: 'medium', arr: [1] },
];

// ---------- Door 83: Clone Graph (round trip) ----------
// Input is a 1-indexed adjacency list (LeetCode's own format for this
// problem). Expected output is the same connectivity with each neighbor
// list sorted, since a correct clone only needs to preserve structure.
function canonicalizeAdjList(adj) {
  return adj.map((neighbors) => [...neighbors].sort((a, b) => a - b));
}

const GRAPH_ROUND_TRIP_CASES = [
  { type: 'Basic Key', isHidden: false, difficulty: 'medium', adj: [[2, 4], [1, 3], [2, 4], [1, 3]] },
  { type: 'Edge Case Key', isHidden: false, difficulty: 'easy', adj: [[]] },
  { type: 'Boundary Key', isHidden: true, difficulty: 'medium', adj: [] },
];

function normalizeSpecialCaseProblem(problem, stats) {
  const keys = [];
  const pushKey = (base, argsJson, expectedJson) => {
    keys.push({
      ...(base.toObject ? base.toObject() : base),
      argsJson,
      expectedJson,
    });
  };

  if (problem.doorNumber === 54) {
    const { ops, args, expected } = opSequenceMinStack();
    problem.keys.forEach((k) => pushKey(k, JSON.stringify([ops, args]), JSON.stringify(expected)));
    stats.synthesized = problem.keys.length;
    return { keys, stats };
  }

  if (problem.doorNumber === 55) {
    const { ops, args, expected } = opSequenceMyQueue();
    problem.keys.forEach((k) => pushKey(k, JSON.stringify([ops, args]), JSON.stringify(expected)));
    stats.synthesized = problem.keys.length;
    return { keys, stats };
  }

  if (problem.doorNumber === 80) {
    problem.keys.forEach((k, i) => {
      const c = TREE_ROUND_TRIP_CASES[i % TREE_ROUND_TRIP_CASES.length];
      pushKey(k, JSON.stringify(c.arr), JSON.stringify(canonicalizeTreeArray(c.arr)));
    });
    stats.synthesized = problem.keys.length;
    return { keys, stats };
  }

  if (problem.doorNumber === 83) {
    problem.keys.forEach((k, i) => {
      const c = GRAPH_ROUND_TRIP_CASES[i % GRAPH_ROUND_TRIP_CASES.length];
      pushKey(k, JSON.stringify(c.adj), JSON.stringify(canonicalizeAdjList(c.adj)));
    });
    stats.synthesized = problem.keys.length;
    return { keys, stats };
  }

  stats.dropped = problem.keys.length;
  return { keys: [], stats };
}

module.exports = {
  SPECIAL_CASE_DOORS,
  normalizeSpecialCaseProblem,
  canonicalizeTreeArray,
  canonicalizeAdjList,
};
