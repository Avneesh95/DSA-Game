import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw,
  Sparkles, Layers, Code2, Eye, Zap, BookOpen,
  ArrowRight, CheckCircle2, ChevronRight, Sliders,
  HelpCircle, ExternalLink, RefreshCw, GitFork, GitCommit,
  Grid, Database, Binary, Share2,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useThemeStore from '../store/useThemeStore';

/* ─────────────────────────────────────────────────────────────
   COMPREHENSIVE VISUAL CONCEPTS DATA (16 CANONICAL DSA PATTERNS)
───────────────────────────────────────────────────────────── */

const VISUAL_CONCEPTS = [
  // 1. Two Pointers
  {
    id: 'two-pointers',
    title: 'Two Pointers (Pair Sum)',
    category: 'Array / String',
    badge: 'Essential Linear',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Two pointers start at opposite ends and converge inward based on comparing the current sum against the target, eliminating quadratic O(n²) checks in a single linear pass.',
    analogy: 'Two players walking toward each other on a numbered track, adjusting their pace until their combined scores equal the target.',
    defaultData: [1, 2, 4, 6, 8, 11, 15],
    target: 14,
    codeSnippets: {
      cpp: `int left = 0, right = n - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return {left, right};
    else if (sum < target) left++; // increase sum
    else right--; // decrease sum
}
return {-1, -1};`,
      java: `int left = 0, right = nums.length - 1;
while (left < right) {
    int sum = nums[left] + nums[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
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
      let left = 0, right = nums.length - 1;
      steps.push({ line: 1, left, right, sum: nums[left] + nums[right], action: `Initialize left=0 (val=${nums[left]}), right=${right} (val=${nums[right]}).`, status: 'init' });
      while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
          steps.push({ line: 4, left, right, sum, action: `Match Found! nums[${left}] (${nums[left]}) + nums[${right}] (${nums[right]}) = ${target}.`, status: 'found' });
          break;
        } else if (sum < target) {
          steps.push({ line: 5, left, right, sum, action: `Sum ${sum} < ${target}: Advance left to ${left + 1} to increase sum.`, status: 'advance' });
          left++;
        } else {
          steps.push({ line: 6, left, right, sum, action: `Sum ${sum} > ${target}: Decrement right to ${right - 1} to decrease sum.`, status: 'advance' });
          right--;
        }
      }
      return steps;
    },
    doorNumber: 9,
  },

  // 2. Fixed Sliding Window
  {
    id: 'fixed-sliding-window',
    title: 'Fixed Sliding Window (Size K)',
    category: 'Array / Window',
    badge: 'Window Optimization',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Maintains a fixed-size window of length K across an array by adding the incoming element on the right and subtracting the outgoing element on the left in O(1) time per step.',
    analogy: 'A fixed-width viewing frame moving across numbers: you only add what enters on the right and subtract what exits on the left.',
    defaultData: [2, 1, 5, 1, 3, 2],
    k: 3,
    codeSnippets: {
      cpp: `int windowSum = 0, maxSum = 0;
for (int i = 0; i < k; i++) windowSum += nums[i];
maxSum = windowSum;

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
      steps.push({ line: 2, left: 0, right: k - 1, windowSum, maxSum, action: `Initial window [0..${k-1}] sum = ${windowSum}.`, status: 'init' });
      for (let right = k; right < nums.length; right++) {
        const left = right - k + 1;
        windowSum += nums[right] - nums[right - k];
        const isNewMax = windowSum > maxSum;
        if (isNewMax) maxSum = windowSum;
        steps.push({ line: 6, left, right, windowSum, maxSum, action: `Slide window to [${left}..${right}]: -${nums[right-k]}, +${nums[right]} -> sum=${windowSum} (max=${maxSum})`, status: isNewMax ? 'new-max' : 'slide' });
      }
      return steps;
    },
    doorNumber: 8,
  },

  // 3. Variable Sliding Window
  {
    id: 'variable-sliding-window',
    title: 'Variable Sliding Window (Dynamic)',
    category: 'Array / Window',
    badge: 'Dynamic Expansion',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    summary: 'Expands the right bound to satisfy problem constraints, and shrinks the left bound when constraints are violated, tracking the optimal (min/max) valid window length.',
    analogy: 'An accordion expanding to take in new elements, then squeezing in from the left whenever capacity is exceeded.',
    defaultData: [2, 3, 1, 2, 4, 3],
    target: 7,
    codeSnippets: {
      cpp: `int left = 0, currentSum = 0, minLen = INT_MAX;
for (int right = 0; right < n; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
        minLen = min(minLen, right - left + 1);
        currentSum -= nums[left++]; // shrink left
    }
}
return minLen == INT_MAX ? 0 : minLen;`,
      java: `int left = 0, currentSum = 0, minLen = Integer.MAX_VALUE;
for (int right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        currentSum -= nums[left++];
    }
}
return minLen == Integer.MAX_VALUE ? 0 : minLen;`,
      python: `left, current_sum, min_len = 0, 0, float('inf')
for right in range(len(nums)):
    current_sum += nums[right]
    while current_sum >= target:
        min_len = min(min_len, right - left + 1)
        current_sum -= nums[left]
        left += 1
return 0 if min_len == float('inf') else min_len`,
      javascript: `let left = 0, currentSum = 0, minLen = Infinity;
for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right];
    while (currentSum >= target) {
        minLen = Math.min(minLen, right - left + 1);
        currentSum -= nums[left++];
    }
}
return minLen === Infinity ? 0 : minLen;`
    },
    generateSteps: (nums, target = 7) => {
      const steps = [];
      let left = 0, currentSum = 0, minLen = Infinity;
      steps.push({ line: 1, left: 0, right: 0, currentSum: 0, minLen: 'inf', action: `Initialize dynamic window left=0, target sum=${target}.`, status: 'init' });
      for (let right = 0; right < nums.length; right++) {
        currentSum += nums[right];
        steps.push({ line: 3, left, right, currentSum, minLen: minLen === Infinity ? 'inf' : minLen, action: `Expand right to index ${right} (+${nums[right]}). Window sum = ${currentSum}.`, status: 'expand' });
        while (currentSum >= target) {
          const curLen = right - left + 1;
          if (curLen < minLen) minLen = curLen;
          steps.push({ line: 5, left, right, currentSum, minLen, action: `Valid window [${left}..${right}] (sum=${currentSum} >= ${target}). Updated minLen = ${minLen}. Shrink left!`, status: 'shrink' });
          currentSum -= nums[left];
          left++;
        }
      }
      return steps;
    },
    doorNumber: 8,
  },

  // 4. Binary Search
  {
    id: 'binary-search',
    title: 'Binary Search (Logarithmic)',
    category: 'Searching',
    badge: 'Logarithmic Divide',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)',
    summary: 'Halves the search range in each iteration by comparing the target with the middle element in a sorted array.',
    analogy: 'Opening a dictionary right in the middle: discard the left or right half based on alphabetical comparison.',
    defaultData: [3, 8, 12, 17, 24, 31, 45, 59, 72, 88, 96],
    target: 59,
    codeSnippets: {
      cpp: `int low = 0, high = n - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
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
      let low = 0, high = nums.length - 1;
      while (low <= high) {
        const mid = low + Math.floor((high - low) / 2);
        const midVal = nums[mid];
        if (midVal === target) {
          steps.push({ line: 4, low, high, mid, midVal, action: `Match found! nums[${mid}] = ${target}. Total iterations <= log2(N).`, status: 'found' });
          break;
        } else if (midVal < target) {
          steps.push({ line: 5, low, high, mid, midVal, action: `nums[${mid}] (${midVal}) < ${target}: Discard left half [${low}..${mid}], set low = ${mid + 1}.`, status: 'shift-right' });
          low = mid + 1;
        } else {
          steps.push({ line: 6, low, high, mid, midVal, action: `nums[${mid}] (${midVal}) > ${target}: Discard right half [${mid}..${high}], set high = ${mid - 1}.`, status: 'shift-left' });
          high = mid - 1;
        }
      }
      return steps;
    },
    doorNumber: 14,
  },

  // 5. Linked List Reversal
  {
    id: 'linked-list-reversal',
    title: 'Linked List Reversal',
    category: 'Linked List',
    badge: 'Pointer Flipping',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Iteratively flips each node next pointer to point to its predecessor (prev) using three pointers: prev, curr, and next.',
    analogy: 'A chain of people holding hands where everyone turns around and holds the person behind them instead.',
    defaultData: [1, 2, 3, 4, 5],
    codeSnippets: {
      cpp: `ListNode* prev = nullptr;
ListNode* curr = head;
while (curr != nullptr) {
    ListNode* next = curr->next; // save next
    curr->next = prev;           // reverse pointer
    prev = curr;                 // advance prev
    curr = next;                 // advance curr
}
return prev; // new head`,
      java: `ListNode prev = null;
ListNode curr = head;
while (curr != null) {
    ListNode next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}
return prev;`,
      python: `prev, curr = None, head
while curr:
    next_node = curr.next
    curr.next = prev
    prev = curr
    curr = next_node
return prev`,
      javascript: `let prev = null, curr = head;
while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
}
return prev;`
    },
    generateSteps: (data) => {
      const steps = [];
      steps.push({ line: 1, prev: null, curr: 0, next: 1, action: 'Initialize prev = null, curr = Node(1).', status: 'init' });
      for (let i = 0; i < data.length; i++) {
        const prevIdx = i === 0 ? null : i - 1;
        const nextIdx = i < data.length - 1 ? i + 1 : null;
        steps.push({
          line: 5,
          prev: prevIdx,
          curr: i,
          next: nextIdx,
          action: `At Node(${data[i]}): Save next = ${nextIdx !== null ? data[nextIdx] : 'null'}, flip pointer curr.next -> ${prevIdx !== null ? data[prevIdx] : 'null'}, advance prev to ${data[i]}.`,
          status: 'reverse'
        });
      }
      steps.push({ line: 8, prev: data.length - 1, curr: null, next: null, action: `Reversal complete! New head is Node(${data[data.length - 1]}).`, status: 'done' });
      return steps;
    },
    doorNumber: 16,
  },

  // 6. Fast & Slow Pointers
  {
    id: 'fast-slow-pointers',
    title: 'Fast & Slow Pointers (Cycle Detection)',
    category: 'Linked List',
    badge: 'Floyd Tortoise & Hare',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Slow pointer moves 1 step while fast pointer moves 2 steps. If a cycle exists, the fast pointer will inevitably lap and meet the slow pointer.',
    analogy: 'Two runners on a circular running track running at 1x and 2x speeds: the faster runner will always catch up from behind.',
    defaultData: [1, 2, 3, 4, 5, 6],
    codeSnippets: {
      cpp: `ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;          // 1 step
    fast = fast->next->next;    // 2 steps
    if (slow == fast) return true; // cycle confirmed!
}
return false;`,
      java: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;`,
      python: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        return True
return False`,
      javascript: `let slow = head, fast = head;
while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
}
return false;`
    },
    generateSteps: (data) => {
      const steps = [];
      let slow = 0, fast = 0;
      steps.push({ line: 1, slow: 0, fast: 0, action: 'Initialize slow = head (Node 1), fast = head (Node 1).', status: 'init' });
      const cycleTrack = [0, 1, 2, 3, 4, 2, 3, 4, 2]; // cycle between 2, 3, 4
      for (let step = 1; step <= 5; step++) {
        slow = (slow + 1) % 6;
        fast = (fast + 2) % 6;
        const met = slow === fast;
        steps.push({
          line: 3,
          slow,
          fast,
          action: `Step ${step}: slow advances to Node ${data[slow]}, fast advances 2 steps to Node ${data[fast]}.${met ? ' Met! Cycle detected!' : ''}`,
          status: met ? 'found' : 'step'
        });
        if (met) break;
      }
      return steps;
    },
    doorNumber: 20,
  },

  // 7. Monotonic Stack
  {
    id: 'monotonic-stack',
    title: 'Monotonic Stack (Next Greater Element)',
    category: 'Stack / LIFO',
    badge: 'Amortized O(1)',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    summary: 'Maintains elements in monotonic decreasing order. When a larger element arrives, all smaller stack elements are popped, immediately resolving their next greater element.',
    analogy: 'Taller buildings in a city skyline blocking the view of shorter buildings behind them.',
    defaultData: [4, 5, 2, 25],
    codeSnippets: {
      cpp: `vector<int> res(n, -1);
stack<int> st; // stores indices
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > nums[st.top()]) {
        res[st.top()] = nums[i]; // resolved!
        st.pop();
    }
    st.push(i);
}
return res;`,
      java: `int[] res = new int[nums.length];
Arrays.fill(res, -1);
Stack<Integer> st = new Stack<>();
for (int i = 0; i < nums.length; i++) {
    while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
        res[st.pop()] = nums[i];
    }
    st.push(i);
}
return res;`,
      python: `res = [-1] * len(nums)
stack = [] # stores indices
for i, x in enumerate(nums):
    while stack and x > nums[stack[-1]]:
        res[stack.pop()] = x
    stack.append(i)
return res`,
      javascript: `const res = new Array(nums.length).fill(-1);
const stack = [];
for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
        res[stack.pop()] = nums[i];
    }
    stack.push(i);
}
return res;`
    },
    generateSteps: (nums) => {
      const steps = [];
      const res = new Array(nums.length).fill(-1);
      const stack = [];
      steps.push({ line: 1, i: -1, stack: [], res: [...res], action: 'Initialize empty stack and result array with -1.', status: 'init' });
      for (let i = 0; i < nums.length; i++) {
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
          const popped = stack.pop();
          res[popped] = nums[i];
          steps.push({ line: 5, i, stack: [...stack], res: [...res], action: `nums[${i}] (${nums[i]}) > nums[${popped}] (${nums[popped]}): Pop ${popped}, set res[${popped}] = ${nums[i]}.`, status: 'pop' });
        }
        stack.push(i);
        steps.push({ line: 8, i, stack: [...stack], res: [...res], action: `Push index ${i} (val=${nums[i]}) onto monotonic stack.`, status: 'push' });
      }
      return steps;
    },
    doorNumber: 23,
  },

  // 8. Queue & BFS
  {
    id: 'queue-bfs',
    title: 'Queue & Level-Order BFS',
    category: 'Queue / BFS',
    badge: 'Breadth Level Search',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    summary: 'Explores neighbors level-by-level in First-In-First-Out (FIFO) order using a queue, guaranteeing the shortest path in unweighted structures.',
    analogy: 'Ripples expanding evenly outwards in concentric circles when a pebble is dropped in a pond.',
    defaultData: [1, 2, 3, 4, 5, 6, 7],
    codeSnippets: {
      cpp: `queue<TreeNode*> q;
q.push(root);
while (!q.empty()) {
    int levelSize = q.size();
    for (int i = 0; i < levelSize; i++) {
        TreeNode* node = q.front(); q.pop();
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`,
      java: `Queue<TreeNode> q = new LinkedList<>();
q.offer(root);
while (!q.isEmpty()) {
    int levelSize = q.size();
    for (int i = 0; i < levelSize; i++) {
        TreeNode node = q.poll();
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
}`,
      python: `from collections import deque
q = deque([root])
while q:
    for _ in range(len(q)):
        node = q.popleft()
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)`,
      javascript: `const q = [root];
while (q.length) {
    const levelSize = q.length;
    for (let i = 0; i < levelSize; i++) {
        const node = q.shift();
        if (node.left) q.push(node.left);
        if (node.right) q.push(node.right);
    }
}`
    },
    generateSteps: (data) => {
      const steps = [];
      const q = [1];
      steps.push({ line: 2, q: [1], level: 1, current: 1, action: 'Push root node 1 to FIFO queue.', status: 'init' });
      steps.push({ line: 6, q: [2, 3], level: 1, current: 1, action: 'Dequeue node 1, enqueue its children 2 and 3.', status: 'step' });
      steps.push({ line: 6, q: [3, 4, 5], level: 2, current: 2, action: 'Dequeue node 2, enqueue its children 4 and 5.', status: 'step' });
      steps.push({ line: 6, q: [4, 5, 6, 7], level: 2, current: 3, action: 'Dequeue node 3, enqueue its children 6 and 7.', status: 'step' });
      steps.push({ line: 8, q: [], level: 3, current: '4,5,6,7', action: 'Level 3 processed. All nodes visited in level order.', status: 'done' });
      return steps;
    },
    doorNumber: 30,
  },

  // 9. Binary Tree DFS
  {
    id: 'binary-tree-dfs',
    title: 'Binary Tree DFS (Inorder / Preorder)',
    category: 'Tree / DFS',
    badge: 'Recursive Subtree',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h)',
    summary: 'Traverses subtrees deeply before backtracking, systematically visiting left child, root, and right child.',
    analogy: 'Exploring a maze by following every path to its end before retracing steps back to the last fork in the road.',
    defaultData: [1, 2, 3, 4, 5],
    codeSnippets: {
      cpp: `void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);  // visit Left
    res.push_back(root->val);  // visit Root
    inorder(root->right, res); // visit Right
}`,
      java: `void inorder(TreeNode root, List<Integer> res) {
    if (root == null) return;
    inorder(root.left, res);
    res.add(root.val);
    inorder(root.right, res);
}`,
      python: `def inorder(root, res):
    if not root:
        return
    inorder(root.left, res)
    res.append(root.val)
    inorder(root.right, res)`,
      javascript: `function inorder(root, res = []) {
    if (!root) return res;
    inorder(root.left, res);
    res.push(root.val);
    inorder(root.right, res);
    return res;
}`
    },
    generateSteps: () => {
      return [
        { line: 1, node: 1, callStack: ['inorder(1)'], res: [], action: 'Call inorder(1). Recurse left to node 2.', status: 'call' },
        { line: 3, node: 2, callStack: ['inorder(1)', 'inorder(2)'], res: [], action: 'Call inorder(2). Recurse left to node 4.', status: 'call' },
        { line: 4, node: 4, callStack: ['inorder(1)', 'inorder(2)', 'inorder(4)'], res: [4], action: 'Node 4 has no left child. Visit node 4 -> res: [4].', status: 'visit' },
        { line: 4, node: 2, callStack: ['inorder(1)', 'inorder(2)'], res: [4, 2], action: 'Backtrack to node 2. Visit node 2 -> res: [4, 2]. Recurse right to node 5.', status: 'visit' },
        { line: 4, node: 5, callStack: ['inorder(1)', 'inorder(5)'], res: [4, 2, 5], action: 'Visit node 5 -> res: [4, 2, 5]. Backtrack to root.', status: 'visit' },
        { line: 4, node: 1, callStack: ['inorder(1)'], res: [4, 2, 5, 1], action: 'Visit root node 1 -> res: [4, 2, 5, 1]. Recurse right to node 3.', status: 'visit' },
        { line: 4, node: 3, callStack: [], res: [4, 2, 5, 1, 3], action: 'Visit node 3 -> Final Inorder traversal: [4, 2, 5, 1, 3]! Complete.', status: 'done' },
      ];
    },
    doorNumber: 24,
  },

  // 10. Graph Traversal (DFS/BFS)
  {
    id: 'graph-traversal',
    title: 'Graph Traversal & Visited Set',
    category: 'Graph',
    badge: 'Cycle Prevention',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    summary: 'Traverses vertices and edges while maintaining a Visited Set to avoid infinite cycles in arbitrary graphs.',
    analogy: 'Leaving breadcrumb markers at every visited room in a dungeon to ensure you never walk in circles.',
    defaultData: ['A', 'B', 'C', 'D', 'E'],
    codeSnippets: {
      cpp: `unordered_set<int> visited;
void dfs(int u, vector<vector<int>>& adj) {
    visited.insert(u);
    for (int v : adj[u]) {
        if (!visited.count(v)) {
            dfs(v, adj);
        }
    }
}`,
      java: `Set<Integer> visited = new HashSet<>();
void dfs(int u, List<List<Integer>> adj) {
    visited.add(u);
    for (int v : adj.get(u)) {
        if (!visited.contains(v)) {
            dfs(v, adj);
        }
    }
}`,
      python: `visited = set()
def dfs(u, adj):
    visited.add(u)
    for v in adj[u]:
        if v not in visited:
            dfs(v, adj)`,
      javascript: `const visited = new Set();
function dfs(u, adj) {
    visited.add(u);
    for (const v of adj[u]) {
        if (!visited.has(v)) dfs(v, adj);
    }
}`
    },
    generateSteps: () => {
      return [
        { line: 2, current: 'A', visited: ['A'], action: 'Visit starting vertex A. Add A to visited set.', status: 'visit' },
        { line: 4, current: 'B', visited: ['A', 'B'], action: 'Follow edge A -> B. Add B to visited set.', status: 'visit' },
        { line: 4, current: 'C', visited: ['A', 'B', 'C'], action: 'Follow edge B -> C. Add C to visited set.', status: 'visit' },
        { line: 4, current: 'D', visited: ['A', 'B', 'C', 'D'], action: 'Follow edge A -> D. Add D to visited set.', status: 'visit' },
        { line: 6, current: 'D', visited: ['A', 'B', 'C', 'D'], action: 'Inspect edge D -> A: A already in visited set! Skip cycle.', status: 'skip' },
        { line: 8, current: 'E', visited: ['A', 'B', 'C', 'D', 'E'], action: 'Follow edge D -> E. All reachable components visited!', status: 'done' },
      ];
    },
    doorNumber: 81,
  },

  // 11. Dynamic Programming (0/1 Knapsack)
  {
    id: 'dp-knapsack',
    title: 'Dynamic Programming (Knapsack & Grid DP)',
    category: 'Dynamic Programming',
    badge: 'Optimal Substructure',
    timeComplexity: 'O(N * W)',
    spaceComplexity: 'O(N * W)',
    summary: 'Builds a 2D/1D table where each cell dp[i][w] stores the optimal solution by choosing between including or excluding the current item.',
    analogy: 'Solving a puzzle by writing down solutions to sub-puzzles in a ledger so you never re-compute the same sub-problem.',
    defaultData: [1, 2, 3],
    target: 5,
    codeSnippets: {
      cpp: `vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
        if (wt[i-1] <= w) {
            dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]);
        } else {
            dp[i][w] = dp[i-1][w];
        }
    }
}
return dp[n][W];`,
      java: `int[][] dp = new int[n + 1][W + 1];
for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
        if (wt[i-1] <= w) {
            dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]);
        } else {
            dp[i][w] = dp[i-1][w];
        }
    }
}
return dp[n][W];`,
      python: `dp = [[0] * (W + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for w in range(1, W + 1):
        if wt[i-1] <= w:
            dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])
        else:
            dp[i][w] = dp[i-1][w]
return dp[n][W]`,
      javascript: `const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
        if (wt[i-1] <= w) {
            dp[i][w] = Math.max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]);
        } else {
            dp[i][w] = dp[i-1][w];
        }
    }
}
return dp[n][W];`
    },
    generateSteps: () => {
      return [
        { line: 1, i: 0, w: 0, val: 0, action: 'Initialize DP table: dp[0][w] = 0 (base case with 0 items).', status: 'init' },
        { line: 4, i: 1, w: 2, val: 10, action: 'Item 1 (wt=2, val=10): At capacity w=2 -> dp[1][2] = max(0, 10 + dp[0][0]) = 10.', status: 'step' },
        { line: 4, i: 2, w: 3, val: 15, action: 'Item 2 (wt=3, val=15): At capacity w=3 -> dp[2][3] = max(10, 15 + dp[1][0]) = 15.', status: 'step' },
        { line: 4, i: 2, w: 5, val: 25, action: 'Item 2 at capacity w=5: Include item 2 (val 15) + dp[1][2] (val 10) = 25! dp[2][5] = 25.', status: 'new-max' },
        { line: 8, i: 3, w: 5, val: 25, action: 'Final cell dp[3][5] = 25. Optimal maximum value achieved!', status: 'done' },
      ];
    },
    doorNumber: 84,
  },

  // 12. Kadane's Algorithm
  {
    id: 'kadanes-algorithm',
    title: "Kadane's Algorithm (Max Subarray)",
    category: 'Dynamic Programming',
    badge: 'Contiguous Sum',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Determines in a single pass whether to extend the existing contiguous subarray or restart from scratch if currentSum becomes negative.',
    analogy: 'If accumulated debt is worse than zero, drop the past and start fresh.',
    defaultData: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    codeSnippets: {
      cpp: `int currentSum = nums[0], maxSum = nums[0];
for (int i = 1; i < n; i++) {
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
      python: `current_sum = max_sum = nums[0]
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
      let currentSum = nums[0], maxSum = nums[0];
      steps.push({ line: 1, i: 0, currentSum, maxSum, action: `Initialize currentSum = ${currentSum}, maxSum = ${maxSum}.`, status: 'init' });
      for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        const isNewMax = currentSum > maxSum;
        if (isNewMax) maxSum = currentSum;
        steps.push({ line: 3, i, currentSum, maxSum, action: `At nums[${i}] (${nums[i]}): currentSum = ${currentSum}, global maxSum = ${maxSum} ${isNewMax ? '(New Peak!)' : ''}`, status: isNewMax ? 'new-max' : 'step' });
      }
      return steps;
    },
    doorNumber: 4,
  },

  // 13. Dutch National Flag
  {
    id: 'dutch-flag',
    title: 'Dutch National Flag (0s, 1s, 2s)',
    category: 'Array / Sorting',
    badge: 'In-Place Partition',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    summary: 'Partitions an array of 3 distinct keys (0s, 1s, 2s) in a single linear pass using three pointers (low, mid, high).',
    analogy: 'Sorting colored marbles into Red, White, and Blue buckets in a single pass without extra bins.',
    defaultData: [2, 0, 2, 1, 1, 0],
    codeSnippets: {
      cpp: `int low = 0, mid = 0, high = n - 1;
while (mid <= high) {
    if (nums[mid] == 0) swap(nums[low++], nums[mid++]);
    else if (nums[mid] == 1) mid++;
    else swap(nums[mid], nums[high--]);
}`,
      java: `int low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
    if (nums[mid] == 0) swap(nums, low++, mid++);
    else if (nums[mid] == 1) mid++;
    else swap(nums, mid, high--);
}`,
      python: `low, mid, high = 0, 0, len(nums) - 1
while mid <= high:
    if nums[mid] == 0:
        nums[low], nums[mid] = nums[mid], nums[low]
        low += 1; mid += 1
    elif nums[mid] == 1:
        mid += 1
    else:
        nums[mid], nums[high] = nums[high], nums[mid]
        high -= 1`,
      javascript: `let low = 0, mid = 0, high = nums.length - 1;
while (mid <= high) {
    if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }
    else if (nums[mid] === 1) { mid++; }
    else { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }
}`
    },
    generateSteps: (inputNums) => {
      const nums = [...inputNums];
      const steps = [];
      let low = 0, mid = 0, high = nums.length - 1;
      steps.push({ line: 1, nums: [...nums], low, mid, high, action: `Initialize low=0, mid=0, high=${high}.`, status: 'init' });
      while (mid <= high) {
        if (nums[mid] === 0) {
          [nums[low], nums[mid]] = [nums[mid], nums[low]];
          steps.push({ line: 3, nums: [...nums], low, mid, high, action: `nums[mid]==0: Swap nums[low=${low}] and nums[mid=${mid}]. Advance low to ${low+1}, mid to ${mid+1}.`, status: 'swap-0' });
          low++; mid++;
        } else if (nums[mid] === 1) {
          steps.push({ line: 4, nums: [...nums], low, mid, high, action: `nums[mid]==1: Already in middle bucket. Advance mid to ${mid+1}.`, status: 'skip-1' });
          mid++;
        } else {
          [nums[mid], nums[high]] = [nums[high], nums[mid]];
          steps.push({ line: 5, nums: [...nums], low, mid, high, action: `nums[mid]==2: Swap nums[mid=${mid}] and nums[high=${high}]. Decrement high to ${high-1}.`, status: 'swap-2' });
          high--;
        }
      }
      return steps;
    },
    doorNumber: 5,
  },

  // 14. Backtracking & Subsets
  {
    id: 'backtracking',
    title: 'Backtracking (Subsets & Combinations)',
    category: 'Recursion',
    badge: 'State Exploration',
    timeComplexity: 'O(2^n)',
    spaceComplexity: 'O(n)',
    summary: 'Systematically explores a decision tree by choosing an element, recursing down the branch, and then undoing the choice (backtrack) to explore the alternative.',
    analogy: 'Navigating a choose-your-own-adventure story: try a decision path, then turn back to the bookmark to try another.',
    defaultData: [1, 2, 3],
    codeSnippets: {
      cpp: `void backtrack(int start, vector<int>& curr, vector<int>& nums) {
    res.push_back(curr);
    for (int i = start; i < nums.size(); i++) {
        curr.push_back(nums[i]);      // choose
        backtrack(i + 1, curr, nums); // explore
        curr.pop_back();              // unchoose / backtrack
    }
}`,
      java: `void backtrack(int start, List<Integer> curr, int[] nums) {
    res.add(new ArrayList<>(curr));
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(i + 1, curr, nums);
        curr.remove(curr.size() - 1);
    }
}`,
      python: `def backtrack(start, curr):
    res.append(list(curr))
    for i in range(start, len(nums)):
        curr.append(nums[i])      # choose
        backtrack(i + 1, curr)    # explore
        curr.pop()                # backtrack`,
      javascript: `function backtrack(start, curr = []) {
    res.push([...curr]);
    for (let i = start; i < nums.length; i++) {
        curr.push(nums[i]);
        backtrack(i + 1, curr);
        curr.pop();
    }
}`
    },
    generateSteps: () => {
      return [
        { line: 2, curr: [], resCount: 1, action: 'Root state: Add empty subset [] -> res: [ [] ]', status: 'visit' },
        { line: 4, curr: [1], resCount: 2, action: 'Choose 1: Explore branch with curr=[1] -> res: [ [], [1] ]', status: 'choose' },
        { line: 4, curr: [1, 2], resCount: 3, action: 'Choose 2: Explore branch with curr=[1, 2] -> res: [ ..., [1, 2] ]', status: 'choose' },
        { line: 6, curr: [1], resCount: 3, action: 'Backtrack: Pop 2 from curr, returning to curr=[1].', status: 'backtrack' },
        { line: 4, curr: [1, 3], resCount: 4, action: 'Choose 3: Explore branch with curr=[1, 3] -> res: [ ..., [1, 3] ]', status: 'choose' },
        { line: 6, curr: [], resCount: 4, action: 'Backtrack: Pop 3 and 1, explore branch starting with 2 -> Complete!', status: 'done' },
      ];
    },
    doorNumber: 87,
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN VISUAL CONCEPTS PAGE COMPONENT
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
        <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-sky-50/90 via-violet-50/40 to-white border-sky-200/70 shadow-[0_4px_24px_rgba(14,165,233,0.08)]'
            : 'bg-gradient-to-r from-[#0c1924] via-[#1c1c1e] to-[#161618] border-sky-500/30 shadow-[0_4px_32px_rgba(14,165,233,0.12)]'
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
                  14+ Interactive Blueprint Simulators
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                Master Every DSA Pattern <span className="text-sky-500">Visually with Code</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Step through foundational algorithms line-by-line: Two Pointers, Dynamic Sliding Window, Binary Trees, Graphs, DP Tables, Stacks, Queues, and more.
              </p>
            </div>

            {concept.doorNumber && (
              <button
                onClick={() => navigate(`/door/${concept.doorNumber}`)}
                className="shrink-0 px-4 py-2.5 rounded-xl font-mono font-semibold text-xs text-black bg-gradient-to-r from-[#ff9500] to-amber-400 hover:brightness-110 shadow-md transition-all flex items-center gap-2 group hover:-translate-y-0.5"
              >
                <span>Solve in Dungeon (Door {concept.doorNumber})</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* ── Pattern Category Pills ── */}
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

        {/* ── Main Interactive View ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* LEFT: Visual Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[380px] ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              
              {/* Header */}
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

              {/* Dynamic Visual Stage */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 px-2 min-h-[160px]">
                
                {/* 1. ARRAY RENDERING */}
                {Array.isArray(concept.defaultData) && !['monotonic-stack', 'linked-list-reversal', 'binary-tree-dfs', 'graph-traversal', 'dp-knapsack'].includes(concept.id) && (
                  <div className="flex flex-wrap gap-2 justify-center items-end py-4 max-w-full">
                    {concept.defaultData.map((val, idx) => {
                      const isLeft = currentStep.left === idx || currentStep.low === idx;
                      const isRight = currentStep.right === idx || currentStep.high === idx;
                      const isMid = currentStep.mid === idx;
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
                      } else if (inWindow) {
                        borderColor = '#a855f7';
                        bgColor = 'rgba(168, 85, 247, 0.15)';
                      }

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <div className="h-5 flex items-center justify-center">
                            {isMid && <span className="text-[10px] font-mono px-1 rounded bg-sky-500 text-white font-bold">mid</span>}
                            {isLeft && !isMid && <span className="text-[10px] font-mono px-1 rounded bg-amber-500 text-black font-bold">L</span>}
                            {isRight && !isMid && <span className="text-[10px] font-mono px-1 rounded bg-amber-500 text-black font-bold">R</span>}
                          </div>

                          <motion.div
                            animate={{ scale: isMid || isLeft || isRight ? 1.15 : 1, borderColor, backgroundColor: bgColor }}
                            className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl border-2 flex items-center justify-center font-mono text-sm sm:text-base font-bold shadow-sm"
                            style={{ color: textColor }}
                          >
                            {currentStep.nums ? currentStep.nums[idx] : val}
                          </motion.div>
                          <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. LINKED LIST NODES */}
                {concept.id === 'linked-list-reversal' && (
                  <div className="flex flex-wrap items-center gap-2 py-4">
                    {concept.defaultData.map((val, idx) => {
                      const isCurr = currentStep.curr === idx;
                      const isPrev = currentStep.prev === idx;
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-mono font-bold text-amber-500">
                              {isCurr ? 'curr' : isPrev ? 'prev' : ''}
                            </span>
                            <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-mono font-bold ${
                              isCurr ? 'bg-sky-500/20 border-sky-500 text-sky-500 scale-110' : isPrev ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-100 dark:bg-black/30 border-slate-300 dark:border-white/10'
                            }`}>
                              {val}
                            </div>
                          </div>
                          {idx < concept.defaultData.length - 1 && <span className="text-violet-500 font-bold font-mono text-sm">→</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. STACK RENDERING */}
                {concept.id === 'monotonic-stack' && (
                  <div className="flex flex-col sm:flex-row items-center gap-8 py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-mono text-slate-400 mb-2">Input Elements</span>
                      <div className="flex gap-2">
                        {concept.defaultData.map((val, idx) => (
                          <div key={idx} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono font-bold ${currentStep.i === idx ? 'bg-sky-500/20 border-sky-500 text-sky-500' : 'bg-slate-100 dark:bg-black/30 border-slate-300'}`}>
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="text-[11px] font-mono text-slate-400 mb-2">Monotonic Stack</span>
                      <div className="w-24 min-h-[90px] rounded-b-2xl border-2 border-t-0 p-2 flex flex-col-reverse gap-1.5 items-center bg-black/20">
                        {currentStep.stack && currentStep.stack.length > 0 ? (
                          currentStep.stack.map((idxVal, sIdx) => (
                            <div key={sIdx} className="w-full py-1 text-center font-mono text-xs font-bold rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-500">
                              idx {idxVal}
                            </div>
                          ))
                        ) : <span className="text-[11px] font-mono text-slate-400 my-auto">empty</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TREE & GRAPH & DP VISUALS */}
                {['binary-tree-dfs', 'graph-traversal', 'dp-knapsack'].includes(concept.id) && (
                  <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/5 text-center font-mono text-xs">
                    <div className="flex items-center justify-center gap-2 mb-2 font-bold text-sky-500">
                      <Layers size={16} /> Active State: {currentStep.status?.toUpperCase()}
                    </div>
                    {currentStep.res && <p className="text-slate-300">Visited Order: [{currentStep.res.join(', ')}]</p>}
                    {currentStep.visited && <p className="text-slate-300">Visited Set: {'{'}{currentStep.visited.join(', ')}{'}'}</p>}
                    {currentStep.w !== undefined && <p className="text-slate-300">Table Cell: dp[{currentStep.i}][{currentStep.w}] = {currentStep.val}</p>}
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

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] mt-4">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setStepIndex(0); setIsPlaying(false); }} className="p-2 rounded-lg border hover:bg-slate-100 dark:hover:bg-white/5"><RotateCcw size={14} /></button>
                  <button onClick={() => { setStepIndex(i => Math.max(0, i - 1)); setIsPlaying(false); }} disabled={stepIndex === 0} className="p-2 rounded-lg border disabled:opacity-40"><SkipBack size={14} /></button>
                  <button onClick={() => setIsPlaying(p => !p)} className="px-4 py-2 rounded-lg font-mono font-semibold text-xs flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button onClick={() => { setStepIndex(i => Math.min(steps.length - 1, i + 1)); setIsPlaying(false); }} disabled={stepIndex === steps.length - 1} className="p-2 rounded-lg border disabled:opacity-40"><SkipForward size={14} /></button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Speed:</span>
                  {[0.5, 1, 2].map((s) => (
                    <button key={s} onClick={() => setSpeed(s)} className={`px-2 py-0.5 rounded ${speed === s ? 'bg-sky-500/20 text-sky-500 font-bold border border-sky-500/30' : 'hover:text-slate-200'}`}>
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Intuition Card */}
            <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              <h4 className="font-display text-sm font-bold flex items-center gap-2">
                <BookOpen size={14} className="text-sky-500" />
                <span>Intuition & Real-World Analogy</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{concept.summary}</p>
              <div className={`p-3 rounded-xl border text-xs italic ${
                isLight ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-sky-950/30 border-sky-500/30 text-sky-200'
              }`}>
                &quot;{concept.analogy}&quot;
              </div>
            </div>
          </div>

          {/* RIGHT: Multi-Language Code (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`rounded-2xl border overflow-hidden flex flex-col h-full ${
              isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/10'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Code2 size={15} className="text-sky-500" />
                  <span>Executable Implementation</span>
                </div>

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

              {/* Code */}
              <div className="p-4 font-mono text-xs overflow-x-auto flex-1 leading-relaxed bg-slate-900 text-slate-100">
                <pre>
                  {concept.codeSnippets[selectedLang].split('\n').map((codeLine, lineIdx) => (
                    <div key={lineIdx} className={`flex items-center gap-3 px-2 py-0.5 rounded ${currentStep.line === lineIdx + 1 ? 'bg-sky-500/30 border-l-2 border-sky-400 text-sky-200 font-bold' : 'text-slate-300'}`}>
                      <span className="text-[10px] text-slate-600 select-none w-5 text-right font-mono">{lineIdx + 1}</span>
                      <code className="whitespace-pre">{codeLine}</code>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Live Variables */}
              <div className={`p-4 border-t ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/10'
              }`}>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-semibold">
                  Live Variables State
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {Object.entries(currentStep)
                    .filter(([k]) => !['line', 'action', 'status', 'nums'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} className={`p-2 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-black/40 border-white/10'}`}>
                        <span className="text-[10px] text-slate-400 uppercase block">{k}</span>
                        <span className="font-bold text-sky-500">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
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
