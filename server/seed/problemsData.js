// First 10 problems for DSA 100 Doors — World 1: Arrays.

module.exports = [
  {
    "doorNumber": 1,
    "title": "Find Maximum Element",
    "topic": "Arrays",
    "pattern": "Linear Scan",
    "difficulty": "easy",
    "description": "Given an array of integers, find and return the maximum element in the array.",
    "examples": [
      {
        "input": "[3, 7, 2, 9, 4]",
        "output": "9",
        "explanation": "9 is the largest value in the array."
      },
      {
        "input": "[-5, -1, -12]",
        "output": "-1",
        "explanation": "All values are negative; -1 is the largest."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int findMaximum(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[3, 7, 2, 9, 4]",
        "expectedOutput": "9",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[-5, -1, -12]",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "[3, 7, 2, 9, 4]",
        "expectedOutput": "9",
        "type": "Large Input Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "[4, 4, 4, 4]",
        "expectedOutput": "4",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think about what single value you need to remember as you scan the array once."
      },
      {
        "order": 2,
        "text": "Start by assuming the first element is the maximum, then compare it against the rest."
      },
      {
        "order": 3,
        "text": "Loop through the array; whenever you see a value greater than your current max, update it."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linear-scan-max",
      "steps": [
        {
          "index": 0,
          "value": 3,
          "currentMax": 3,
          "action": "init"
        },
        {
          "index": 1,
          "value": 7,
          "currentMax": 7,
          "action": "update-max"
        },
        {
          "index": 2,
          "value": 2,
          "currentMax": 7,
          "action": "skip"
        },
        {
          "index": 3,
          "value": 9,
          "currentMax": 9,
          "action": "update-max"
        },
        {
          "index": 4,
          "value": 4,
          "currentMax": 9,
          "action": "skip"
        },
        {
          "index": 4,
          "value": 4,
          "currentMax": 9,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A single pass keeps a running maximum. Initialize it to the first element, then compare each subsequent element against it, updating whenever a larger value appears. This achieves O(n) time with O(1) extra space.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int findMaximum(int[] nums) {\n        int max = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] > max) max = nums[i];\n        }\n        return max;\n    }\n}\n"
    },
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 2,
    "title": "Second Largest Element",
    "topic": "Arrays",
    "pattern": "Linear Scan",
    "difficulty": "easy",
    "description": "Given an array of integers, find the second largest distinct element. If no such element exists, return -1.",
    "examples": [
      {
        "input": "[3, 7, 2, 9, 4]",
        "output": "7",
        "explanation": "9 is largest, 7 is second largest."
      },
      {
        "input": "[5, 5, 5]",
        "output": "-1",
        "explanation": "No second distinct value exists."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int secondLargest(int[] nums) {\n        // Write your solution here\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[3, 7, 2, 9, 4]",
        "expectedOutput": "7",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[5, 5, 5]",
        "expectedOutput": "-1",
        "type": "Duplicate Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[2, 1]",
        "expectedOutput": "1",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[3, 7, 2, 9, 4]",
        "expectedOutput": "7",
        "type": "Large Input Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You need to track two things at once as you scan: the largest value seen, and the second largest."
      },
      {
        "order": 2,
        "text": "When a new value beats your current largest, the old largest becomes your new second largest."
      },
      {
        "order": 3,
        "text": "Be careful with duplicates — only update second-largest when the value is strictly less than the largest but still greater than the current second-largest."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linear-scan-second-max",
      "steps": [
        {
          "index": 0,
          "value": 3,
          "first": 3,
          "second": -1,
          "action": "init"
        },
        {
          "index": 1,
          "value": 7,
          "first": 7,
          "second": 3,
          "action": "update-first"
        },
        {
          "index": 2,
          "value": 2,
          "first": 7,
          "second": 3,
          "action": "skip"
        },
        {
          "index": 3,
          "value": 9,
          "first": 9,
          "second": 7,
          "action": "update-first"
        },
        {
          "index": 4,
          "value": 4,
          "first": 9,
          "second": 7,
          "action": "skip"
        },
        {
          "index": 4,
          "value": 4,
          "first": 9,
          "second": 7,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Track two running values, first and second, in a single pass. If the current value beats first, second becomes the old first. Otherwise, if it beats second (and is not equal to first), update second. This avoids sorting and stays O(n) time.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int secondLargest(int[] nums) {\n        long first = Long.MIN_VALUE, second = Long.MIN_VALUE;\n        for (int n : nums) {\n            if (n > first) { second = first; first = n; }\n            else if (n < first && n > second) { second = n; }\n        }\n        return second == Long.MIN_VALUE ? -1 : (int) second;\n    }\n}\n"
    },
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 3,
    "title": "Reverse Array",
    "topic": "Arrays",
    "pattern": "Two Pointer",
    "difficulty": "easy",
    "description": "Reverse the given array in place and return it.",
    "examples": [
      {
        "input": "[1, 2, 3, 4, 5]",
        "output": "[5, 4, 3, 2, 1]"
      },
      {
        "input": "[1]",
        "output": "[1]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] reverseArray(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "[5, 4, 3, 2, 1]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1, 2]",
        "expectedOutput": "[2, 1]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[7, 7, 7]",
        "expectedOutput": "[7, 7, 7]",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[1, 2, 3, 4, 5]",
        "expectedOutput": "[5, 4, 3, 2, 1]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You do not need extra array space — think about swapping elements from the outside in."
      },
      {
        "order": 2,
        "text": "Use two pointers: one starting at index 0, one at the last index."
      },
      {
        "order": 3,
        "text": "Swap the two pointers' values, then move left forward and right backward until they meet."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-reverse",
      "steps": [
        {
          "left": 0,
          "right": 4,
          "action": "swap"
        },
        {
          "left": 1,
          "right": 3,
          "action": "swap"
        },
        {
          "left": 2,
          "right": 2,
          "action": "pointers-meet"
        },
        {
          "left": 2,
          "right": 2,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "The Two Pointer pattern swaps elements from both ends toward the center, requiring only O(1) extra space and a single pass over half the array.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int[] reverseArray(int[] nums) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int temp = nums[left];\n            nums[left] = nums[right];\n            nums[right] = temp;\n            left++; right--;\n        }\n        return nums;\n    }\n}\n"
    },
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 4,
    "title": "Move Zeroes",
    "topic": "Arrays",
    "pattern": "Two Pointer",
    "difficulty": "easy",
    "description": "Given an array, move all zeroes to the end while maintaining the relative order of non-zero elements. Do this in place.",
    "examples": [
      {
        "input": "[0, 1, 0, 3, 12]",
        "output": "[1, 3, 12, 0, 0]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] moveZeroes(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[0, 1, 0, 3, 12]",
        "expectedOutput": "[1, 3, 12, 0, 0]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[0]",
        "expectedOutput": "[0]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1, 2, 3]",
        "expectedOutput": "[1, 2, 3]",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[0, 0, 0]",
        "expectedOutput": "[0, 0, 0]",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[0, 1, 0, 3, 12]",
        "expectedOutput": "[1, 3, 12, 0, 0]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think of maintaining a \"boundary\" pointer marking where the next non-zero value should go."
      },
      {
        "order": 2,
        "text": "Walk through the array with a second pointer; whenever you find a non-zero, swap it into the boundary position."
      },
      {
        "order": 3,
        "text": "Advance the boundary pointer every time you place a non-zero value."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-partition",
      "steps": [
        {
          "insertPos": 0,
          "i": 0,
          "value": 0,
          "action": "skip-zero"
        },
        {
          "insertPos": 0,
          "i": 1,
          "value": 1,
          "action": "swap-into-boundary"
        },
        {
          "insertPos": 1,
          "i": 2,
          "value": 0,
          "action": "skip-zero"
        },
        {
          "insertPos": 1,
          "i": 3,
          "value": 3,
          "action": "swap-into-boundary"
        },
        {
          "insertPos": 2,
          "i": 4,
          "value": 12,
          "action": "swap-into-boundary"
        },
        {
          "insertPos": 3,
          "i": 4,
          "value": 12,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A slow pointer tracks the next position for a non-zero element. A fast pointer scans the array; whenever it finds a non-zero, it is swapped into the slow pointer's position, and the slow pointer advances. This preserves order in a single O(n) pass.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int[] moveZeroes(int[] nums) {\n        int insertPos = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) {\n                int temp = nums[insertPos];\n                nums[insertPos] = nums[i];\n                nums[i] = temp;\n                insertPos++;\n            }\n        }\n        return nums;\n    }\n}\n"
    },
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 5,
    "title": "Sort 0s, 1s and 2s",
    "topic": "Arrays",
    "pattern": "Three Pointer (Dutch National Flag)",
    "difficulty": "medium",
    "description": "Given an array containing only 0s, 1s, and 2s, sort it in place in a single pass without using a library sort function.",
    "examples": [
      {
        "input": "[2, 0, 2, 1, 1, 0]",
        "output": "[0, 0, 1, 1, 2, 2]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "nums[i] is 0, 1, or 2"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] sortColors(int[] nums) {\n        // Write your solution here\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[2, 0, 2, 1, 1, 0]",
        "expectedOutput": "[0, 0, 1, 1, 2, 2]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[0]",
        "expectedOutput": "[0]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1, 1, 1]",
        "expectedOutput": "[1, 1, 1]",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[2, 2, 0, 0]",
        "expectedOutput": "[0, 0, 2, 2]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "[2, 0, 2, 1, 1, 0]",
        "expectedOutput": "[0, 0, 1, 1, 2, 2]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is a classic three-way partitioning problem — think of it as sorting into three regions."
      },
      {
        "order": 2,
        "text": "Use three pointers: low, mid, and high, partitioning the array into 0s | 1s | unknown | 2s."
      },
      {
        "order": 3,
        "text": "When nums[mid] is 0, swap with low and advance both low and mid. When it is 2, swap with high and advance only high. When it is 1, just advance mid."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dutch-national-flag",
      "steps": [
        {
          "low": 0,
          "mid": 0,
          "high": 5,
          "value": 2,
          "action": "swap-with-high"
        },
        {
          "low": 0,
          "mid": 0,
          "high": 4,
          "value": 0,
          "action": "swap-with-low"
        },
        {
          "low": 1,
          "mid": 1,
          "high": 4,
          "value": 0,
          "action": "swap-with-low"
        },
        {
          "low": 2,
          "mid": 2,
          "high": 4,
          "value": 2,
          "action": "swap-with-high"
        },
        {
          "low": 2,
          "mid": 2,
          "high": 3,
          "value": 1,
          "action": "advance-mid"
        },
        {
          "low": 2,
          "mid": 4,
          "high": 3,
          "value": null,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "The Dutch National Flag algorithm partitions the array into three regions using low, mid, and high pointers, resolving each element in a single pass without extra space — swapping 0s toward the front and 2s toward the back while mid scans through.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int[] sortColors(int[] nums) {\n        int low = 0, mid = 0, high = nums.length - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) { int t = nums[low]; nums[low] = nums[mid]; nums[mid] = t; low++; mid++; }\n            else if (nums[mid] == 1) { mid++; }\n            else { int t = nums[mid]; nums[mid] = nums[high]; nums[high] = t; high--; }\n        }\n        return nums;\n    }\n}\n"
    },
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 6,
    "title": "Rotate Array",
    "topic": "Arrays",
    "pattern": "Cyclic Reversal",
    "difficulty": "medium",
    "description": "Given an array, rotate it to the right by k steps, in place.",
    "examples": [
      {
        "input": "nums=[1,2,3,4,5,6,7], k=3",
        "output": "[5,6,7,1,2,3,4]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "0 <= k <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] rotate(int[] nums, int k) {\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,4,5,6,7], k=3",
        "expectedOutput": "[5,6,7,1,2,3,4]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,2], k=3",
        "expectedOutput": "[2,1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[1,2,3,4,5,6,7], k=3",
        "expectedOutput": "[5,6,7,1,2,3,4]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "k can be larger than the array length — what does k % nums.length give you?"
      },
      {
        "order": 2,
        "text": "Reversing the whole array, then reversing two segments, produces a rotation."
      },
      {
        "order": 3,
        "text": "Reverse the entire array, then reverse the first k elements, then reverse the rest."
      }
    ],
    "visualizationSteps": {
      "algorithm": "array-triple-reversal",
      "steps": [
        {
          "action": "reverse-whole"
        },
        {
          "action": "reverse-first-k"
        },
        {
          "action": "reverse-remaining"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Three reversals (whole array, then the first k, then the rest) produce an in-place rotation in O(n) time and O(1) space, avoiding an extra array.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 7,
    "title": "Majority Element",
    "topic": "Arrays",
    "pattern": "Boyer-Moore Voting",
    "difficulty": "medium",
    "description": "Given an array of size n, find the majority element — the element that appears more than n/2 times. It is guaranteed to always exist.",
    "examples": [
      {
        "input": "[2, 2, 1, 1, 1, 2, 2]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "Majority element always exists"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int majorityElement(int[] nums) {\n        // Write your solution here\n        return nums[0];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[2, 2, 1, 1, 1, 2, 2]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[3, 3, 4]",
        "expectedOutput": "3",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "[2, 2, 1, 1, 1, 2, 2]",
        "expectedOutput": "2",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      },
      {
        "input": "[5, 5, 5, 5]",
        "expectedOutput": "5",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A hashmap counting frequencies works, but can you do it in O(1) space instead?"
      },
      {
        "order": 2,
        "text": "Think of each non-majority element as \"cancelling out\" a majority element."
      },
      {
        "order": 3,
        "text": "Keep a candidate and a count; increment when you see the candidate, decrement otherwise, and swap candidates when count hits 0 (Boyer-Moore Voting)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "boyer-moore-voting",
      "steps": [
        {
          "i": 0,
          "value": 2,
          "candidate": 2,
          "count": 1,
          "action": "init-candidate"
        },
        {
          "i": 1,
          "value": 2,
          "candidate": 2,
          "count": 2,
          "action": "increment"
        },
        {
          "i": 2,
          "value": 1,
          "candidate": 2,
          "count": 1,
          "action": "decrement"
        },
        {
          "i": 3,
          "value": 1,
          "candidate": 2,
          "count": 0,
          "action": "decrement"
        },
        {
          "i": 4,
          "value": 1,
          "candidate": 1,
          "count": 1,
          "action": "swap-candidate"
        },
        {
          "i": 6,
          "value": 2,
          "candidate": 2,
          "count": 1,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Boyer-Moore Voting maintains a candidate and a counter. Matching the candidate increments the counter; a mismatch decrements it. When the counter hits zero, the candidate is replaced. Because the majority element occurs more than n/2 times, it always survives as the final candidate — O(n) time, O(1) space.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int majorityElement(int[] nums) {\n        int candidate = nums[0], count = 0;\n        for (int n : nums) {\n            if (count == 0) candidate = n;\n            count += (n == candidate) ? 1 : -1;\n        }\n        return candidate;\n    }\n}\n"
    },
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 8,
    "title": "Best Time to Buy and Sell Stock",
    "topic": "Arrays",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given an array of stock prices where prices[i] is the price on day i, find the maximum profit from a single buy followed by a single sell. If no profit is possible, return 0.",
    "examples": [
      {
        "input": "[7, 1, 5, 3, 6, 4]",
        "output": "5",
        "explanation": "Buy at 1, sell at 6."
      },
      {
        "input": "[7, 6, 4, 3, 1]",
        "output": "0",
        "explanation": "Prices only decrease; no profit possible."
      }
    ],
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution here\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[7, 1, 5, 3, 6, 4]",
        "expectedOutput": "5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[7, 6, 4, 3, 1]",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "0",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[2, 2, 2]",
        "expectedOutput": "0",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[7, 1, 5, 3, 6, 4]",
        "expectedOutput": "5",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You only get to buy once and sell once, and selling must happen after buying."
      },
      {
        "order": 2,
        "text": "As you scan left to right, keep track of the lowest price seen so far."
      },
      {
        "order": 3,
        "text": "At each day, compute the profit if you sold today (price - minSoFar) and track the best one."
      }
    ],
    "visualizationSteps": {
      "algorithm": "window-min-profit",
      "steps": [
        {
          "i": 0,
          "price": 7,
          "minSoFar": 7,
          "bestProfit": 0,
          "action": "init"
        },
        {
          "i": 1,
          "price": 1,
          "minSoFar": 1,
          "bestProfit": 0,
          "action": "new-min"
        },
        {
          "i": 2,
          "price": 5,
          "minSoFar": 1,
          "bestProfit": 4,
          "action": "update-profit"
        },
        {
          "i": 4,
          "price": 6,
          "minSoFar": 1,
          "bestProfit": 5,
          "action": "update-profit"
        },
        {
          "i": 5,
          "price": 4,
          "minSoFar": 1,
          "bestProfit": 5,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Track the minimum price seen so far while scanning once. At each day, the best possible profit if selling today is price - minSoFar. Keep a running maximum of that value across the whole scan — a single-pass O(n) solution.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE, best = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > best) best = p - minPrice;\n        }\n        return best;\n    }\n}\n"
    },
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 9,
    "title": "Kadane's Algorithm",
    "topic": "Arrays",
    "pattern": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given an integer array, find the contiguous subarray with the largest sum and return that sum.",
    "examples": [
      {
        "input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "output": "6",
        "explanation": "Subarray [4, -1, 2, 1] has sum 6."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "expectedOutput": "6",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[-1, -2, -3]",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "[5, 5, 5, 5]",
        "expectedOutput": "20",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "[-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        "expectedOutput": "6",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each position, decide: should I extend the previous subarray, or start a new one here?"
      },
      {
        "order": 2,
        "text": "If the running sum becomes negative, it can only hurt a future subarray — consider resetting it."
      },
      {
        "order": 3,
        "text": "Track currentSum = max(nums[i], currentSum + nums[i]), and keep a running maxSum across all positions."
      }
    ],
    "visualizationSteps": {
      "algorithm": "kadane",
      "steps": [
        {
          "i": 0,
          "value": -2,
          "currentSum": -2,
          "maxSum": -2,
          "action": "init"
        },
        {
          "i": 1,
          "value": 1,
          "currentSum": 1,
          "maxSum": 1,
          "action": "restart"
        },
        {
          "i": 3,
          "value": 4,
          "currentSum": 4,
          "maxSum": 4,
          "action": "restart"
        },
        {
          "i": 6,
          "value": 1,
          "currentSum": 6,
          "maxSum": 6,
          "action": "extend"
        },
        {
          "i": 8,
          "value": 4,
          "currentSum": 4,
          "maxSum": 6,
          "action": "restart"
        },
        {
          "i": 8,
          "value": 4,
          "currentSum": 4,
          "maxSum": 6,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Kadane's Algorithm is dynamic programming in disguise: at each index, currentSum is either the element alone or the element added to the previous currentSum, whichever is larger. A running maxSum tracks the best subarray found so far — one pass, O(n) time, O(1) space.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int maxSubArray(int[] nums) {\n        int currentSum = nums[0], maxSum = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            currentSum = Math.max(nums[i], currentSum + nums[i]);\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n}\n"
    },
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 10,
    "title": "Product of Array Except Self",
    "topic": "Arrays",
    "pattern": "Prefix/Suffix Product",
    "difficulty": "medium",
    "description": "Return an array where each element is the product of all other elements, without using division and in O(n) time.",
    "examples": [
      {
        "input": "[1,2,3,4]",
        "output": "[24,12,8,6]"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "No division allowed"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1) extra (excluding output)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        return new int[nums.length];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,4]",
        "expectedOutput": "[24,12,8,6]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[0,4,0]",
        "expectedOutput": "[0,0,0]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[-1,1,0,-3,3]",
        "expectedOutput": "[0,0,9,0,0]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The product except self equals prefix product × suffix product for that index."
      },
      {
        "order": 2,
        "text": "Build a prefix-products array in one pass, left to right."
      },
      {
        "order": 3,
        "text": "Then sweep right to left, multiplying by a running suffix product into the result array."
      }
    ],
    "visualizationSteps": {
      "algorithm": "prefix-suffix-product",
      "steps": [
        {
          "action": "build-prefix-pass"
        },
        {
          "action": "build-suffix-pass"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Compute prefix products left-to-right and suffix products right-to-left, combining them so each index gets the product of everything except itself, all in O(n) with O(1) extra space.",
    "xp": 250,
    "isBoss": false
  }
];
