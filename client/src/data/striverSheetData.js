/**
 * Striver SDE Sheet — Top Curated DSA Problems for Product-Based Company Interviews
 * Categorized by Days / Core Topics with LeetCode & Dungeon Door mappings.
 */

export const STRIVER_TOPICS = [
  'Arrays',
  'Arrays Part-II',
  'Arrays Part-III',
  'Arrays Part-IV',
  'Linked List',
  'Linked List Part-II',
  'Linked List and Arrays',
  'Greedy Algorithm',
  'Recursion',
  'Recursion and Backtracking',
  'Binary Search',
  'Heaps',
  'Stack and Queue',
  'Stack and Queue Part-II',
  'String',
  'String Part-II',
  'Binary Tree',
  'Binary Tree Part-II',
  'Binary Tree Part-III',
  'Binary Search Tree',
  'Binary Search Tree Part-II',
  'Binary Trees [Misc]',
  'Graph',
  'Graph Part-II',
  'Dynamic Programming',
  'Dynamic Programming Part-II',
  'Trie',
];

export const STRIVER_PROBLEMS = [
  // Day 1: Arrays
  { id: 'striver-1', title: 'Set Matrix Zeroes', topic: 'Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/set-matrix-zeroes/', doorNumber: 52, pattern: 'Matrix Traversal' },
  { id: 'striver-2', title: "Pascal's Triangle", topic: 'Arrays', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/pascals-triangle/', doorNumber: 53, pattern: 'Combinatorics / DP' },
  { id: 'striver-3', title: 'Next Permutation', topic: 'Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/next-permutation/', doorNumber: 54, pattern: 'Array Transformation' },
  { id: 'striver-4', title: "Kadane's Algorithm (Maximum Subarray)", topic: 'Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/maximum-subarray/', doorNumber: 4, pattern: "Kadane's Algorithm" },
  { id: 'striver-5', title: 'Sort Colors (0s, 1s, 2s)', topic: 'Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/sort-colors/', doorNumber: 5, pattern: 'Dutch National Flag' },
  { id: 'striver-6', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', doorNumber: 7, pattern: 'Greedy / Min Tracker' },

  // Day 2: Arrays Part-II
  { id: 'striver-7', title: 'Rotate Image (Matrix 90 deg)', topic: 'Arrays Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/rotate-image/', doorNumber: 55, pattern: 'Matrix Transformation' },
  { id: 'striver-8', title: 'Merge Overlapping Intervals', topic: 'Arrays Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/merge-intervals/', doorNumber: 56, pattern: 'Interval Merging' },
  { id: 'striver-9', title: 'Merge Two Sorted Arrays Without Extra Space', topic: 'Arrays Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/merge-sorted-array/', doorNumber: 57, pattern: 'Two Pointer / Gap Method' },
  { id: 'striver-10', title: 'Find the Duplicate Number', topic: 'Arrays Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/find-the-duplicate-number/', doorNumber: 58, pattern: "Floyd's Tortoise & Hare" },
  { id: 'striver-11', title: 'Repeat and Missing Number', topic: 'Arrays Part-II', difficulty: 'medium', leetcode: 'https://www.interviewbit.com/problems/repeat-and-missing-number-array/', doorNumber: 59, pattern: 'Math / XOR' },
  { id: 'striver-12', title: 'Inversion of Array (Merge Sort)', topic: 'Arrays Part-II', difficulty: 'hard', leetcode: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1', doorNumber: 60, pattern: 'Divide & Conquer' },

  // Day 3: Arrays Part-III
  { id: 'striver-13', title: 'Search a 2D Matrix', topic: 'Arrays Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/search-a-2d-matrix/', doorNumber: 15, pattern: 'Binary Search' },
  { id: 'striver-14', title: 'Pow(x, n)', topic: 'Arrays Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/powx-n/', doorNumber: 61, pattern: 'Binary Exponentiation' },
  { id: 'striver-15', title: 'Majority Element (> n/2)', topic: 'Arrays Part-III', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/majority-element/', doorNumber: 62, pattern: "Boyer-Moore Voting" },
  { id: 'striver-16', title: 'Majority Element II (> n/3)', topic: 'Arrays Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/majority-element-ii/', doorNumber: 63, pattern: "Extended Boyer-Moore" },
  { id: 'striver-17', title: 'Grid Unique Paths', topic: 'Arrays Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/unique-paths/', doorNumber: 64, pattern: 'Dynamic Programming' },
  { id: 'striver-18', title: 'Reverse Pairs', topic: 'Arrays Part-III', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/reverse-pairs/', doorNumber: 65, pattern: 'Merge Sort Count' },

  // Day 4: Arrays Part-IV
  { id: 'striver-19', title: '2 Sum Problem', topic: 'Arrays Part-IV', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/two-sum/', doorNumber: 6, pattern: 'Hash Map' },
  { id: 'striver-20', title: '4 Sum Problem', topic: 'Arrays Part-IV', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/4sum/', doorNumber: 66, pattern: 'Two Pointer / Sorting' },
  { id: 'striver-21', title: 'Longest Consecutive Sequence', topic: 'Arrays Part-IV', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/longest-consecutive-sequence/', doorNumber: 67, pattern: 'Hash Set' },
  { id: 'striver-22', title: 'Largest Subarray with 0 Sum', topic: 'Arrays Part-IV', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1', doorNumber: 68, pattern: 'Prefix Sum Map' },
  { id: 'striver-23', title: 'Count Subarrays with Given XOR K', topic: 'Arrays Part-IV', difficulty: 'medium', leetcode: 'https://www.interviewbit.com/problems/subarray-with-given-xor/', doorNumber: 69, pattern: 'Prefix XOR Map' },
  { id: 'striver-24', title: 'Longest Substring Without Repeating Characters', topic: 'Arrays Part-IV', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', doorNumber: 8, pattern: 'Sliding Window' },

  // Day 5: Linked List
  { id: 'striver-25', title: 'Reverse a Linked List', topic: 'Linked List', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/reverse-linked-list/', doorNumber: 16, pattern: 'Pointer Reversal' },
  { id: 'striver-26', title: 'Find the Middle of Linked List', topic: 'Linked List', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/middle-of-the-linked-list/', doorNumber: 17, pattern: 'Fast & Slow Pointers' },
  { id: 'striver-27', title: 'Merge Two Sorted Linked Lists', topic: 'Linked List', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/', doorNumber: 18, pattern: 'Dummy Node / Two Pointer' },
  { id: 'striver-28', title: 'Remove N-th Node From End of List', topic: 'Linked List', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', doorNumber: 19, pattern: 'Two Pointer Gap' },
  { id: 'striver-29', title: 'Add Two Numbers as Linked Lists', topic: 'Linked List', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/add-two-numbers/', doorNumber: 70, pattern: 'Elementary Math' },
  { id: 'striver-30', title: 'Delete a Node when Node Reference is Given (O(1))', topic: 'Linked List', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', doorNumber: 71, pattern: 'Value Overwrite' },

  // Day 6: Linked List Part-II
  { id: 'striver-31', title: 'Intersection Point of Two Linked Lists', topic: 'Linked List Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', doorNumber: 72, pattern: 'Dual Pointer Traversal' },
  { id: 'striver-32', title: 'Detect Cycle in a Linked List', topic: 'Linked List Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/linked-list-cycle/', doorNumber: 20, pattern: "Floyd's Cycle Finding" },
  { id: 'striver-33', title: 'Reverse Nodes in k-Group', topic: 'Linked List Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', doorNumber: 73, pattern: 'Recursive / Iterative Reversal' },
  { id: 'striver-34', title: 'Check if Linked List is Palindrome', topic: 'Linked List Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/palindrome-linked-list/', doorNumber: 74, pattern: 'Mid Reversal + Compare' },
  { id: 'striver-35', title: 'Find Starting Point of the Cycle in Linked List', topic: 'Linked List Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/linked-list-cycle-ii/', doorNumber: 75, pattern: "Floyd's Cycle Algorithm" },
  { id: 'striver-36', title: 'Flattening of a Linked List', topic: 'Linked List Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1', doorNumber: 76, pattern: 'Merge Sort on Lists' },

  // Day 7: Linked List and Arrays
  { id: 'striver-37', title: 'Rotate a Linked List', topic: 'Linked List and Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/rotate-list/', doorNumber: 77, pattern: 'Modulo Shift' },
  { id: 'striver-38', title: 'Clone a Linked List with Next and Random Pointer', topic: 'Linked List and Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/copy-list-with-random-pointer/', doorNumber: 78, pattern: 'Interweaving / Hash Map' },
  { id: 'striver-39', title: '3 Sum Problem', topic: 'Linked List and Arrays', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/3sum/', doorNumber: 9, pattern: 'Sort + Two Pointer' },
  { id: 'striver-40', title: 'Trapping Rain Water', topic: 'Linked List and Arrays', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/trapping-rain-water/', doorNumber: 10, pattern: 'Two Pointer / Monotonic' },
  { id: 'striver-41', title: 'Remove Duplicates from Sorted Array', topic: 'Linked List and Arrays', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', doorNumber: 79, pattern: 'Two Pointer In-Place' },
  { id: 'striver-42', title: 'Max Consecutive Ones', topic: 'Linked List and Arrays', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/max-consecutive-ones/', doorNumber: 80, pattern: 'Linear Scan' },

  // Day 8: Greedy Algorithm
  { id: 'striver-43', title: 'N Meetings in One Room', topic: 'Greedy Algorithm', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1', doorNumber: 81, pattern: 'Interval Scheduling' },
  { id: 'striver-44', title: 'Minimum Platforms Required for Railway Station', topic: 'Greedy Algorithm', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1', doorNumber: 82, pattern: 'Two Pointer / Sweep Line' },
  { id: 'striver-45', title: 'Job Sequencing Problem', topic: 'Greedy Algorithm', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1', doorNumber: 83, pattern: 'Greedy + Disjoint Set' },
  { id: 'striver-46', title: 'Fractional Knapsack Problem', topic: 'Greedy Algorithm', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1', doorNumber: 84, pattern: 'Greedy Ratio Sort' },
  { id: 'striver-47', title: 'Greedy Algorithm to find Minimum Coins', topic: 'Greedy Algorithm', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/min-coin5549/1', doorNumber: 85, pattern: 'Greedy Denominations' },
  { id: 'striver-48', title: 'Activity Selection Problem', topic: 'Greedy Algorithm', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1', doorNumber: 86, pattern: 'Greedy Scheduling' },

  // Day 9: Recursion
  { id: 'striver-49', title: 'Subset Sums', topic: 'Recursion', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/subset-sums2234/1', doorNumber: 87, pattern: 'Recursion / Pick-NotPick' },
  { id: 'striver-50', title: 'Subsets II (Unique Subsets)', topic: 'Recursion', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/subsets-ii/', doorNumber: 88, pattern: 'Backtracking' },
  { id: 'striver-51', title: 'Combination Sum', topic: 'Recursion', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/combination-sum/', doorNumber: 89, pattern: 'Backtracking Pick-NotPick' },
  { id: 'striver-52', title: 'Combination Sum II', topic: 'Recursion', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/combination-sum-ii/', doorNumber: 90, pattern: 'Backtracking with Sorting' },
  { id: 'striver-53', title: 'Palindrome Partitioning', topic: 'Recursion', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/palindrome-partitioning/', doorNumber: 91, pattern: 'Backtracking' },
  { id: 'striver-54', title: 'K-th Permutation Sequence', topic: 'Recursion', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/permutation-sequence/', doorNumber: 92, pattern: 'Math / Factorial' },

  // Day 10: Recursion and Backtracking
  { id: 'striver-55', title: 'Print All Permutations of a String/Array', topic: 'Recursion and Backtracking', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/permutations/', doorNumber: 93, pattern: 'Backtracking Swap' },
  { id: 'striver-56', title: 'N Queens Problem', topic: 'Recursion and Backtracking', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/n-queens/', doorNumber: 94, pattern: 'Backtracking with Bitmasks' },
  { id: 'striver-57', title: 'Sudoku Solver', topic: 'Recursion and Backtracking', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/sudoku-solver/', doorNumber: 95, pattern: 'Backtracking Search' },
  { id: 'striver-58', title: 'M Coloring Problem', topic: 'Recursion and Backtracking', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1', doorNumber: 96, pattern: 'Graph Backtracking' },
  { id: 'striver-59', title: 'Rat in a Maze Problem', topic: 'Recursion and Backtracking', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1', doorNumber: 97, pattern: 'Grid Backtracking' },
  { id: 'striver-60', title: 'Word Break II', topic: 'Recursion and Backtracking', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/word-break-ii/', doorNumber: 98, pattern: 'Backtracking + Memo' },

  // Day 11: Binary Search
  { id: 'striver-61', title: 'Find the Element that Appears Once in a Sorted Array', topic: 'Binary Search', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/single-element-in-a-sorted-array/', doorNumber: 99, pattern: 'Binary Search Even-Odd' },
  { id: 'striver-62', title: 'Search in Rotated Sorted Array', topic: 'Binary Search', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', doorNumber: 14, pattern: 'Binary Search Partition' },
  { id: 'striver-63', title: 'Median of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', doorNumber: 100, pattern: 'Binary Search on Partition' },
  { id: 'striver-64', title: 'K-th Element of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1', doorNumber: null, pattern: 'Binary Search Bounds' },
  { id: 'striver-65', title: 'Allocate Minimum Number of Pages (Book Allocation)', topic: 'Binary Search', difficulty: 'hard', leetcode: 'https://www.interviewbit.com/problems/allocate-books/', doorNumber: null, pattern: 'Binary Search on Answer' },
  { id: 'striver-66', title: 'Aggressive Cows', topic: 'Binary Search', difficulty: 'hard', leetcode: 'https://www.spoj.com/problems/AGGRCOW/', doorNumber: null, pattern: 'Binary Search on Answer' },

  // Day 12: Heaps
  { id: 'striver-67', title: 'Min Heap / Max Heap Implementation', topic: 'Heaps', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/min-heap-implementation/1', doorNumber: null, pattern: 'Heapify / Array Tree' },
  { id: 'striver-68', title: 'Kth Largest Element in an Array', topic: 'Heaps', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', doorNumber: 2, pattern: 'Min-Heap / QuickSelect' },
  { id: 'striver-69', title: 'Maximum Sum Combination', topic: 'Heaps', difficulty: 'medium', leetcode: 'https://www.interviewbit.com/problems/maximum-sum-combinations/', doorNumber: null, pattern: 'Max-Heap + Set' },
  { id: 'striver-70', title: 'Find Median from Data Stream', topic: 'Heaps', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/find-median-from-data-stream/', doorNumber: null, pattern: 'Two Heaps (Min/Max)' },
  { id: 'striver-71', title: 'Merge K Sorted Arrays', topic: 'Heaps', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1', doorNumber: null, pattern: 'Min-Heap Multiway' },
  { id: 'striver-72', title: 'Top K Frequent Elements', topic: 'Heaps', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/top-k-frequent-elements/', doorNumber: null, pattern: 'Bucket Sort / Min-Heap' },

  // Day 13: Stack and Queue
  { id: 'striver-73', title: 'Implement Stack using Arrays / Queues', topic: 'Stack and Queue', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/implement-stack-using-queues/', doorNumber: 21, pattern: 'Stack / Queue Simulation' },
  { id: 'striver-74', title: 'Implement Queue using Stacks', topic: 'Stack and Queue', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/implement-queue-using-stacks/', doorNumber: 22, pattern: 'Amortized Two Stacks' },
  { id: 'striver-75', title: 'Valid Parentheses', topic: 'Stack and Queue', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/valid-parentheses/', doorNumber: 11, pattern: 'Stack Matching' },
  { id: 'striver-76', title: 'Next Greater Element', topic: 'Stack and Queue', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/next-greater-element-i/', doorNumber: 23, pattern: 'Monotonic Stack' },
  { id: 'striver-77', title: 'Sort a Stack', topic: 'Stack and Queue', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/sort-a-stack/1', doorNumber: null, pattern: 'Recursion / Stack' },

  // Day 14: Stack and Queue Part-II
  { id: 'striver-78', title: 'Next Smaller Element', topic: 'Stack and Queue Part-II', difficulty: 'medium', leetcode: 'https://www.interviewbit.com/problems/nearest-smaller-element/', doorNumber: null, pattern: 'Monotonic Stack' },
  { id: 'striver-79', title: 'LRU Cache Implementation', topic: 'Stack and Queue Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/lru-cache/', doorNumber: null, pattern: 'Doubly Linked List + Map' },
  { id: 'striver-80', title: 'LFU Cache Implementation', topic: 'Stack and Queue Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/lfu-cache/', doorNumber: null, pattern: 'Frequency Hash + DLL' },
  { id: 'striver-81', title: 'Largest Rectangle in Histogram', topic: 'Stack and Queue Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', doorNumber: null, pattern: 'Monotonic Stack' },
  { id: 'striver-82', title: 'Sliding Window Maximum', topic: 'Stack and Queue Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/sliding-window-maximum/', doorNumber: null, pattern: 'Monotonic Deque' },
  { id: 'striver-83', title: 'Min Stack with O(1) Time', topic: 'Stack and Queue Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/min-stack/', doorNumber: 12, pattern: 'Auxiliary Stack / Formula' },

  // Day 15: String
  { id: 'striver-84', title: 'Reverse Words in a String', topic: 'String', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/reverse-words-in-a-string/', doorNumber: 13, pattern: 'String Manipulation' },
  { id: 'striver-85', title: 'Longest Palindromic Substring', topic: 'String', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/longest-palindromic-substring/', doorNumber: null, pattern: 'Expand Around Center / DP' },
  { id: 'striver-86', title: 'Roman to Integer', topic: 'String', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/roman-to-integer/', doorNumber: null, pattern: 'Hash Map Lookup' },
  { id: 'striver-87', title: 'String to Integer (atoi)', topic: 'String', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/string-to-integer-atoi/', doorNumber: null, pattern: 'Parsing State Machine' },
  { id: 'striver-88', title: 'Longest Common Prefix', topic: 'String', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/longest-common-prefix/', doorNumber: null, pattern: 'Vertical Scan' },
  { id: 'striver-89', title: 'Rabin-Karp String Matching', topic: 'String', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/repeated-string-match/', doorNumber: null, pattern: 'Rolling Hash' },

  // Day 16: String Part-II
  { id: 'striver-90', title: 'Z-Function / String Search', topic: 'String Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', doorNumber: null, pattern: 'Z Algorithm / KMP' },
  { id: 'striver-91', title: 'KMP Algorithm (LPS Array)', topic: 'String Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', doorNumber: null, pattern: 'Prefix Function (LPS)' },
  { id: 'striver-92', title: 'Minimum Characters needed to be inserted in beginning for Palindrome', topic: 'String Part-II', difficulty: 'hard', leetcode: 'https://www.interviewbit.com/problems/minimum-characters-required-to-make-a-string-palindromic/', doorNumber: null, pattern: 'KMP LPS' },
  { id: 'striver-93', title: 'Valid Anagram', topic: 'String Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/valid-anagram/', doorNumber: null, pattern: 'Frequency Array / Map' },
  { id: 'striver-94', title: 'Count and Say', topic: 'String Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/count-and-say/', doorNumber: null, pattern: 'Simulation' },
  { id: 'striver-95', title: 'Compare Version Numbers', topic: 'String Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/compare-version-numbers/', doorNumber: null, pattern: 'Two Pointer Split' },

  // Day 17: Binary Tree
  { id: 'striver-96', title: 'Binary Tree Inorder Traversal', topic: 'Binary Tree', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', doorNumber: 24, pattern: 'DFS / Morris Traversal' },
  { id: 'striver-97', title: 'Binary Tree Preorder Traversal', topic: 'Binary Tree', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', doorNumber: 25, pattern: 'DFS / Stack' },
  { id: 'striver-98', title: 'Binary Tree Postorder Traversal', topic: 'Binary Tree', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', doorNumber: 26, pattern: 'DFS / Two Stacks' },
  { id: 'striver-99', title: 'Left / Right View of Binary Tree', topic: 'Binary Tree', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/binary-tree-right-side-view/', doorNumber: 27, pattern: 'BFS / DFS Level Tracker' },
  { id: 'striver-100', title: 'Bottom View of Binary Tree', topic: 'Binary Tree', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1', doorNumber: 28, pattern: 'Vertical Line Map' },
  { id: 'striver-101', title: 'Top View of Binary Tree', topic: 'Binary Tree', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1', doorNumber: 29, pattern: 'Vertical Line Map' },

  // Day 18: Binary Tree Part-II
  { id: 'striver-102', title: 'Level Order Traversal / Spiral', topic: 'Binary Tree Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', doorNumber: 30, pattern: 'BFS Queue' },
  { id: 'striver-103', title: 'Maximum Depth of Binary Tree', topic: 'Binary Tree Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', doorNumber: null, pattern: 'DFS Height' },
  { id: 'striver-104', title: 'Diameter of Binary Tree', topic: 'Binary Tree Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/diameter-of-binary-tree/', doorNumber: null, pattern: 'DFS Bottom-Up' },
  { id: 'striver-105', title: 'Check if Binary Tree is Balanced', topic: 'Binary Tree Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/balanced-binary-tree/', doorNumber: null, pattern: 'DFS Height Check' },
  { id: 'striver-106', title: 'Lowest Common Ancestor (LCA) in Binary Tree', topic: 'Binary Tree Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', doorNumber: null, pattern: 'DFS Traversal' },
  { id: 'striver-107', title: 'Check if Two Trees are Identical', topic: 'Binary Tree Part-II', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/same-tree/', doorNumber: null, pattern: 'Recursive Match' },

  // Day 19: Binary Tree Part-III
  { id: 'striver-108', title: 'Maximum Path Sum in Binary Tree', topic: 'Binary Tree Part-III', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', doorNumber: null, pattern: 'DFS Max Gain' },
  { id: 'striver-109', title: 'Construct Binary Tree from Preorder and Inorder Traversal', topic: 'Binary Tree Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', doorNumber: null, pattern: 'Divide & Conquer Map' },
  { id: 'striver-110', title: 'Construct Binary Tree from Inorder and Postorder Traversal', topic: 'Binary Tree Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/', doorNumber: null, pattern: 'Divide & Conquer Map' },
  { id: 'striver-111', title: 'Symmetric Tree', topic: 'Binary Tree Part-III', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/symmetric-tree/', doorNumber: null, pattern: 'Mirror DFS' },
  { id: 'striver-112', title: 'Flatten Binary Tree to Linked List', topic: 'Binary Tree Part-III', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', doorNumber: null, pattern: 'Morris / Reverse Postorder' },
  { id: 'striver-113', title: 'Check for Children Sum Property', topic: 'Binary Tree Part-III', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/children-sum-parent/1', doorNumber: null, pattern: 'Recursive Tree Fix' },

  // Day 20: Binary Search Tree
  { id: 'striver-114', title: 'Populate Next Right Pointers of Tree', topic: 'Binary Search Tree', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/', doorNumber: null, pattern: 'Level Order / Pointer Connect' },
  { id: 'striver-115', title: 'Search in a Binary Search Tree', topic: 'Binary Search Tree', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', doorNumber: null, pattern: 'BST Property Traversal' },
  { id: 'striver-116', title: 'Construct BST from Sorted Array', topic: 'Binary Search Tree', difficulty: 'easy', leetcode: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', doorNumber: null, pattern: 'Binary Divide & Conquer' },
  { id: 'striver-117', title: 'Construct BST from Preorder Traversal', topic: 'Binary Search Tree', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/', doorNumber: null, pattern: 'BST Upper Bound' },
  { id: 'striver-118', title: 'Check if a Binary Tree is BST', topic: 'Binary Search Tree', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/validate-binary-search-tree/', doorNumber: null, pattern: 'Range Validation (min, max)' },
  { id: 'striver-119', title: 'LCA in Binary Search Tree', topic: 'Binary Search Tree', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', doorNumber: null, pattern: 'BST Split Point' },

  // Day 21: Binary Search Tree Part-II
  { id: 'striver-120', title: 'Floor and Ceil in a BST', topic: 'Binary Search Tree Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/floor-in-bst/1', doorNumber: null, pattern: 'BST Navigation' },
  { id: 'striver-121', title: 'Find K-th Smallest Element in BST', topic: 'Binary Search Tree Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', doorNumber: null, pattern: 'Inorder Traversal' },
  { id: 'striver-122', title: 'Find K-th Largest Element in BST', topic: 'Binary Search Tree Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1', doorNumber: null, pattern: 'Reverse Inorder' },
  { id: 'striver-123', title: 'Two Sum in BST (Find Pair with Sum K)', topic: 'Binary Search Tree Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/two-sum-iv-input-is-a-bst/', doorNumber: null, pattern: 'BST Iterator (Two Pointer)' },
  { id: 'striver-124', title: 'BST Iterator', topic: 'Binary Search Tree Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/binary-search-tree-iterator/', doorNumber: null, pattern: 'Lazy Stack Inorder' },
  { id: 'striver-125', title: 'Size of the Largest BST in Binary Tree', topic: 'Binary Search Tree Part-II', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/', doorNumber: null, pattern: 'Postorder Node Info' },

  // Day 23: Graph
  { id: 'striver-126', title: 'Clone Graph', topic: 'Graph', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/clone-graph/', doorNumber: null, pattern: 'DFS / BFS Hash Map' },
  { id: 'striver-127', title: 'DFS of Graph', topic: 'Graph', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1', doorNumber: null, pattern: 'DFS Recursion' },
  { id: 'striver-128', title: 'BFS of Graph', topic: 'Graph', difficulty: 'easy', leetcode: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1', doorNumber: null, pattern: 'BFS Queue' },
  { id: 'striver-129', title: 'Detect Cycle in Undirected Graph (BFS/DFS)', topic: 'Graph', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1', doorNumber: null, pattern: 'Parent Tracker' },
  { id: 'striver-130', title: 'Detect Cycle in a Directed Graph (DFS/Kahn)', topic: 'Graph', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1', doorNumber: null, pattern: "Kahn's Algorithm / Path Visited" },
  { id: 'striver-131', title: "Topological Sort (Kahn's Algorithm / DFS)", topic: 'Graph', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/topological-sort/1', doorNumber: null, pattern: 'Indegree Queue' },

  // Day 24: Graph Part-II
  { id: 'striver-132', title: 'Number of Islands', topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/number-of-islands/', doorNumber: null, pattern: 'Grid BFS / DFS / Disjoint Set' },
  { id: 'striver-133', title: 'Bipartite Graph Check (BFS/DFS)', topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/is-graph-bipartite/', doorNumber: null, pattern: '2-Coloring BFS' },
  { id: 'striver-134', title: "Dijkstra's Algorithm (Shortest Path)", topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1', doorNumber: null, pattern: 'Priority Queue' },
  { id: 'striver-135', title: 'Bellman Ford Algorithm', topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/distance-from-the-source-bellman-ford-algorithm/1', doorNumber: null, pattern: 'Edge Relaxation (N-1 times)' },
  { id: 'striver-136', title: 'Floyd Warshall Algorithm (All Pairs Shortest Path)', topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/floyd-warshall4853/1', doorNumber: null, pattern: 'DP 3-Loop Matrix' },
  { id: 'striver-137', title: "MST using Prim's / Kruskal's Algorithm", topic: 'Graph Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1', doorNumber: null, pattern: 'Disjoint Set / Priority Queue' },

  // Day 25: Dynamic Programming
  { id: 'striver-138', title: 'Max Product Subarray', topic: 'Dynamic Programming', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/maximum-product-subarray/', doorNumber: null, pattern: 'DP Min/Max Tracking' },
  { id: 'striver-139', title: 'Longest Increasing Subsequence (LIS)', topic: 'Dynamic Programming', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/longest-increasing-subsequence/', doorNumber: null, pattern: 'DP / Binary Search Patient Sort' },
  { id: 'striver-140', title: 'Longest Common Subsequence (LCS)', topic: 'Dynamic Programming', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/longest-common-subsequence/', doorNumber: null, pattern: '2D DP Grid' },
  { id: 'striver-141', title: '0/1 Knapsack Problem', topic: 'Dynamic Programming', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1', doorNumber: null, pattern: '2D / 1D DP Array' },
  { id: 'striver-142', title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'hard', leetcode: 'https://leetcode.com/problems/edit-distance/', doorNumber: null, pattern: '2D DP Grid' },
  { id: 'striver-143', title: 'Maximum Sum Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1', doorNumber: null, pattern: 'DP State' },

  // Day 26: Dynamic Programming Part-II & Trie
  { id: 'striver-144', title: 'Coin Change (Min Coins)', topic: 'Dynamic Programming Part-II', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/coin-change/', doorNumber: null, pattern: 'Unbounded Knapsack DP' },
  { id: 'striver-145', title: 'Subset Sum Equals Target', topic: 'Dynamic Programming Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1', doorNumber: null, pattern: 'DP Boolean Matrix' },
  { id: 'striver-146', title: 'Rod Cutting Problem', topic: 'Dynamic Programming Part-II', difficulty: 'medium', leetcode: 'https://www.geeksforgeeks.org/problems/rod-cutting0840/1', doorNumber: null, pattern: 'Unbounded Knapsack' },
  { id: 'striver-147', title: 'Implement Trie (Prefix Tree)', topic: 'Trie', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/implement-trie-prefix-tree/', doorNumber: null, pattern: 'TrieNode Array / Map' },
  { id: 'striver-148', title: 'Implement Trie II (Prefix with Word & Prefix Count)', topic: 'Trie', difficulty: 'medium', leetcode: 'https://www.naukri.com/code360/problems/implement-trie_1387095', doorNumber: null, pattern: 'TrieNode with Counts' },
  { id: 'striver-149', title: 'Maximum XOR of Two Numbers in an Array', topic: 'Trie', difficulty: 'medium', leetcode: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', doorNumber: null, pattern: 'Bitwise Binary Trie' },
];
