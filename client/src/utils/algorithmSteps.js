// Utility to generate easy-to-understand, step-by-step algorithm guides
// combines problem-specific explanation, hints, and canonical DSA patterns.

const PATTERN_BLUEPRINTS = {
  'Linear Scan': [
    { step: 1, title: 'Initialize Tracker', desc: 'Pick your starting baseline (e.g. first element or 0/infinity) before looping.' },
    { step: 2, title: 'Single Pass Loop', desc: 'Iterate through each element from left to right exactly once.' },
    { step: 3, title: 'Evaluate Condition', desc: 'Check if the current element satisfies your target condition (larger, matches, etc.).' },
    { step: 4, title: 'Update Running State', desc: 'Update your tracked variable whenever a qualifying element is found.' },
    { step: 5, title: 'Return Result', desc: 'Once the loop terminates, the tracked state holds your final answer.' },
  ],
  'Two Pointer': [
    { step: 1, title: 'Place Boundaries', desc: 'Initialize two pointers (typically left at index 0 and right at index n - 1).' },
    { step: 2, title: 'Convergence Loop', desc: 'Run a while loop while left < right (pointers have not crossed).' },
    { step: 3, title: 'Inspect & Compare', desc: 'Calculate the metric for current pair (sum, area, equality) against target.' },
    { step: 4, title: 'Advance Pointer', desc: 'If too small move left forward; if too large move right backward (or swap if partition).' },
    { step: 5, title: 'Final Result', desc: 'Return the matched indices, accumulated area, or in-place modified boundary.' },
  ],
  'Sliding Window': [
    { step: 1, title: 'Window Setup', desc: 'Set window bounds left = 0, right = 0 and initialize window state (sum, count, or map).' },
    { step: 2, title: 'Expand Window', desc: 'Advance right pointer to incorporate nums[right] into the active window state.' },
    { step: 3, title: 'Check Validity', desc: 'Check whether the current window violates the problem constraints.' },
    { step: 4, title: 'Shrink if Needed', desc: 'While invalid, remove nums[left] from state and increment left++ until valid again.' },
    { step: 5, title: 'Record Optimal', desc: 'Update max/min window size or accumulate answer, then advance right.' },
  ],
  'Binary Search': [
    { step: 1, title: 'Search Bounds', desc: 'Establish range boundaries: low = 0 and high = nums.length - 1.' },
    { step: 2, title: 'Calculate Midpoint', desc: 'While low <= high, find mid = low + Math.floor((high - low) / 2) to prevent overflow.' },
    { step: 3, title: 'Test Midpoint', desc: 'If nums[mid] === target, return mid (found exact target).' },
    { step: 4, title: 'Discard Half', desc: 'If target < nums[mid], eliminate right half (high = mid - 1). Else eliminate left (low = mid + 1).' },
    { step: 5, title: 'Termination', desc: 'If range exhausts without match, return -1 or low (correct insertion index).' },
  ],
  'Dutch National Flag': [
    { step: 1, title: 'Three Pointer Setup', desc: 'Place low = 0, mid = 0, and high = n - 1 to partition into 3 buckets.' },
    { step: 2, title: 'Iterate with Mid', desc: 'Loop while mid <= high, inspecting the value at nums[mid].' },
    { step: 3, title: 'Handle Lowest (0)', desc: 'If nums[mid] === 0: swap nums[low] and nums[mid], then low++ and mid++.' },
    { step: 4, title: 'Handle Middle (1)', desc: 'If nums[mid] === 1: already in correct region, simply advance mid++.' },
    { step: 5, title: 'Handle Highest (2)', desc: 'If nums[mid] === 2: swap nums[mid] and nums[high], decrement high-- (do not advance mid).' },
  ],
  'Fast & Slow Pointers': [
    { step: 1, title: 'Initialize Runners', desc: 'Set slow = head and fast = head (or head.next).' },
    { step: 2, title: 'Advance at Unequal Speeds', desc: 'Move slow 1 step (slow = slow.next) and fast 2 steps (fast = fast.next.next).' },
    { step: 3, title: 'Check Intersection', desc: 'If slow === fast, a cycle or target meeting point is confirmed.' },
    { step: 4, title: 'Locate Target / Midpoint', desc: 'When fast reaches end, slow sits exactly at the middle node of the list.' },
    { step: 5, title: 'Safe Termination', desc: 'Always check fast != null && fast.next != null to avoid null pointer errors.' },
  ],
  'Hashing': [
    { step: 1, title: 'Choose Hash Structure', desc: 'Create a Map (key → value/index) or Set (unique membership lookup in O(1)).' },
    { step: 2, title: 'Single Pass Scan', desc: 'Loop over elements one by one from left to right.' },
    { step: 3, title: 'Lookup Complement', desc: 'Compute required complement (e.g. target - current) and check if it exists in the map.' },
    { step: 4, title: 'Register or Return', desc: 'If complement exists, return the matching pair! Otherwise store current element.' },
    { step: 5, title: 'Space vs Time', desc: 'Trading O(n) memory allows reducing quadratic O(n^2) brute force to linear O(n).' },
  ],
  'Prefix Sum': [
    { step: 1, title: 'Running Accumulator', desc: 'Maintain runningSum = 0 and a HashMap mapping prefixSum → frequency/index.' },
    { step: 2, title: 'Base Entry', desc: 'Initialize map with { 0: 1 } (or { 0: -1 }) to account for valid subarrays from index 0.' },
    { step: 3, title: 'Add Current Element', desc: 'At each index i, add nums[i] to runningSum.' },
    { step: 4, title: 'Check (runningSum - K)', desc: 'If (runningSum - k) exists in map, add its count or calculate max length.' },
    { step: 5, title: 'Record Prefix', desc: 'Insert runningSum into the map and continue to next element.' },
  ],
  'Monotonic Stack': [
    { step: 1, title: 'Stack Structure', desc: 'Maintain a stack storing indices to preserve order and measure distances.' },
    { step: 2, title: 'Scan Elements', desc: 'Loop through elements from left to right (or right to left).' },
    { step: 3, title: 'Maintain Invariant', desc: 'While stack not empty and current element breaks monotonicity, pop elements.' },
    { step: 4, title: 'Resolve Answer', desc: 'Each popped element has found its next greater/smaller target element.' },
    { step: 5, title: 'Push Current', desc: 'Push current index onto stack to await future resolution.' },
  ],
  'Kadane\'s Algorithm': [
    { step: 1, title: 'Initialize Variables', desc: 'Set currentSum = nums[0] and maxSum = nums[0].' },
    { step: 2, title: 'Traverse Array', desc: 'Loop from index 1 to the end of the array.' },
    { step: 3, title: 'Extend or Restart', desc: 'For each number: currentSum = Math.max(nums[i], currentSum + nums[i]).' },
    { step: 4, title: 'Update Global Max', desc: 'Update maxSum = Math.max(maxSum, currentSum) if currentSum is higher.' },
    { step: 5, title: 'Return Maximum', desc: 'Return maxSum representing the maximum contiguous subarray sum.' },
  ],
};

// Find matching pattern blueprint
function getBlueprintForPattern(patternStr = '') {
  const p = patternStr.toLowerCase();
  for (const [key, steps] of Object.entries(PATTERN_BLUEPRINTS)) {
    if (p.includes(key.toLowerCase()) || key.toLowerCase().includes(p)) {
      return { patternName: key, steps };
    }
  }
  if (p.includes('two pointer') || p.includes('2 pointer')) return { patternName: 'Two Pointer', steps: PATTERN_BLUEPRINTS['Two Pointer'] };
  if (p.includes('scan') || p.includes('linear')) return { patternName: 'Linear Scan', steps: PATTERN_BLUEPRINTS['Linear Scan'] };
  if (p.includes('binary search')) return { patternName: 'Binary Search', steps: PATTERN_BLUEPRINTS['Binary Search'] };
  if (p.includes('window')) return { patternName: 'Sliding Window', steps: PATTERN_BLUEPRINTS['Sliding Window'] };
  if (p.includes('hash') || p.includes('set') || p.includes('map')) return { patternName: 'Hashing', steps: PATTERN_BLUEPRINTS['Hashing'] };
  if (p.includes('prefix')) return { patternName: 'Prefix Sum', steps: PATTERN_BLUEPRINTS['Prefix Sum'] };
  if (p.includes('stack') || p.includes('deque')) return { patternName: 'Monotonic Stack', steps: PATTERN_BLUEPRINTS['Monotonic Stack'] };
  if (p.includes('kadane') || p.includes('maximum subarray')) return { patternName: 'Kadane\'s Algorithm', steps: PATTERN_BLUEPRINTS['Kadane\'s Algorithm'] };
  if (p.includes('fast') || p.includes('slow') || p.includes('floyd') || p.includes('cycle')) return { patternName: 'Fast & Slow Pointers', steps: PATTERN_BLUEPRINTS['Fast & Slow Pointers'] };

  return { patternName: patternStr || 'Algorithm Strategy', steps: null };
}

/**
 * Returns structured, easy-to-read algorithm steps for a problem.
 */
export function getAlgorithmGuide(problem) {
  if (!problem) return null;

  const {
    pattern = '',
    solutionExplanation = '',
    hints = [],
    expectedComplexity = { time: 'O(n)', space: 'O(1)' },
    title = '',
  } = problem;

  // Split explanation into clean sentences
  const rawSentences = solutionExplanation
    ? solutionExplanation
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5)
    : [];

  // Match pattern blueprint
  const blueprint = getBlueprintForPattern(pattern);

  // Parse custom steps from hints and explanation
  const customSteps = [];

  // 1. Initial strategy
  if (rawSentences.length > 0) {
    customSteps.push({
      step: 1,
      phase: 'Core Strategy',
      badge: 'Approach',
      text: rawSentences[0],
    });
  }

  // 2. Traversal & Logic from sentences or hints
  if (rawSentences.length > 1) {
    // If second sentence describes the implementation
    customSteps.push({
      step: 2,
      phase: 'Execution Steps',
      badge: 'Logic',
      text: rawSentences[1],
    });
  }

  // 3. Traversal from hints if available
  if (hints && hints.length > 0) {
    hints.forEach((h, idx) => {
      // Avoid exact duplicates
      if (!customSteps.some((cs) => cs.text.toLowerCase() === h.text.toLowerCase())) {
        customSteps.push({
          step: customSteps.length + 1,
          phase: idx === 0 ? 'Foundation' : idx === hints.length - 1 ? 'Action Rule' : 'Iteration',
          badge: `Step ${customSteps.length + 1}`,
          text: h.text,
        });
      }
    });
  }

  // 4. Complexity & Completion
  const complexitySentence = rawSentences.find(
    (s) => s.includes('O(') || s.includes('time') || s.includes('space')
  );

  return {
    title: title || 'Problem Algorithm',
    pattern: pattern || blueprint.patternName,
    blueprintName: blueprint.patternName,
    blueprintSteps: blueprint.steps,
    customSteps: customSteps.slice(0, 5), // Keep top 4-5 focused steps
    summary: rawSentences[0] || (hints[0] ? hints[0].text : 'Follow optimal DSA pattern.'),
    complexity: {
      time: expectedComplexity.time,
      space: expectedComplexity.space,
      note: complexitySentence || `Optimized to ${expectedComplexity.time} time and ${expectedComplexity.space} extra space.`,
    },
  };
}
