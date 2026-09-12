/**
 * NeetCode 150 Curated Problem List
 * All 150 canonical problems categorized by the 18 standard roadmap tracks.
 * Mapped to existing playable Door numbers where available.
 */

export const NEETCODE_TRACKS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
];

export const NEETCODE_150_PROBLEMS = [
  // ── 1. Arrays & Hashing (9 problems) ──
  { id: 1, title: 'Contains Duplicate', difficulty: 'Easy', track: 'Arrays & Hashing', pattern: 'Hash Set', doorNumber: 5, leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
  { id: 2, title: 'Valid Anagram', difficulty: 'Easy', track: 'Arrays & Hashing', pattern: 'Frequency Counter', doorNumber: 15, leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 3, title: 'Two Sum', difficulty: 'Easy', track: 'Arrays & Hashing', pattern: 'Hash Map Lookup', doorNumber: 3, leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
  { id: 4, title: 'Group Anagrams', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Categorization Hash', doorNumber: 16, leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Bucket Sort / Min-Heap', doorNumber: 43, leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 6, title: 'Product of Array Except Self', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Prefix & Suffix Products', doorNumber: 8, leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 7, title: 'Valid Sudoku', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Hash Sets per Row/Col/Box', doorNumber: 27, leetcodeUrl: 'https://leetcode.com/problems/valid-sudoku/' },
  { id: 8, title: 'Encode and Decode Strings', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Delimiter Length Encoding', doorNumber: 17, leetcodeUrl: 'https://leetcode.com/problems/encode-and-decode-strings/' },
  { id: 9, title: 'Longest Consecutive Sequence', difficulty: 'Medium', track: 'Arrays & Hashing', pattern: 'Hash Set Streak', doorNumber: 10, leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/' },

  // ── 2. Two Pointers (5 problems) ──
  { id: 10, title: 'Valid Palindrome', difficulty: 'Easy', track: 'Two Pointers', pattern: 'Two Pointers Converging', doorNumber: 11, leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 11, title: 'Two Sum II Input Array Is Sorted', difficulty: 'Medium', track: 'Two Pointers', pattern: 'Two Pointers Inward', doorNumber: 12, leetcodeUrl: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
  { id: 12, title: '3Sum', difficulty: 'Medium', track: 'Two Pointers', pattern: 'Sort + Two Pointers', doorNumber: 13, leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
  { id: 13, title: 'Container With Most Water', difficulty: 'Medium', track: 'Two Pointers', pattern: 'Greedy Two Pointers', doorNumber: 14, leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 14, title: 'Trapping Rain Water', difficulty: 'Hard', track: 'Two Pointers', pattern: 'Two Pointers Prefix Max', doorNumber: 18, leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },

  // ── 3. Sliding Window (6 problems) ──
  { id: 15, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', track: 'Sliding Window', pattern: 'Single Pass Min So Far', doorNumber: 4, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 16, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', track: 'Sliding Window', pattern: 'Dynamic Sliding Window', doorNumber: 19, leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 17, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', track: 'Sliding Window', pattern: 'Max Frequency Window', doorNumber: 20, leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
  { id: 18, title: 'Permutation in String', difficulty: 'Medium', track: 'Sliding Window', pattern: 'Fixed Size Frequency Match', doorNumber: 21, leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/' },
  { id: 19, title: 'Minimum Window Substring', difficulty: 'Hard', track: 'Sliding Window', pattern: 'Expand/Contract Window', doorNumber: 22, leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
  { id: 20, title: 'Sliding Window Maximum', difficulty: 'Hard', track: 'Sliding Window', pattern: 'Monotonic Deque', doorNumber: 26, leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },

  // ── 4. Stack (7 problems) ──
  { id: 21, title: 'Valid Parentheses', difficulty: 'Easy', track: 'Stack', pattern: 'LIFO Matching', doorNumber: 2, leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 22, title: 'Min Stack', difficulty: 'Medium', track: 'Stack', pattern: 'Auxiliary Min Stack', doorNumber: 23, leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
  { id: 23, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', track: 'Stack', pattern: 'Operand Stack', doorNumber: 24, leetcodeUrl: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
  { id: 24, title: 'Generate Parentheses', difficulty: 'Medium', track: 'Stack', pattern: 'Backtracking Stack', doorNumber: 25, leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/' },
  { id: 25, title: 'Daily Temperatures', difficulty: 'Medium', track: 'Stack', pattern: 'Monotonic Decreasing Stack', doorNumber: 7, leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/' },
  { id: 26, title: 'Car Fleet', difficulty: 'Medium', track: 'Stack', pattern: 'Sort + Stack Time Collision', doorNumber: 28, leetcodeUrl: 'https://leetcode.com/problems/car-fleet/' },
  { id: 27, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', track: 'Stack', pattern: 'Monotonic Increasing Stack', doorNumber: 29, leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },

  // ── 5. Binary Search (7 problems) ──
  { id: 28, title: 'Binary Search', difficulty: 'Easy', track: 'Binary Search', pattern: 'Classic Divide & Conquer', doorNumber: 6, leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
  { id: 29, title: 'Search a 2D Matrix', difficulty: 'Medium', track: 'Binary Search', pattern: 'Flattened 2D Search', doorNumber: 30, leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/' },
  { id: 30, title: 'Koko Eating Bananas', difficulty: 'Medium', track: 'Binary Search', pattern: 'Binary Search on Answer Space', doorNumber: 31, leetcodeUrl: 'https://leetcode.com/problems/koko-eating-bananas/' },
  { id: 31, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', track: 'Binary Search', pattern: 'Rotated Inflection Point', doorNumber: 32, leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { id: 32, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', track: 'Binary Search', pattern: 'Sorted Half Identification', doorNumber: 33, leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
  { id: 33, title: 'Time Based Key-Value Store', difficulty: 'Medium', track: 'Binary Search', pattern: 'Timestamp Binary Search', doorNumber: 34, leetcodeUrl: 'https://leetcode.com/problems/time-based-key-value-store/' },
  { id: 34, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', track: 'Binary Search', pattern: 'Binary Search on Partition', doorNumber: 35, leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },

  // ── 6. Linked List (11 problems) ──
  { id: 35, title: 'Reverse Linked List', difficulty: 'Easy', track: 'Linked List', pattern: 'In-Place Pointer Reversal', doorNumber: 36, leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 36, title: 'Merge Two Sorted Lists', difficulty: 'Easy', track: 'Linked List', pattern: 'Dummy Head Merging', doorNumber: 37, leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 37, title: 'Reorder List', difficulty: 'Medium', track: 'Linked List', pattern: 'Find Mid + Reverse + Interleave', doorNumber: 38, leetcodeUrl: 'https://leetcode.com/problems/reorder-list/' },
  { id: 38, title: 'Remove Nth Node From End of List', difficulty: 'Medium', track: 'Linked List', pattern: 'Fast & Slow Gap Pointer', doorNumber: 39, leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 39, title: 'Copy List with Random Pointer', difficulty: 'Medium', track: 'Linked List', pattern: 'Hash Map / Interweaving Nodes', doorNumber: 40, leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { id: 40, title: 'Add Two Numbers', difficulty: 'Medium', track: 'Linked List', pattern: 'Elementary Math Carry', doorNumber: 41, leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/' },
  { id: 41, title: 'Linked List Cycle', difficulty: 'Easy', track: 'Linked List', pattern: 'Floyd’s Tortoise & Hare', doorNumber: 9, leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 42, title: 'Find the Duplicate Number', difficulty: 'Medium', track: 'Linked List', pattern: 'Cycle Detection on Array', doorNumber: 42, leetcodeUrl: 'https://leetcode.com/problems/find-the-duplicate-number/' },
  { id: 43, title: 'LRU Cache', difficulty: 'Medium', track: 'Linked List', pattern: 'Doubly Linked List + Hash Map', doorNumber: 44, leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
  { id: 44, title: 'Merge k Sorted Lists', difficulty: 'Hard', track: 'Linked List', pattern: 'Divide & Conquer / Min-Heap', doorNumber: 45, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { id: 45, title: 'Reverse Nodes in k-Group', difficulty: 'Hard', track: 'Linked List', pattern: 'Recursive / Iterative Segment Reversal', doorNumber: 46, leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },

  // ── 7. Trees (15 problems) ──
  { id: 46, title: 'Invert Binary Tree', difficulty: 'Easy', track: 'Trees', pattern: 'DFS Recursive Swap', doorNumber: 47, leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 47, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', track: 'Trees', pattern: 'DFS / BFS Level Order', doorNumber: 48, leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 48, title: 'Diameter of Binary Tree', difficulty: 'Easy', track: 'Trees', pattern: 'Post-Order Depth Aggregation', doorNumber: 49, leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { id: 49, title: 'Balanced Binary Tree', difficulty: 'Easy', track: 'Trees', pattern: 'Bottom-Up Height Check', doorNumber: 50, leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/' },
  { id: 50, title: 'Same Tree', difficulty: 'Easy', track: 'Trees', pattern: 'Structural Equivalence DFS', doorNumber: 51, leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
  { id: 51, title: 'Subtree of Another Tree', difficulty: 'Easy', track: 'Trees', pattern: 'Tree Matching DFS', doorNumber: 52, leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/' },
  { id: 52, title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', track: 'Trees', pattern: 'BST Split Point Traversal', doorNumber: 53, leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { id: 53, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', track: 'Trees', pattern: 'Queue BFS Level by Level', doorNumber: 54, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 54, title: 'Binary Tree Right Side View', difficulty: 'Medium', track: 'Trees', pattern: 'BFS Last Node / DFS Preorder', doorNumber: 55, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
  { id: 55, title: 'Count Good Nodes in Binary Tree', difficulty: 'Medium', track: 'Trees', pattern: 'DFS Path Maximum', doorNumber: 56, leetcodeUrl: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/' },
  { id: 56, title: 'Validate Binary Search Tree', difficulty: 'Medium', track: 'Trees', pattern: 'Inorder / Min-Max Range DFS', doorNumber: 57, leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 57, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', track: 'Trees', pattern: 'Inorder Traversal Early Exit', doorNumber: 58, leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
  { id: 58, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', track: 'Trees', pattern: 'Divide & Conquer Hash Map', doorNumber: 59, leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 59, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', track: 'Trees', pattern: 'Post-Order Max Branch Gain', doorNumber: 60, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { id: 60, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', track: 'Trees', pattern: 'Preorder String Encoding', doorNumber: 61, leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },

  // ── 8. Tries (3 problems) ──
  { id: 61, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', track: 'Tries', pattern: 'N-ary Prefix Tree', doorNumber: 62, leetcodeUrl: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
  { id: 62, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', track: 'Tries', pattern: 'Trie with Wildcard DFS', doorNumber: 63, leetcodeUrl: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
  { id: 63, title: 'Word Search II', difficulty: 'Hard', track: 'Tries', pattern: 'Backtracking Grid + Trie Pruning', doorNumber: 64, leetcodeUrl: 'https://leetcode.com/problems/word-search-ii/' },

  // ── 9. Heap / Priority Queue (7 problems) ──
  { id: 64, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', track: 'Heap / Priority Queue', pattern: 'Min-Heap of Size K', doorNumber: 65, leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
  { id: 65, title: 'Last Stone Weight', difficulty: 'Easy', track: 'Heap / Priority Queue', pattern: 'Max-Heap Simulation', doorNumber: 66, leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/' },
  { id: 66, title: 'K Closest Points to Origin', difficulty: 'Medium', track: 'Heap / Priority Queue', pattern: 'Max-Heap / Quickselect', doorNumber: 67, leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
  { id: 67, title: 'Kth Largest Element in an Array', difficulty: 'Medium', track: 'Heap / Priority Queue', pattern: 'Min-Heap / Quickselect', doorNumber: 68, leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { id: 68, title: 'Task Scheduler', difficulty: 'Medium', track: 'Heap / Priority Queue', pattern: 'Max Frequency Greedy Formula', doorNumber: 69, leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/' },
  { id: 69, title: 'Design Twitter', difficulty: 'Medium', track: 'Heap / Priority Queue', pattern: 'K-Way Merge Heap', doorNumber: 70, leetcodeUrl: 'https://leetcode.com/problems/design-twitter/' },
  { id: 70, title: 'Find Median from Data Stream', difficulty: 'Hard', track: 'Heap / Priority Queue', pattern: 'Two Heaps (Min-Max Balancer)', doorNumber: 71, leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },

  // ── 10. Backtracking (9 problems) ──
  { id: 71, title: 'Subsets', difficulty: 'Medium', track: 'Backtracking', pattern: 'Include / Exclude Choice Tree', doorNumber: 72, leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
  { id: 72, title: 'Combination Sum', difficulty: 'Medium', track: 'Backtracking', pattern: 'Unbounded Choice DFS', doorNumber: 73, leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
  { id: 73, title: 'Permutations', difficulty: 'Medium', track: 'Backtracking', pattern: 'Element Swapping / Visited Set', doorNumber: 74, leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
  { id: 74, title: 'Subsets II', difficulty: 'Medium', track: 'Backtracking', pattern: 'Sort + Skip Duplicate Siblings', doorNumber: 75, leetcodeUrl: 'https://leetcode.com/problems/subsets-ii/' },
  { id: 75, title: 'Combination Sum II', difficulty: 'Medium', track: 'Backtracking', pattern: 'Sort + Skip Duplicate DFS', doorNumber: 76, leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/' },
  { id: 76, title: 'Word Search', difficulty: 'Medium', track: 'Backtracking', pattern: 'Grid DFS with In-Place Visited', doorNumber: 77, leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
  { id: 77, title: 'Palindrome Partitioning', difficulty: 'Medium', track: 'Backtracking', pattern: 'Prefix Palindrome + Backtrack', doorNumber: 78, leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/' },
  { id: 78, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', track: 'Backtracking', pattern: 'Digit Mapping Cartesian Product', doorNumber: 79, leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
  { id: 79, title: 'N-Queens', difficulty: 'Hard', track: 'Backtracking', pattern: 'Row-by-Row Diagonal Set Check', doorNumber: 80, leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },

  // ── 11. Graphs (13 problems) ──
  { id: 80, title: 'Number of Islands', difficulty: 'Medium', track: 'Graphs', pattern: 'Grid Flood Fill (BFS/DFS)', doorNumber: 81, leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 81, title: 'Max Area of Island', difficulty: 'Medium', track: 'Graphs', pattern: 'Component Size DFS', doorNumber: 82, leetcodeUrl: 'https://leetcode.com/problems/max-area-of-island/' },
  { id: 82, title: 'Clone Graph', difficulty: 'Medium', track: 'Graphs', pattern: 'Hash Map Visited DFS', doorNumber: 83, leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
  { id: 83, title: 'Walls and Gates', difficulty: 'Medium', track: 'Graphs', pattern: 'Multi-Source BFS', doorNumber: 84, leetcodeUrl: 'https://leetcode.com/problems/walls-and-gates/' },
  { id: 84, title: 'Rotting Oranges', difficulty: 'Medium', track: 'Graphs', pattern: 'Multi-Source Level BFS', doorNumber: 85, leetcodeUrl: 'https://leetcode.com/problems/rotting-oranges/' },
  { id: 85, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', track: 'Graphs', pattern: 'Reverse Flow from Oceans BFS/DFS', doorNumber: 86, leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 86, title: 'Surrounded Regions', difficulty: 'Medium', track: 'Graphs', pattern: 'Boundary Inward Flood Fill', doorNumber: 87, leetcodeUrl: 'https://leetcode.com/problems/surrounded-regions/' },
  { id: 87, title: 'Course Schedule', difficulty: 'Medium', track: 'Graphs', pattern: 'Topological Sort / Cycle Detection', doorNumber: 88, leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
  { id: 88, title: 'Course Schedule II', difficulty: 'Medium', track: 'Graphs', pattern: 'Kahn’s In-Degree Topo Sort', doorNumber: 89, leetcodeUrl: 'https://leetcode.com/problems/course-schedule-ii/' },
  { id: 89, title: 'Graph Valid Tree', difficulty: 'Medium', track: 'Graphs', pattern: 'Union-Find / Cycle & Component Check', doorNumber: 90, leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/' },
  { id: 90, title: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', track: 'Graphs', pattern: 'Disjoint Set Union (DSU)', doorNumber: 91, leetcodeUrl: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
  { id: 91, title: 'Redundant Connection', difficulty: 'Medium', track: 'Graphs', pattern: 'Union-Find Cycle Detection', doorNumber: 92, leetcodeUrl: 'https://leetcode.com/problems/redundant-connection/' },
  { id: 92, title: 'Word Ladder', difficulty: 'Hard', track: 'Graphs', pattern: 'Shortest Path Bidirectional BFS', doorNumber: 93, leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },

  // ── 12. Advanced Graphs (6 problems) ──
  { id: 93, title: 'Reconstruct Itinerary', difficulty: 'Hard', track: 'Advanced Graphs', pattern: 'Hierholzer’s Eulerian Path', doorNumber: 94, leetcodeUrl: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  { id: 94, title: 'Min Cost to Connect All Points', difficulty: 'Medium', track: 'Advanced Graphs', pattern: 'Kruskal / Prim MST', doorNumber: 95, leetcodeUrl: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
  { id: 95, title: 'Network Delay Time', difficulty: 'Medium', track: 'Advanced Graphs', pattern: 'Dijkstra’s Shortest Path', doorNumber: 96, leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/' },
  { id: 96, title: 'Swim in Rising Water', difficulty: 'Hard', track: 'Advanced Graphs', pattern: 'Modified Dijkstra / Binary Search + BFS', doorNumber: 97, leetcodeUrl: 'https://leetcode.com/problems/swim-in-rising-water/' },
  { id: 97, title: 'Alien Dictionary', difficulty: 'Hard', track: 'Advanced Graphs', pattern: 'Character Dependency Topo Sort', doorNumber: 98, leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/' },
  { id: 98, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', track: 'Advanced Graphs', pattern: 'Bellman-Ford / BFS with Visited Limit', doorNumber: 99, leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },

  // ── 13. 1-D Dynamic Programming (12 problems) ──
  { id: 99, title: 'Climbing Stairs', difficulty: 'Easy', track: '1-D Dynamic Programming', pattern: 'Fibonacci Recurrence', doorNumber: 1, leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 100, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', track: '1-D Dynamic Programming', pattern: '1D State Space Reduction', doorNumber: 100, leetcodeUrl: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
  { id: 101, title: 'House Robber', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Rob / Skip State Variable', doorNumber: 2, leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
  { id: 102, title: 'House Robber II', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Circular Array 2-Pass DP', doorNumber: 3, leetcodeUrl: 'https://leetcode.com/problems/house-robber-ii/' },
  { id: 103, title: 'Longest Palindromic Substring', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Expand Around Center / 2D DP', doorNumber: 4, leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 104, title: 'Palindromic Substrings', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Expand Around Center Count', doorNumber: 5, leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/' },
  { id: 105, title: 'Decode Ways', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: '1-Digit and 2-Digit Split DP', doorNumber: 6, leetcodeUrl: 'https://leetcode.com/problems/decode-ways/' },
  { id: 106, title: 'Coin Change', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Unbounded Knapsack Min Coins', doorNumber: 7, leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
  { id: 107, title: 'Maximum Product Subarray', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Track Min & Max Product', doorNumber: 8, leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { id: 108, title: 'Word Break', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'Prefix Substring DP', doorNumber: 9, leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
  { id: 109, title: 'Longest Increasing Subsequence', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: 'O(N²) DP or O(N log N) Patience Sorting', doorNumber: 10, leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 110, title: 'Partition Equal Subset Sum', difficulty: 'Medium', track: '1-D Dynamic Programming', pattern: '0/1 Knapsack Target Sum', doorNumber: 11, leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/' },

  // ── 14. 2-D Dynamic Programming (11 problems) ──
  { id: 111, title: 'Unique Paths', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'Grid Path Addition DP', doorNumber: 12, leetcodeUrl: 'https://leetcode.com/problems/unique-paths/' },
  { id: 112, title: 'Longest Common Subsequence', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'Classic 2D Table DP', doorNumber: 13, leetcodeUrl: 'https://leetcode.com/problems/longest-common-subsequence/' },
  { id: 113, title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'State Machine DP (Hold, Sold, Rest)', doorNumber: 14, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
  { id: 114, title: 'Coin Change II', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'Unbounded Knapsack Ways Count', doorNumber: 15, leetcodeUrl: 'https://leetcode.com/problems/coin-change-ii/' },
  { id: 115, title: 'Target Sum', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'Subset Sum Reduction DP', doorNumber: 16, leetcodeUrl: 'https://leetcode.com/problems/target-sum/' },
  { id: 116, title: 'Interleaving String', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: '2D Grid Matrix Match DP', doorNumber: 17, leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/' },
  { id: 117, title: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', track: '2-D Dynamic Programming', pattern: 'DFS + Memoization DAG', doorNumber: 18, leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
  { id: 118, title: 'Distinct Subsequences', difficulty: 'Hard', track: '2-D Dynamic Programming', pattern: '2D String Matching DP', doorNumber: 19, leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/' },
  { id: 119, title: 'Edit Distance', difficulty: 'Medium', track: '2-D Dynamic Programming', pattern: 'Levenshtein Distance 2D DP', doorNumber: 20, leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
  { id: 120, title: 'Burst Balloons', difficulty: 'Hard', track: '2-D Dynamic Programming', pattern: 'Interval DP Bottom-Up', doorNumber: 21, leetcodeUrl: 'https://leetcode.com/problems/burst-balloons/' },
  { id: 121, title: 'Regular Expression Matching', difficulty: 'Hard', track: '2-D Dynamic Programming', pattern: 'Regex Asterisk Transition 2D DP', doorNumber: 22, leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/' },

  // ── 15. Greedy (8 problems) ──
  { id: 122, title: 'Maximum Subarray', difficulty: 'Medium', track: 'Greedy', pattern: 'Kadane’s Algorithm', doorNumber: 23, leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 123, title: 'Jump Game', difficulty: 'Medium', track: 'Greedy', pattern: 'Max Reach So Far', doorNumber: 24, leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
  { id: 124, title: 'Jump Game II', difficulty: 'Medium', track: 'Greedy', pattern: 'BFS-Style Window Jump', doorNumber: 25, leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' },
  { id: 125, title: 'Gas Station', difficulty: 'Medium', track: 'Greedy', pattern: 'Cumulative Surplus Reset', doorNumber: 26, leetcodeUrl: 'https://leetcode.com/problems/gas-station/' },
  { id: 126, title: 'Hand of Straights', difficulty: 'Medium', track: 'Greedy', pattern: 'Ordered Map Greedy Grouping', doorNumber: 27, leetcodeUrl: 'https://leetcode.com/problems/hand-of-straights/' },
  { id: 127, title: 'Merge Triplets to Form Target Triplet', difficulty: 'Medium', track: 'Greedy', pattern: 'Coordinate Filter Match', doorNumber: 28, leetcodeUrl: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
  { id: 128, title: 'Partition Labels', difficulty: 'Medium', track: 'Greedy', pattern: 'Last Occurrence Window Split', doorNumber: 29, leetcodeUrl: 'https://leetcode.com/problems/partition-labels/' },
  { id: 129, title: 'Valid Parenthesis String', difficulty: 'Medium', track: 'Greedy', pattern: 'Wildcard Range Balance (Min/Max)', doorNumber: 30, leetcodeUrl: 'https://leetcode.com/problems/valid-parenthesis-string/' },

  // ── 16. Intervals (6 problems) ──
  { id: 130, title: 'Insert Interval', difficulty: 'Medium', track: 'Intervals', pattern: 'Three-Phase Merge', doorNumber: 31, leetcodeUrl: 'https://leetcode.com/problems/insert-interval/' },
  { id: 131, title: 'Merge Intervals', difficulty: 'Medium', track: 'Intervals', pattern: 'Sort by Start + Greedy Extend', doorNumber: 32, leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 132, title: 'Non-overlapping Intervals', difficulty: 'Medium', track: 'Intervals', pattern: 'Greedy Sort by End Time', doorNumber: 33, leetcodeUrl: 'https://leetcode.com/problems/non-overlapping-intervals/' },
  { id: 133, title: 'Meeting Rooms', difficulty: 'Easy', track: 'Intervals', pattern: 'Sort + Overlap Check', doorNumber: 34, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms/' },
  { id: 134, title: 'Meeting Rooms II', difficulty: 'Medium', track: 'Intervals', pattern: 'Two Pointers / Min-Heap', doorNumber: 35, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  { id: 135, title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', track: 'Intervals', pattern: 'Sort + Min-Heap by Length', doorNumber: 36, leetcodeUrl: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' },

  // ── 17. Math & Geometry (8 problems) ──
  { id: 136, title: 'Rotate Image', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'Transpose + Reverse Rows', doorNumber: 37, leetcodeUrl: 'https://leetcode.com/problems/rotate-image/' },
  { id: 137, title: 'Spiral Matrix', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'Boundary Pointers (Top, Bottom, Left, Right)', doorNumber: 38, leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/' },
  { id: 138, title: 'Set Matrix Zeroes', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'First Row/Col In-Place Flags', doorNumber: 39, leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { id: 139, title: 'Happy Number', difficulty: 'Easy', track: 'Math & Geometry', pattern: 'Floyd’s Cycle on Digit Sums', doorNumber: 40, leetcodeUrl: 'https://leetcode.com/problems/happy-number/' },
  { id: 140, title: 'Plus One', difficulty: 'Easy', track: 'Math & Geometry', pattern: 'Right-to-Left Carry Propagation', doorNumber: 41, leetcodeUrl: 'https://leetcode.com/problems/plus-one/' },
  { id: 141, title: 'Pow(x, n)', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'Binary Exponentiation O(log n)', doorNumber: 42, leetcodeUrl: 'https://leetcode.com/problems/powx-n/' },
  { id: 142, title: 'Multiply Strings', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'Manual Digit Array Grade-School Multiply', doorNumber: 43, leetcodeUrl: 'https://leetcode.com/problems/multiply-strings/' },
  { id: 143, title: 'Detect Squares', difficulty: 'Medium', track: 'Math & Geometry', pattern: 'Hash Map Diagonal Pair Check', doorNumber: 44, leetcodeUrl: 'https://leetcode.com/problems/detect-squares/' },

  // ── 18. Bit Manipulation (7 problems) ──
  { id: 144, title: 'Single Number', difficulty: 'Easy', track: 'Bit Manipulation', pattern: 'XOR Identity Cancellation', doorNumber: 45, leetcodeUrl: 'https://leetcode.com/problems/single-number/' },
  { id: 145, title: 'Number of 1 Bits', difficulty: 'Easy', track: 'Bit Manipulation', pattern: 'Brian Kernighan’s x & (x-1)', doorNumber: 46, leetcodeUrl: 'https://leetcode.com/problems/number-of-1-bits/' },
  { id: 146, title: 'Counting Bits', difficulty: 'Easy', track: 'Bit Manipulation', pattern: 'DP Bit Shift Transition', doorNumber: 47, leetcodeUrl: 'https://leetcode.com/problems/counting-bits/' },
  { id: 147, title: 'Reverse Bits', difficulty: 'Easy', track: 'Bit Manipulation', pattern: 'Bit-by-Bit Shift Accumulation', doorNumber: 48, leetcodeUrl: 'https://leetcode.com/problems/reverse-bits/' },
  { id: 148, title: 'Missing Number', difficulty: 'Easy', track: 'Bit Manipulation', pattern: 'XOR Index Match / Gauss Formula', doorNumber: 49, leetcodeUrl: 'https://leetcode.com/problems/missing-number/' },
  { id: 149, title: 'Sum of Two Integers', difficulty: 'Medium', track: 'Bit Manipulation', pattern: 'Bitwise Half Adder (XOR & AND)', doorNumber: 50, leetcodeUrl: 'https://leetcode.com/problems/sum-of-two-integers/' },
  { id: 150, title: 'Reverse Integer', difficulty: 'Medium', track: 'Bit Manipulation', pattern: 'Modulo Overflow Check', doorNumber: 51, leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/' },
];
