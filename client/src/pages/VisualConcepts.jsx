import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
  Sparkles, Layers, Code2, Eye, Zap, BookOpen,
  ArrowRight, CheckCircle2, ChevronRight, Sliders,
  HelpCircle, ExternalLink, RefreshCw,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useThemeStore from '../store/useThemeStore';

/* ─────────────────────────────────────────────────────────────
   CONCEPT DATA WITH STEP-BY-STEP SIMULATION & MULTI-LANG CODE
───────────────────────────────────────────────────────────── */

const VISUAL_CONCEPTS = [
  {
    id: 'two-pointers',
    title: 'Two Pointers Technique',
    category: 'Array / String',
    badge: 'Essential Pattern',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Two pointers start at opposite ends (or staggered positions) and move inward based on comparison, eliminating quadratic O(n²) checks in a single linear O(n) pass.',
    analogy: 'Imagine two people standing at opposite ends of a row of numbers, stepping inward toward each other until their combined sum matches the target.',
    defaultData: [1, 2, 4, 6, 8, 11, 15],
    target: 14,
    codeSnippets: {
      cpp: `int left = 0, right = n - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) {
        return {left, right}; // Found target!
    } else if (sum < target) {
        left++; // Increase sum by moving left pointer
    } else {
        right--; // Decrease sum by moving right pointer
    }
}
return {-1, -1};`,
      java: `int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) {
        return new int[]{left, right};
    } else if (sum < target) {
        left++;
    } else {
        right--;
    }
}
return new int[]{-1, -1};`,
      python: `left, right = 0, len(nums) - 1
while left < right:
    current_sum = nums[left] + nums[right]
    if current_sum == target:
        return [left, right]
    elif current_sum < target:
        left += 1
    else:
        right -= 1
return [-1, -1]`,
      javascript: `let left = 0, right = nums.length - 1;
while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
}
return [-1, -1];`
    },
    generateSteps: (nums, target = 14) => {
      const steps = [];
      let left = 0;
      let right = nums.length - 1;
      
      steps.push({
        line: 1,
        left,
        right,
        sum: nums[left] + nums[right],
        action: `Initialize left pointer at index 0 (val=${nums[left]}) and right pointer at index ${right} (val=${nums[right]}).`,
        status: 'init'
      });

      while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
          steps.push({
            line: 4,
            left,
            right,
            sum,
            action: `Match Found! nums[${left}] (${nums[left]}) + nums[${right}] (${nums[right]}) = ${target}.`,
            status: 'found'
          });
          break;
        } else if (sum < target) {
          steps.push({
            line: 7,
            left,
            right,
            sum,
            action: `Current sum ${sum} < target ${target}. Since array is sorted, advance left pointer to ${left + 1} to increase sum.`,
            status: 'advance-left'
          });
          left++;
        } else {
          steps.push({
            line: 9,
            left,
            right,
            sum,
            action: `Current sum ${sum} > target ${target}. Advance right pointer backward to ${right - 1} to decrease sum.`,
            status: 'retreat-right'
          });
          right--;
        }
      }
      return steps;
    },
    doorNumber: 9,
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window Pattern',
    category: 'Array / String',
    badge: 'Window Optimization',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Maintains a dynamic or fixed contiguous subarray window. Instead of re-calculating sums from scratch each time, add the new incoming element and subtract the outgoing element.',
    analogy: 'Think of a magnifying glass sliding across a strip of film: you only update what enters on the right and what leaves on the left.',
    defaultData: [2, 1, 5, 1, 3, 2],
    k: 3,
    codeSnippets: {
      cpp: `int windowSum = 0, maxSum = 0;
// 1. Build initial window of size k
for (int i = 0; i < k; i++) windowSum += nums[i];
maxSum = windowSum;

// 2. Slide window across the array
for (int right = k; right < n; right++) {
    windowSum += nums[right] - nums[right - k];
    maxSum = max(maxSum, windowSum);
}
return maxSum;`,
      java: `int windowSum = 0, maxSum = 0;
for (int i = 0; i < k; i++) windowSum += nums[i];
maxSum = windowSum;

for (int right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];
    maxSum = Math.max(maxSum, windowSum);
}
return maxSum;`,
      python: `window_sum = sum(nums[:k])
max_sum = window_sum

for right in range(k, len(nums)):
    window_sum += nums[right] - nums[right - k]
    max_sum = max(max_sum, window_sum)

return max_sum`,
      javascript: `let windowSum = 0, maxSum = 0;
for (let i = 0; i < k; i++) windowSum += nums[i];
maxSum = windowSum;

for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k];
    maxSum = Math.max(maxSum, windowSum);
}
return maxSum;`
    },
    generateSteps: (nums, k = 3) => {
      const steps = [];
      let windowSum = 0;
      for (let i = 0; i < k; i++) windowSum += nums[i];
      let maxSum = windowSum;

      steps.push({
        line: 3,
        left: 0,
        right: k - 1,
        windowSum,
        maxSum,
        action: `Build initial window [0...${k - 1}] elements: [${nums.slice(0, k).join(', ')}]. Initial sum = ${windowSum}.`,
        status: 'init'
      });

      for (let right = k; right < nums.length; right++) {
        const left = right - k + 1;
        const outgoing = nums[right - k];
        const incoming = nums[right];
        windowSum += incoming - outgoing;
        const isNewMax = windowSum > maxSum;
        if (isNewMax) maxSum = windowSum;

        steps.push({
          line: 7,
          left,
          right,
          windowSum,
          maxSum,
          action: `Slide window to [${left}...${right}]: Subtract outgoing nums[${right - k}] (${outgoing}), add incoming nums[${right}] (${incoming}). Window sum = ${windowSum} (${isNewMax ? 'New Max!' : 'Max remains ' + maxSum}).`,
          status: isNewMax ? 'new-max' : 'slide'
        });
      }
      return steps;
    },
    doorNumber: 8,
  },
  {
    id: 'binary-search',
    title: 'Binary Search (Divide & Conquer)',
    category: 'Searching',
    badge: 'Logarithmic Speed',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    summary: 'Halves the search space at every iteration by comparing target with the middle element. Requires array to be sorted.',
    analogy: 'Like opening a dictionary right in the middle: if your word is alphabetically later, throw away the entire left half!',
    defaultData: [3, 8, 12, 17, 24, 31, 45, 59, 72, 88, 96],
    target: 59,
    codeSnippets: {
      cpp: `int low = 0, high = n - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) {
        return mid; // Target found!
    } else if (nums[mid] < target) {
        low = mid + 1; // Eliminate left half
    } else {
        high = mid - 1; // Eliminate right half
    }
}
return -1;`,
      java: `int low = 0, high = nums.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}
return -1;`,
      python: `low, high = 0, len(nums) - 1
while low <= high:
    mid = low + (high - low) // 2
    if nums[mid] == target:
        return mid
    elif nums[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
return -1`,
      javascript: `let low = 0, high = nums.length - 1;
while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}
return -1;`
    },
    generateSteps: (nums, target = 59) => {
      const steps = [];
      let low = 0;
      let high = nums.length - 1;

      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const midVal = nums[mid];

        if (midVal === target) {
          steps.push({
            line: 4,
            low,
            high,
            mid,
            midVal,
            action: `Target ${target} matches middle element at index ${mid}! Search successful in O(log n).`,
            status: 'found'
          });
          break;
        } else if (midVal < target) {
          steps.push({
            line: 7,
            low,
            high,
            mid,
            midVal,
            action: `Middle element nums[${mid}] (${midVal}) < target (${target}). Discard left range [${low}...${mid}], update low = ${mid + 1}.`,
            status: 'shift-right'
          });
          low = mid + 1;
        } else {
          steps.push({
            line: 9,
            low,
            high,
            mid,
            midVal,
            action: `Middle element nums[${mid}] (${midVal}) > target (${target}). Discard right range [${mid}...${high}], update high = ${mid - 1}.`,
            status: 'shift-left'
          });
          high = mid - 1;
        }
      }
      return steps;
    },
    doorNumber: 14,
  },
  {
    id: 'kadanes-algorithm',
    title: "Kadane's Algorithm (Max Subarray Sum)",
    category: 'Dynamic Programming',
    badge: 'Contiguous Optimization',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'At each position, decides whether to extend the existing contiguous subarray or restart a brand new subarray if the running sum drops below the current element.',
    analogy: 'If your current debt is worse than having nothing, drop the past and start fresh from today.',
    defaultData: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    codeSnippets: {
      cpp: `int currentSum = nums[0];
int maxSum = nums[0];

for (int i = 1; i < n; i++) {
    // Either extend existing subarray or start fresh from nums[i]
    currentSum = max(nums[i], currentSum + nums[i]);
    maxSum = max(maxSum, currentSum);
}
return maxSum;`,
      java: `int currentSum = nums[0], maxSum = nums[0];
for (int i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}
return maxSum;`,
      python: `current_sum = nums[0]
max_sum = nums[0]

for x in nums[1:]:
    current_sum = max(x, current_sum + x)
    max_sum = max(max_sum, current_sum)

return max_sum`,
      javascript: `let currentSum = nums[0], maxSum = nums[0];
for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}
return maxSum;`
    },
    generateSteps: (nums) => {
      const steps = [];
      let currentSum = nums[0];
      let maxSum = nums[0];
      let start = 0;
      let end = 0;
      let tempStart = 0;

      steps.push({
        line: 1,
        i: 0,
        currentSum,
        maxSum,
        start: 0,
        end: 0,
        action: `Initialize currentSum = nums[0] (${nums[0]}), maxSum = ${maxSum}.`,
        status: 'init'
      });

      for (let i = 1; i < nums.length; i++) {
        if (nums[i] > currentSum + nums[i]) {
          currentSum = nums[i];
          tempStart = i;
        } else {
          currentSum += nums[i];
        }

        const isNewMax = currentSum > maxSum;
        if (isNewMax) {
          maxSum = currentSum;
          start = tempStart;
          end = i;
        }

        steps.push({
          line: 5,
          i,
          currentSum,
          maxSum,
          start,
          end,
          action: `At index ${i} (val=${nums[i]}): currentSum is now ${currentSum}. Global maxSum = ${maxSum} ${isNewMax ? '(New Peak!)' : ''}.`,
          status: isNewMax ? 'new-max' : 'step'
        });
      }
      return steps;
    },
    doorNumber: 4,
  },
  {
    id: 'dutch-flag',
    title: 'Dutch National Flag (3-Way Partitioning)',
    category: 'Array / Sorting',
    badge: 'In-Place Partition',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Partitions an array containing three distinct keys (e.g. 0s, 1s, 2s) in a single pass using three pointers (low, mid, high).',
    analogy: 'Sorting colored balls into three distinct boxes (Red, White, Blue) without using any extra storage boxes.',
    defaultData: [2, 0, 2, 1, 1, 0],
    codeSnippets: {
      cpp: `int low = 0, mid = 0, high = n - 1;
while (mid <= high) {
    if (nums[mid] == 0) {
        swap(nums[low++], nums[mid++]);
    } else if (nums[mid] == 1) {
        mid++; // 1 is in correct middle bucket
    } else { // nums[mid] == 2
        swap(nums[mid], nums[high--]);
    }
}`,
      java: `int low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
    if (nums[mid] == 0) {
        swap(nums, low++, mid++);
    } else if (nums[mid] == 1) {
        mid++;
    } else {
        swap(nums, mid, high--);
    }
}`,
      python: `low, mid, high = 0, 0, len(nums) - 1
while mid <= high:
    if nums[mid] == 0:
        nums[low], nums[mid] = nums[mid], nums[low]
        low += 1
        mid += 1
    elif nums[mid] == 1:
        mid += 1
    else:
        nums[mid], nums[high] = nums[high], nums[mid]
        high -= 1`,
      javascript: `let low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
    if (nums[mid] === 0) {
        [nums[low], nums[mid]] = [nums[mid], nums[low]];
        low++; mid++;
    } else if (nums[mid] === 1) {
        mid++;
    } else {
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        high--;
    }
}`
    },
    generateSteps: (inputNums) => {
      const nums = [...inputNums];
      const steps = [];
      let low = 0;
      let mid = 0;
      let high = nums.length - 1;

      steps.push({
        line: 1,
        nums: [...nums],
        low,
        mid,
        high,
        action: `Initialize low = 0 (for 0s), mid = 0 (scanner), high = ${high} (for 2s).`,
        status: 'init'
      });

      while (mid <= high) {
        if (nums[mid] === 0) {
          const temp = nums[low];
          nums[low] = nums[mid];
          nums[mid] = temp;
          steps.push({
            line: 4,
            nums: [...nums],
            low,
            mid,
            high,
            action: `nums[mid] is 0: Swap nums[low=${low}] and nums[mid=${mid}]. Advance low to ${low + 1}, mid to ${mid + 1}.`,
            status: 'swap-0'
          });
          low++;
          mid++;
        } else if (nums[mid] === 1) {
          steps.push({
            line: 6,
            nums: [...nums],
            low,
            mid,
            high,
            action: `nums[mid] is 1: Already in the middle bucket. Just advance scanner mid to ${mid + 1}.`,
            status: 'skip-1'
          });
          mid++;
        } else {
          const temp = nums[mid];
          nums[mid] = nums[high];
          nums[high] = temp;
          steps.push({
            line: 8,
            nums: [...nums],
            low,
            mid,
            high,
            action: `nums[mid] is 2: Swap nums[mid=${mid}] and nums[high=${high}]. Decrement high to ${high - 1}. (Keep mid to inspect swapped element).`,
            status: 'swap-2'
          });
          high--;
        }
      }

      steps.push({
        line: 10,
        nums: [...nums],
        low,
        mid,
        high,
        action: `Complete! All 0s are on the left, 1s in the middle, and 2s on the right.`,
        status: 'done'
      });
      return steps;
    },
    doorNumber: 5,
  },
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack (Next Greater Element)',
    category: 'Stack / Data Structures',
    badge: 'Linear Range Query',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Maintains elements in strictly decreasing or increasing order within a stack. When an incoming element violates monotonicity, all smaller elements find their next greater value in O(1) amortized.',
    analogy: 'Imagine taller buildings blocking the view of shorter buildings behind them.',
    defaultData: [4, 5, 2, 25],
    codeSnippets: {
      cpp: `vector<int> nextGreater(n, -1);
stack<int> st; // stores indices

for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        int prevIdx = st.top(); st.pop();
        nextGreater[prevIdx] = nums[i]; // Found next greater!
    }
    st.push(i);
}
return nextGreater;`,
      java: `int[] nextGreater = new int[nums.length];
Arrays.fill(nextGreater, -1);
Stack<Integer> st = new Stack<>();

for (int i = 0; i < nums.length; i++) {
    while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
        nextGreater[st.pop()] = nums[i];
    }
    st.push(i);
}
return nextGreater;`,
      python: `next_greater = [-1] * len(nums)
stack = [] # stores indices

for i, x in enumerate(nums):
    while stack and x > nums[stack[-1]]:
        prev_idx = stack.pop()
        next_greater[prev_idx] = x
    stack.append(i)

return next_greater`,
      javascript: `const nextGreater = new Array(nums.length).fill(-1);
const stack = []; // stores indices

for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
        const prevIdx = stack.pop();
        nextGreater[prevIdx] = nums[i];
    }
    stack.push(i);
}
return nextGreater;`
    },
    generateSteps: (nums) => {
      const steps = [];
      const nextGreater = new Array(nums.length).fill(-1);
      const stack = [];

      steps.push({
        line: 1,
        i: -1,
        stack: [],
        nextGreater: [...nextGreater],
        action: `Initialize empty stack and result array filled with -1.`,
        status: 'init'
      });

      for (let i = 0; i < nums.length; i++) {
        const val = nums[i];
        while (stack.length > 0 && val > nums[stack[stack.length - 1]]) {
          const prevIdx = stack.pop();
          nextGreater[prevIdx] = val;
          steps.push({
            line: 6,
            i,
            stack: [...stack],
            nextGreater: [...nextGreater],
            action: `Element ${val} at index ${i} is greater than nums[${prevIdx}] (${nums[prevIdx]}). Pop index ${prevIdx} and record nextGreater[${prevIdx}] = ${val}.`,
            status: 'pop'
          });
        }
        stack.push(i);
        steps.push({
          line: 8,
          i,
          stack: [...stack],
          nextGreater: [...nextGreater],
          action: `Push index ${i} (val=${val}) onto monotonic stack to await its next greater element.`,
          status: 'push'
        });
      }
      return steps;
    },
    doorNumber: 23,
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export default function VisualConcepts() {
  const navigate = useNavigate();
  const isLight = useThemeStore((s) => s.theme) === 'light';

  const [selectedConceptId, setSelectedConceptId] = useState('two-pointers');
  const [selectedLang, setSelectedLang] = useState('cpp');
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const concept = useMemo(() => {
    return VISUAL_CONCEPTS.find((c) => c.id === selectedConceptId) || VISUAL_CONCEPTS[0];
  }, [selectedConceptId]);

  const steps = useMemo(() => {
    return concept.generateSteps(concept.defaultData, concept.target || concept.k);
  }, [concept]);

  const currentStep = steps[stepIndex] || steps[0] || {};

  // Auto playback loop
  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [selectedConceptId]);

  useEffect(() => {
    if (!isPlaying || !steps.length) return;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const ms = Math.max(350, 1100 / speed);
    const timer = setTimeout(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, ms);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speed]);

  const langLabels = { cpp: 'C++', java: 'Java', python: 'Python', javascript: 'JavaScript' };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">

        {/* ── Header ── */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-sky-50/90 via-violet-50/40 to-white border-sky-200/70 shadow-[0_4px_24px_rgba(14,165,233,0.06)]'
            : 'bg-gradient-to-r from-[#0c1924] via-[#1c1c1e] to-[#161618] border-sky-500/30 shadow-[0_4px_32px_rgba(14,165,233,0.1)]'
        }`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500 text-white shadow-sm">
                  <Eye size={13} /> Visual DSA Academy
                </span>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-white/80 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                }`}>
                  Interactive Algorithm Engine
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                Learn Algorithm Patterns <span className="text-sky-500">Visually</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Step through canonical data structures & algorithm blueprints with line-by-line animations, state inspection, and executable multi-language code.
              </p>
            </div>

            {/* Quick Door Jump */}
            {concept.doorNumber && (
              <button
                onClick={() => navigate(`/door/${concept.doorNumber}`)}
                className="shrink-0 px-4 py-2.5 rounded-xl font-mono font-semibold text-xs text-black bg-gradient-to-r from-[#ff9500] to-amber-400 hover:brightness-110 shadow-md transition-all flex items-center gap-2 group hover:-translate-y-0.5"
              >
                <span>Practice in Door {concept.doorNumber}</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* ── Concept Selector Pills ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {VISUAL_CONCEPTS.map((c) => {
            const isSel = c.id === selectedConceptId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedConceptId(c.id)}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 ${
                  isSel
                    ? 'bg-sky-500 border-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                    : isLight
                    ? 'bg-white hover:bg-slate-50 border-black/[0.08] text-slate-700'
                    : 'bg-[#1c1c1e] hover:bg-white/[0.05] border-white/[0.08] text-slate-300'
                }`}
              >
                <Zap size={12} className={isSel ? 'text-amber-300' : 'text-slate-400'} />
                <span>{c.title}</span>
              </button>
            );
          })}
        </div>

        {/* ── Main Interactive Split View ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: Visual Canvas & Step Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Visual Screen Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between min-h-[360px] ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              
              {/* Top Banner */}
              <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/[0.06] pb-3 mb-4">
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold flex items-center gap-2">
                    <span>{concept.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 font-semibold">
                      {concept.badge}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Time: <strong className="text-sky-500 italic">{concept.timeComplexity}</strong> · Space: <strong className="text-violet-500 italic">{concept.spaceComplexity}</strong>
                  </p>
                </div>

                <span className="text-xs font-mono text-slate-400 font-semibold">
                  Step {stepIndex + 1} / {steps.length}
                </span>
              </div>

              {/* Dynamic Interactive Visualizer Stage */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 px-2">
                
                {/* 1. ARRAY RENDERING (Two Pointers, Sliding Window, Binary Search, Kadane, Dutch Flag) */}
                {Array.isArray(concept.defaultData) && concept.id !== 'monotonic-stack' && (
                  <div className="flex flex-wrap gap-2 justify-center items-end py-4 max-w-full">
                    {concept.defaultData.map((val, idx) => {
                      const isLeft = currentStep.left === idx || currentStep.low === idx || currentStep.low === idx;
                      const isRight = currentStep.right === idx || currentStep.high === idx;
                      const isMid = currentStep.mid === idx;
                      const isScanner = currentStep.i === idx;
                      const inKadaneRange = typeof currentStep.start === 'number' && idx >= currentStep.start && idx <= currentStep.end;
                      const inWindow = typeof currentStep.left === 'number' && typeof currentStep.right === 'number' && idx >= currentStep.left && idx <= currentStep.right;

                      let borderColor = isLight ? '#cbd5e1' : '#334155';
                      let bgColor = isLight ? '#f8fafc' : '#0f172a';
                      let textColor = isLight ? '#0f172a' : '#f8fafc';

                      if (isMid) {
                        borderColor = '#38bdf8';
                        bgColor = 'rgba(56, 189, 248, 0.25)';
                        textColor = '#0284c7';
                      } else if (isLeft || isRight) {
                        borderColor = '#ff9500';
                        bgColor = 'rgba(255, 149, 0, 0.2)';
                        textColor = '#d97706';
                      } else if (inWindow || inKadaneRange) {
                        borderColor = '#a855f7';
                        bgColor = 'rgba(168, 85, 247, 0.15)';
                      }

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          {/* Pointer Labels */}
                          <div className="h-5 flex items-center justify-center">
                            {isMid && (
                              <span className="text-[10px] font-mono px-1 rounded bg-sky-500 text-white font-bold">
                                mid
                              </span>
                            )}
                            {isLeft && !isMid && (
                              <span className="text-[10px] font-mono px-1 rounded bg-amber-500 text-black font-bold">
                                {currentStep.low !== undefined ? 'low' : 'L'}
                              </span>
                            )}
                            {isRight && !isMid && (
                              <span className="text-[10px] font-mono px-1 rounded bg-amber-500 text-black font-bold">
                                {currentStep.high !== undefined ? 'high' : 'R'}
                              </span>
                            )}
                            {isScanner && (
                              <span className="text-[10px] font-mono px-1 rounded bg-violet-500 text-white font-bold">
                                i={idx}
                              </span>
                            )}
                          </div>

                          {/* Element Box */}
                          <motion.div
                            animate={{
                              scale: isMid || isLeft || isRight || isScanner ? 1.15 : 1,
                              borderColor,
                              backgroundColor: bgColor,
                            }}
                            transition={{ duration: 0.2 }}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm sm:text-base font-bold shadow-sm"
                            style={{ color: textColor }}
                          >
                            {currentStep.nums ? currentStep.nums[idx] : val}
                          </motion.div>

                          {/* Index */}
                          <span className="text-[10px] font-mono text-slate-400">
                            [{idx}]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. STACK RENDERING (Monotonic Stack) */}
                {concept.id === 'monotonic-stack' && (
                  <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
                    {/* Elements array */}
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-mono text-slate-400 mb-2">Input Elements</span>
                      <div className="flex gap-2">
                        {concept.defaultData.map((val, idx) => (
                          <div
                            key={idx}
                            className={`w-11 h-11 rounded-xl border-2 flex flex-col items-center justify-center font-mono font-bold ${
                              currentStep.i === idx
                                ? 'bg-sky-500/20 border-sky-500 text-sky-500'
                                : 'bg-slate-100 dark:bg-black/30 border-slate-300 dark:border-white/10'
                            }`}
                          >
                            <span>{val}</span>
                            <span className="text-[9px] text-slate-400">[{idx}]</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stack Tube */}
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-mono text-slate-400 mb-2">Monotonic Stack (Indices)</span>
                      <div className={`w-24 min-h-[110px] rounded-b-2xl border-2 border-t-0 p-2 flex flex-col-reverse gap-1.5 items-center ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-black/40 border-white/20'
                      }`}>
                        {currentStep.stack && currentStep.stack.length > 0 ? (
                          currentStep.stack.map((idxVal, sIdx) => (
                            <div
                              key={sIdx}
                              className="w-full py-1 text-center font-mono text-xs font-bold rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-500"
                            >
                              idx {idxVal} ({concept.defaultData[idxVal]})
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400 my-auto">empty</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Banner */}
              <div className={`p-3.5 rounded-xl border text-center ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
              }`}>
                <p className="text-xs sm:text-sm font-medium leading-relaxed font-mono">
                  {currentStep.action || 'Ready to step through algorithm...'}
                </p>
              </div>

              {/* Interactive Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                    className={`p-2 rounded-lg border transition-all ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                    title="Reset to beginning"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={() => { setStepIndex((i) => Math.max(0, i - 1)); setIsPlaying(false); }}
                    disabled={stepIndex === 0}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-40 ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                    title="Previous Step"
                  >
                    <SkipBack size={14} />
                  </button>
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="px-4 py-2 rounded-lg font-mono font-semibold text-xs flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={() => { setStepIndex((i) => Math.min(steps.length - 1, i + 1)); setIsPlaying(false); }}
                    disabled={stepIndex === steps.length - 1}
                    className={`p-2 rounded-lg border transition-all disabled:opacity-40 ${
                      isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                    title="Next Step"
                  >
                    <SkipForward size={14} />
                  </button>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2 py-0.5 rounded ${
                        speed === s
                          ? 'bg-sky-500/20 text-sky-500 font-bold border border-sky-500/30'
                          : 'hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Concept Deep Dive Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              <h4 className="font-display text-sm font-bold flex items-center gap-2">
                <BookOpen size={14} className="text-sky-500" />
                <span>Concept Intuition & Analogy</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {concept.summary}
              </p>
              <div className={`p-3 rounded-xl border text-xs italic ${
                isLight ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-sky-950/30 border-sky-500/30 text-sky-200'
              }`}>
                "{concept.analogy}"
              </div>
            </div>

          </div>

          {/* RIGHT: Multi-Language Code Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl border overflow-hidden flex flex-col h-full ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              
              {/* Language Selector Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Code2 size={15} className="text-sky-500" />
                  <span className="font-display font-bold text-xs">Implementation</span>
                </div>

                {/* Language Tabs */}
                <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-lg">
                  {Object.keys(concept.codeSnippets).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => setSelectedLang(langKey)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all ${
                        selectedLang === langKey
                          ? 'bg-sky-500 text-white font-bold shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {langLabels[langKey]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Viewer with active line highlight */}
              <div className={`p-4 font-mono text-xs overflow-x-auto flex-1 leading-relaxed ${
                isLight ? 'bg-slate-900 text-slate-100' : 'bg-black/60 text-slate-100'
              }`}>
                <pre className="divide-y divide-transparent">
                  {concept.codeSnippets[selectedLang].split('\n').map((codeLine, lineIdx) => {
                    const isCurrentLine = currentStep.line === lineIdx + 1;
                    return (
                      <div
                        key={lineIdx}
                        className={`flex items-center gap-3 px-2 py-0.5 rounded transition-colors ${
                          isCurrentLine
                            ? 'bg-sky-500/30 border-l-2 border-sky-400 text-sky-200 font-bold'
                            : 'text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-600 select-none w-5 text-right font-mono">
                          {lineIdx + 1}
                        </span>
                        <code className="whitespace-pre">{codeLine}</code>
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* Variables Live Watch State */}
              <div className={`p-4 border-t ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
              }`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Live Variables Inspector
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {Object.entries(currentStep)
                    .filter(([k]) => !['line', 'action', 'status', 'nums'].includes(k))
                    .map(([varKey, varVal]) => (
                      <div
                        key={varKey}
                        className={`p-2 rounded-lg border ${
                          isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/10'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 uppercase block">{varKey}</span>
                        <span className="font-bold text-sky-500">
                          {typeof varVal === 'object' ? JSON.stringify(varVal) : String(varVal)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}
