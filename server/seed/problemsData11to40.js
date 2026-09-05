// problemsData11to40.js for DSA 100 Doors.

module.exports = [
  {
    "doorNumber": 11,
    "title": "Maximum Product Subarray",
    "topic": "Arrays",
    "pattern": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Find the contiguous subarray with the largest product and return that product.",
    "examples": [
      {
        "input": "[2,3,-2,4]",
        "output": "6"
      },
      {
        "input": "[-2,0,-1]",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxProduct(int[] nums) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[2,3,-2,4]",
        "expectedOutput": "6",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[-2,0,-1]",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[-2,3,-4]",
        "expectedOutput": "24",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A negative number can flip the smallest product into the largest — track more than just a running max."
      },
      {
        "order": 2,
        "text": "At each index, keep both a running max product and a running min product."
      },
      {
        "order": 3,
        "text": "When nums[i] is negative, swap the running max and min before updating them."
      }
    ],
    "visualizationSteps": {
      "algorithm": "kadane-product",
      "steps": [
        {
          "action": "init"
        },
        {
          "action": "track-max-and-min"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Because a negative number can turn the smallest product into the largest, track both a running maximum and minimum product at each index, swapping them when the current number is negative.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 12,
    "title": "Merge Sorted Arrays",
    "topic": "Arrays",
    "pattern": "Two Pointer",
    "difficulty": "medium",
    "description": "Given two sorted arrays nums1 (with trailing zero-space of length m+n) and nums2 of length n, merge nums2 into nums1 in place so nums1 becomes one sorted array.",
    "examples": [
      {
        "input": "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3",
        "output": "[1, 2, 2, 3, 5, 6]"
      }
    ],
    "constraints": [
      "0 <= m, n <= 10^5",
      "nums1.length == m + n"
    ],
    "expectedComplexity": {
      "time": "O(m + n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] merge(int[] nums1, int m, int[] nums2, int n) {\n        // Write your solution here\n        return nums1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3",
        "expectedOutput": "[1, 2, 2, 3, 5, 6]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums1=[0], m=0, nums2=[1], n=1",
        "expectedOutput": "[1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums1=[1], m=1, nums2=[], n=0",
        "expectedOutput": "[1]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      },
      {
        "input": "nums1=[2,2,2,0,0,0], m=3, nums2=[2,2,2], n=3",
        "expectedOutput": "[2,2,2,2,2,2]",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3",
        "expectedOutput": "[1, 2, 2, 3, 5, 6]",
        "type": "Large Input Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Merging from the front requires shifting elements — what if you filled the array from the back instead?"
      },
      {
        "order": 2,
        "text": "Use three pointers: one at the end of the real nums1 data, one at the end of nums2, one at the very end of the array."
      },
      {
        "order": 3,
        "text": "Compare the two \"end\" pointers, place the larger value at the back pointer, and move inward."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-merge-from-end",
      "steps": [
        {
          "p1": 2,
          "p2": 2,
          "write": 5,
          "action": "place-nums2-larger"
        },
        {
          "p1": 2,
          "p2": 1,
          "write": 4,
          "action": "place-nums1-larger"
        },
        {
          "p1": 1,
          "p2": 1,
          "write": 3,
          "action": "place-nums2-larger"
        },
        {
          "p1": 1,
          "p2": 0,
          "write": 2,
          "action": "place-nums1-equal-nums2"
        },
        {
          "p1": 0,
          "p2": -1,
          "write": 1,
          "action": "copy-remaining-nums1"
        },
        {
          "p1": -1,
          "p2": -1,
          "write": -1,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Filling from the back avoids overwriting unread values in nums1. Three pointers track the last real element of nums1, the last element of nums2, and the last write position. The larger of the two candidates is placed at the write position each step, moving all pointers inward — O(m+n) time, O(1) extra space.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int[] merge(int[] nums1, int m, int[] nums2, int n) {\n        int p1 = m - 1, p2 = n - 1, write = m + n - 1;\n        while (p2 >= 0) {\n            if (p1 >= 0 && nums1[p1] > nums2[p2]) { nums1[write--] = nums1[p1--]; }\n            else { nums1[write--] = nums2[p2--]; }\n        }\n        return nums1;\n    }\n}\n"
    },
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 13,
    "title": "Find the Duplicate Number",
    "topic": "Arrays",
    "pattern": "Floyd's Cycle Detection",
    "difficulty": "medium",
    "description": "Given an array of n+1 integers where each is between 1 and n, find the one duplicate number, without modifying the array and using O(1) space.",
    "examples": [
      {
        "input": "[1,3,4,2,2]",
        "output": "2"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "Exactly one repeated number exists"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int findDuplicate(int[] nums) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,3,4,2,2]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[3,1,3,4,2]",
        "expectedOutput": "3",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,3,4,2,2]",
        "expectedOutput": "2",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think of each value nums[i] as a pointer to index nums[i] — this creates a linked structure with a cycle."
      },
      {
        "order": 2,
        "text": "This is Floyd's Tortoise and Hare cycle detection in disguise."
      },
      {
        "order": 3,
        "text": "Find the meeting point of slow/fast pointers, then reset one pointer to the start and advance both one step at a time to find the cycle entrance — that entrance is the duplicate."
      }
    ],
    "visualizationSteps": {
      "algorithm": "floyd-cycle-detection",
      "steps": [
        {
          "action": "move-slow-fast"
        },
        {
          "action": "find-meeting-point"
        },
        {
          "action": "find-cycle-entrance"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Treating array values as next-pointers turns duplicate-finding into cycle detection. Floyd's algorithm finds the meeting point of a slow and fast pointer, then locates the cycle's entrance — which is exactly the duplicate value — in O(n) time and O(1) space.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 14,
    "title": "Sort Array By Parity",
    "topic": "Arrays",
    "pattern": "Two Pointer",
    "difficulty": "easy",
    "description": "Given an array of integers, move all even numbers to the front, followed by all odd numbers. Any correct order within each group is acceptable.",
    "examples": [
      {
        "input": "[3,1,2,4]",
        "output": "[4,2,1,3] (any valid arrangement)"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] sortArrayByParity(int[] nums) {\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[3,1,2,4]",
        "expectedOutput": "evens before odds",
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
        "input": "all odd numbers",
        "expectedOutput": "unchanged order acceptable",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is a partitioning problem, similar to Move Zeroes."
      },
      {
        "order": 2,
        "text": "Use two pointers, one from the start and one from the end."
      },
      {
        "order": 3,
        "text": "If the left pointer finds an odd number and the right finds an even number, swap them and move both inward."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-partition-parity",
      "steps": [
        {
          "action": "scan-inward"
        },
        {
          "action": "swap-odd-even"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Two pointers converge from both ends; whenever the left pointer sits on an odd number and the right on an even one, swap them. This partitions the array into evens-then-odds in a single O(n) pass.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 15,
    "title": "Next Permutation",
    "topic": "Arrays",
    "pattern": "Two Pointer",
    "difficulty": "hard",
    "description": "Rearrange numbers into the lexicographically next greater permutation. If no such permutation exists, rearrange to the lowest possible order (sorted ascending). Modify in place.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "[1,3,2]"
      },
      {
        "input": "[3,2,1]",
        "output": "[1,2,3]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] nextPermutation(int[] nums) {\n        return nums;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3]",
        "expectedOutput": "[1,3,2]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[3,2,1]",
        "expectedOutput": "[1,2,3]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[1,1,5]",
        "expectedOutput": "[1,5,1]",
        "type": "Duplicate Case Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Scan from the right to find the first index where the sequence stops increasing — this is your pivot."
      },
      {
        "order": 2,
        "text": "Find the smallest element to the right of the pivot that is larger than it, and swap them."
      },
      {
        "order": 3,
        "text": "Reverse everything to the right of the pivot to get the smallest possible suffix."
      }
    ],
    "visualizationSteps": {
      "algorithm": "next-permutation",
      "steps": [
        {
          "action": "find-pivot-from-right"
        },
        {
          "action": "find-successor-to-swap"
        },
        {
          "action": "reverse-suffix"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Find the rightmost ascending pair (the pivot), swap it with the smallest larger value to its right, then reverse the suffix after the pivot to make it as small as possible — the standard next-permutation algorithm.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 16,
    "title": "Two Sum",
    "topic": "Hashing",
    "pattern": "Hashing",
    "difficulty": "easy",
    "description": "Given an array of integers and a target, return the indices of the two numbers that add up to the target. Assume exactly one solution exists.",
    "examples": [
      {
        "input": "nums = [2, 7, 4, 5], target = 9",
        "output": "[0, 1]",
        "explanation": "2 + 7 = 9"
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^5",
      "Exactly one valid answer exists"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{-1, -1};\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[2,7,4,5], target=9",
        "expectedOutput": "[0, 1]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[3,3], target=6",
        "expectedOutput": "[0, 1]",
        "type": "Duplicate Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[-1,-2,-3,-4], target=-6",
        "expectedOutput": "[1, 3]",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "nums = [2, 7, 4, 5], target = 9",
        "expectedOutput": "[0, 1]",
        "type": "Large Input Key",
        "isHidden": true,
        "difficulty": "hard"
      },
      {
        "input": "nums=[0,4,3,0], target=0",
        "expectedOutput": "[0, 3]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think about what information you need to remember while traversing the array."
      },
      {
        "order": 2,
        "text": "Can a HashMap help you find the required complement in constant time?"
      },
      {
        "order": 3,
        "text": "For every nums[i], calculate target - nums[i] and check if it already exists in your map."
      }
    ],
    "visualizationSteps": {
      "algorithm": "hashmap-two-sum",
      "steps": [
        {
          "i": 0,
          "value": 2,
          "complement": 7,
          "mapState": {},
          "action": "check-complement-miss"
        },
        {
          "i": 0,
          "value": 2,
          "complement": 7,
          "mapState": {
            "2": 0
          },
          "action": "insert"
        },
        {
          "i": 1,
          "value": 7,
          "complement": 2,
          "mapState": {
            "2": 0
          },
          "action": "check-complement-hit"
        },
        {
          "i": 1,
          "value": 7,
          "complement": 2,
          "mapState": {
            "2": 0
          },
          "action": "found",
          "result": [
            0,
            1
          ]
        }
      ]
    },
    "solutionExplanation": "A HashMap stores each visited value mapped to its index. For every element, we compute target - nums[i] and check if that complement already exists in the map — an O(1) lookup — instead of nested loops. This gets us to O(n) time.",
    "referenceSolution": {
      "language": "java",
      "code": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{-1, -1};\n    }\n}\n"
    },
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 17,
    "title": "Contains Duplicate",
    "topic": "Hashing",
    "pattern": "Hashing",
    "difficulty": "easy",
    "description": "Given an array, return true if any value appears at least twice.",
    "examples": [
      {
        "input": "[1,2,3,1]",
        "output": "true"
      },
      {
        "input": "[1,2,3,4]",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,1]",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1,2,3,4]",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1,2,3,1]",
        "expectedOutput": "true",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A Set lets you check \"have I seen this before\" in constant time."
      },
      {
        "order": 2,
        "text": "Walk the array, and before adding each value, check if it is already in your Set."
      },
      {
        "order": 3,
        "text": "If you ever find a value already in the Set, return true immediately."
      }
    ],
    "visualizationSteps": {
      "algorithm": "hashset-membership",
      "steps": [
        {
          "action": "check-and-insert"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A HashSet gives O(1) average lookup. Scan once, checking membership before insertion; a hit means a duplicate exists.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 18,
    "title": "Valid Anagram",
    "topic": "Hashing",
    "pattern": "Hashing",
    "difficulty": "easy",
    "description": "Given two strings, determine if one is an anagram of the other.",
    "examples": [
      {
        "input": "s=\"anagram\", t=\"nagaram\"",
        "output": "true"
      },
      {
        "input": "s=\"rat\", t=\"car\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length, t.length <= 5*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1) (fixed alphabet)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "s=\"anagram\", t=\"nagaram\"",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "s=\"rat\", t=\"car\"",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "different lengths",
        "expectedOutput": "false",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Two strings are anagrams only if they have the same length and the same character counts."
      },
      {
        "order": 2,
        "text": "Use a fixed-size array (26 for lowercase letters) as a frequency counter."
      },
      {
        "order": 3,
        "text": "Increment counts for s, decrement for t; if every count ends at zero, they are anagrams."
      }
    ],
    "visualizationSteps": {
      "algorithm": "char-frequency-count",
      "steps": [
        {
          "action": "count-s"
        },
        {
          "action": "subtract-t"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A fixed-size frequency array counts each character in s and decrements for t. If all counts return to zero, the strings are anagrams — O(n) time, O(1) space for a bounded alphabet.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 19,
    "title": "Group Anagrams",
    "topic": "Hashing",
    "pattern": "Hashing",
    "difficulty": "medium",
    "description": "Given an array of strings, group the anagrams together.",
    "examples": [
      {
        "input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]"
      }
    ],
    "constraints": [
      "1 <= strs.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n * k log k)",
      "space": "O(n * k)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "expectedOutput": "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[\"\"]",
        "expectedOutput": "[[\"\"]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "expectedOutput": "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Anagrams share something in common that can serve as a HashMap key."
      },
      {
        "order": 2,
        "text": "Sorting the characters of each word produces a canonical form shared by all its anagrams."
      },
      {
        "order": 3,
        "text": "Map each sorted-word key to a list of original words that share it."
      }
    ],
    "visualizationSteps": {
      "algorithm": "hashmap-canonical-key",
      "steps": [
        {
          "action": "sort-each-word"
        },
        {
          "action": "group-by-key"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Sorting each word's letters produces a canonical signature shared only by its anagrams. A HashMap from that signature to a list of matching words groups them in one pass.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 20,
    "title": "Top K Frequent Elements",
    "topic": "Hashing",
    "pattern": "Hashing + Heap",
    "difficulty": "medium",
    "description": "Given an array and an integer k, return the k most frequent elements.",
    "examples": [
      {
        "input": "nums=[1,1,1,2,2,3], k=2",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is within the range of distinct elements"
    ],
    "expectedComplexity": {
      "time": "O(n log k)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        return new int[k];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[1,1,1,2,2,3], k=2",
        "expectedOutput": "[1,2]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[1], k=1",
        "expectedOutput": "[1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[1,1,1,2,2,3], k=2",
        "expectedOutput": "[1,2]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "First count how often each value occurs using a HashMap."
      },
      {
        "order": 2,
        "text": "A min-heap of size k can track the k largest counts efficiently as you scan."
      },
      {
        "order": 3,
        "text": "Push each (value, count) pair onto the heap; if the heap exceeds size k, pop the smallest."
      }
    ],
    "visualizationSteps": {
      "algorithm": "heap-top-k",
      "steps": [
        {
          "action": "count-frequencies"
        },
        {
          "action": "maintain-min-heap"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Count frequencies with a HashMap, then maintain a min-heap of size k over those counts. Elements bumped out of the heap are guaranteed less frequent than the final k, giving O(n log k) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 21,
    "title": "Longest Consecutive Sequence",
    "topic": "Hashing",
    "pattern": "Hashing",
    "difficulty": "medium",
    "description": "Given an unsorted array of integers, find the length of the longest run of consecutive integers, in O(n) time.",
    "examples": [
      {
        "input": "[100,4,200,1,3,2]",
        "output": "4",
        "explanation": "The sequence 1,2,3,4 has length 4."
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int longestConsecutive(int[] nums) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[100,4,200,1,3,2]",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[]",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[100,4,200,1,3,2]",
        "expectedOutput": "4",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Put every number into a Set first so membership checks are O(1)."
      },
      {
        "order": 2,
        "text": "Only start counting a sequence from a number that has no predecessor (num - 1) in the set."
      },
      {
        "order": 3,
        "text": "From each sequence start, keep checking num+1, num+2, ... while they exist in the set, tracking the run length."
      }
    ],
    "visualizationSteps": {
      "algorithm": "hashset-sequence-scan",
      "steps": [
        {
          "action": "build-set"
        },
        {
          "action": "find-sequence-starts"
        },
        {
          "action": "extend-runs"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Loading all numbers into a Set lets each potential sequence start (a number with no num-1 in the set) extend forward in O(1) steps per check. Every number is visited a constant number of times overall, giving O(n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 22,
    "title": "Subarray Sum Equals K",
    "topic": "Hashing",
    "pattern": "Prefix Sum + Hashing",
    "difficulty": "medium",
    "description": "Given an array of integers and an integer k, return the total number of contiguous subarrays whose sum equals k.",
    "examples": [
      {
        "input": "nums=[1,1,1], k=2",
        "output": "2"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int subarraySum(int[] nums, int k) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[1,1,1], k=2",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[1,2,3], k=3",
        "expectedOutput": "2",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "contains negatives",
        "expectedOutput": "count",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A running prefix sum turns \"sum of a subarray\" into a difference of two prefix sums."
      },
      {
        "order": 2,
        "text": "You need count[j] where prefixSum[i] - prefixSum[j] == k, i.e. prefixSum[j] == prefixSum[i] - k."
      },
      {
        "order": 3,
        "text": "Store how many times each prefix sum has occurred in a HashMap as you scan, checking for prefixSum - k at each step."
      }
    ],
    "visualizationSteps": {
      "algorithm": "prefix-sum-hashmap",
      "steps": [
        {
          "action": "track-running-sum"
        },
        {
          "action": "lookup-complement-count"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A running prefix sum plus a HashMap of prefix-sum frequencies lets you count, at each index, how many earlier prefixes equal (currentSum - k) — each is the start of a valid subarray. One pass, O(n).",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 23,
    "title": "Valid Palindrome",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "easy",
    "description": "Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring case.",
    "examples": [
      {
        "input": "\"A man, a plan, a canal: Panama\"",
        "output": "true"
      },
      {
        "input": "\"race a car\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 2*10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "\"A man, a plan, a canal: Panama\"",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "\"race a car\"",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "\"\"",
        "expectedOutput": "true",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You can check a palindrome without building a cleaned copy of the string first."
      },
      {
        "order": 2,
        "text": "Use two pointers starting at both ends, skipping over non-alphanumeric characters."
      },
      {
        "order": 3,
        "text": "Compare lowercase versions of the characters at each pointer, moving inward until they cross."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-palindrome",
      "steps": [
        {
          "action": "skip-non-alnum"
        },
        {
          "action": "compare-chars"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Two pointers move inward from both ends, skipping non-alphanumeric characters and comparing lowercase letters. A mismatch means not a palindrome; pointers crossing means it is — O(n) time, O(1) space.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 24,
    "title": "Two Sum II - Input Array Is Sorted",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "medium",
    "description": "Given a sorted array, find two numbers that add up to a target and return their 1-indexed positions.",
    "examples": [
      {
        "input": "numbers=[2,7,11,15], target=9",
        "output": "[1,2]"
      }
    ],
    "constraints": [
      "2 <= numbers.length <= 3*10^4",
      "numbers is sorted ascending"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        return new int[]{-1, -1};\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "numbers=[2,7,11,15], target=9",
        "expectedOutput": "[1,2]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "numbers=[2,3,4], target=6",
        "expectedOutput": "[1,3]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "numbers=[2,7,11,15], target=9",
        "expectedOutput": "[1,2]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Sorted input means you can avoid a HashMap entirely."
      },
      {
        "order": 2,
        "text": "Start pointers at both ends; the sum tells you which pointer to move."
      },
      {
        "order": 3,
        "text": "If the sum is too small, move the left pointer right; if too large, move the right pointer left."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-sorted-sum",
      "steps": [
        {
          "action": "compare-sum-to-target"
        },
        {
          "action": "move-pointer"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Because the array is sorted, two pointers at each end can converge: if the sum is too small move left forward, if too large move right backward — O(n) time, O(1) space, no extra map needed.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 25,
    "title": "Remove Duplicates from Sorted Array",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "easy",
    "description": "Given a sorted array, remove duplicates in place so each unique element appears once, and return the new length.",
    "examples": [
      {
        "input": "[1,1,2]",
        "output": "2, array becomes [1,2,...]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 3*10^4",
      "nums is sorted ascending"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int removeDuplicates(int[] nums) {\n        return nums.length;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,1,2]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[0,0,1,1,1,2,2,3,3,4]",
        "expectedOutput": "5",
        "type": "Duplicate Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,1,2]",
        "expectedOutput": "2, array becomes [1,2,...]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A slow pointer can track where the next unique value should be written."
      },
      {
        "order": 2,
        "text": "Walk through with a fast pointer; when its value differs from the last written value, write it."
      },
      {
        "order": 3,
        "text": "Compare nums[fast] to nums[slow] — if different, increment slow and copy the value there."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-dedupe",
      "steps": [
        {
          "action": "scan-and-compare"
        },
        {
          "action": "write-unique"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A slow pointer marks the boundary of unique elements written so far, while a fast pointer scans ahead. Because the array is sorted, comparing nums[fast] to the last written value is enough to detect a new unique value — O(n), O(1) extra space.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 26,
    "title": "3Sum",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "medium",
    "description": "Given an array, find all unique triplets that sum to zero.",
    "examples": [
      {
        "input": "[-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]"
      }
    ],
    "constraints": [
      "3 <= nums.length <= 3000"
    ],
    "expectedComplexity": {
      "time": "O(n^2)",
      "space": "O(log n) to O(n) for sort"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[-1,0,1,2,-1,-4]",
        "expectedOutput": "[[-1,-1,2],[-1,0,1]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[0,0,0]",
        "expectedOutput": "[[0,0,0]]",
        "type": "Duplicate Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "3000 elements",
        "expectedOutput": "all zero-sum triplets",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Sort the array first — it makes both duplicate-skipping and pointer movement possible."
      },
      {
        "order": 2,
        "text": "Fix one number, then use the Two Pointer technique to find pairs that complete the triplet with the remaining sorted subarray."
      },
      {
        "order": 3,
        "text": "After sorting, for each fixed index i, use left/right pointers spanning i+1..end, skipping duplicate values to avoid repeated triplets."
      }
    ],
    "visualizationSteps": {
      "algorithm": "sorted-two-pointer-triplet",
      "steps": [
        {
          "action": "sort-array"
        },
        {
          "action": "fix-first-element"
        },
        {
          "action": "two-pointer-scan"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "After sorting, fixing one element and running the sorted Two Pointer technique on the rest finds complementary pairs in O(n) per fixed element, giving O(n^2) overall while skipping duplicates to keep triplets unique.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 27,
    "title": "Container With Most Water",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "medium",
    "description": "Given heights of vertical lines, find two lines that together with the x-axis form a container holding the most water.",
    "examples": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "output": "49"
      }
    ],
    "constraints": [
      "2 <= height.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "expectedOutput": "49",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,1]",
        "expectedOutput": "1",
        "type": "Boundary Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1,8,6,2,5,4,8,3,7]",
        "expectedOutput": "49",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The area is limited by the shorter of the two lines — moving the taller one inward never helps."
      },
      {
        "order": 2,
        "text": "Start with the widest possible container: pointers at both ends."
      },
      {
        "order": 3,
        "text": "Always move the pointer at the shorter line inward, recomputing the area each time."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-container",
      "steps": [
        {
          "action": "compute-area"
        },
        {
          "action": "move-shorter-pointer"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Start with the widest container (pointers at both ends). Since area is capped by the shorter line, moving the taller pointer inward can only shrink or keep area the same — so always advance the shorter side, in O(n) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 28,
    "title": "Four Sum Count II",
    "topic": "Two Pointers",
    "pattern": "Hashing",
    "difficulty": "hard",
    "description": "Given four integer arrays of equal length, count how many tuples (i, j, k, l) exist such that nums1[i] + nums2[j] + nums3[k] + nums4[l] == 0.",
    "examples": [
      {
        "input": "nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]",
        "output": "2"
      }
    ],
    "constraints": [
      "n == nums1.length == nums2.length == nums3.length == nums4.length",
      "1 <= n <= 200"
    ],
    "expectedComplexity": {
      "time": "O(n^2)",
      "space": "O(n^2)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int fourSumCount(int[] nums1, int[] nums2, int[] nums3, int[] nums4) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums1=[1,2], nums2=[-2,-1], nums3=[-1,2], nums4=[0,2]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums1=[0], nums2=[0], nums3=[0], nums4=[0]",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums1=[-1,-1], nums2=[-1,1], nums3=[-1,1], nums4=[1,-1]",
        "expectedOutput": "6",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Checking all four arrays together is O(n^4) — split the problem into two halves."
      },
      {
        "order": 2,
        "text": "Precompute every possible sum of one element from nums1 and one from nums2, storing counts in a HashMap."
      },
      {
        "order": 3,
        "text": "For every pair from nums3 and nums4, look up -(that sum) in your precomputed map and add its count."
      }
    ],
    "visualizationSteps": {
      "algorithm": "meet-in-the-middle-hashing",
      "steps": [
        {
          "action": "precompute-pair-sums"
        },
        {
          "action": "lookup-negated-sum"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Meet-in-the-middle: precompute all pairwise sums of nums1+nums2 into a HashMap of sum→count (O(n^2)), then for each pairwise sum of nums3+nums4, look up its negation in that map — reducing an O(n^4) brute force to O(n^2).",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 29,
    "title": "Trapping Rain Water",
    "topic": "Two Pointers",
    "pattern": "Two Pointer",
    "difficulty": "hard",
    "description": "Given elevation heights, compute how much water can be trapped between the bars after raining.",
    "examples": [
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6"
      }
    ],
    "constraints": [
      "1 <= height.length <= 2*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int trap(int[] height) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "expectedOutput": "6",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[4,2,0,3,2,5]",
        "expectedOutput": "9",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[0,1,0,2,1,0,1,3,2,1,2,1]",
        "expectedOutput": "6",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Water trapped at any position is limited by the shorter of the tallest bar to its left and the tallest to its right."
      },
      {
        "order": 2,
        "text": "Rather than precomputing both arrays, can two pointers track the running max from each side simultaneously?"
      },
      {
        "order": 3,
        "text": "Move the pointer on the side with the smaller max height inward, adding trapped water as (that side's max - current height)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-trap-water",
      "steps": [
        {
          "action": "track-left-right-max"
        },
        {
          "action": "move-smaller-side"
        },
        {
          "action": "accumulate-water"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Two pointers track the running max height seen from the left and right. At each step, advance the side with the smaller max — the water trapped there is guaranteed to be (that max - current height), giving an O(n) single-pass solution without extra arrays.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 30,
    "title": "Maximum Sum Subarray of Size K",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "easy",
    "description": "Given an array and an integer k, find the maximum sum of any contiguous subarray of size k.",
    "examples": [
      {
        "input": "nums=[2,1,5,1,3,2], k=3",
        "output": "9"
      }
    ],
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxSumSubarray(int[] nums, int k) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[2,1,5,1,3,2], k=3",
        "expectedOutput": "9",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "k == nums.length",
        "expectedOutput": "sum of whole array",
        "type": "Boundary Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[2,1,5,1,3,2], k=3",
        "expectedOutput": "9",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Recomputing the sum of every window from scratch is wasteful — what changes between consecutive windows?"
      },
      {
        "order": 2,
        "text": "A fixed-size window can slide by subtracting the element leaving and adding the element entering."
      },
      {
        "order": 3,
        "text": "Compute the first window sum, then slide: newSum = oldSum - nums[i-k] + nums[i], tracking the max."
      }
    ],
    "visualizationSteps": {
      "algorithm": "fixed-sliding-window",
      "steps": [
        {
          "action": "compute-first-window"
        },
        {
          "action": "slide-window"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A fixed-size sliding window avoids recomputation: after the first window sum is computed, each slide only removes the outgoing element and adds the incoming one — O(n) time overall instead of O(n*k).",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 31,
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given a string, find the length of the longest substring without repeating characters.",
    "examples": [
      {
        "input": "\"abcabcbb\"",
        "output": "3"
      },
      {
        "input": "\"bbbbb\"",
        "output": "1"
      }
    ],
    "constraints": [
      "0 <= s.length <= 5*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(min(n, alphabet size))"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "\"abcabcbb\"",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "\"\"",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "\"abcabcbb\"",
        "expectedOutput": "3",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This calls for a variable-size window that grows and shrinks as needed."
      },
      {
        "order": 2,
        "text": "Track the last seen index of each character in a HashMap."
      },
      {
        "order": 3,
        "text": "When you see a repeated character inside the current window, jump the window's left edge past its previous occurrence."
      }
    ],
    "visualizationSteps": {
      "algorithm": "variable-sliding-window",
      "steps": [
        {
          "action": "expand-right"
        },
        {
          "action": "detect-repeat"
        },
        {
          "action": "shrink-left"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A sliding window expands by moving its right edge, and a HashMap of last-seen character indices lets the left edge jump directly past any repeat, keeping every character processed a constant number of times — O(n) overall.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 32,
    "title": "Minimum Size Subarray Sum",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given an array of positive integers and a target sum, find the minimal length of a contiguous subarray whose sum is at least target. Return 0 if none exists.",
    "examples": [
      {
        "input": "target=7, nums=[2,3,1,2,4,3]",
        "output": "2",
        "explanation": "[4,3] has sum 7."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^5",
      "1 <= nums[i] <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int minSubArrayLen(int target, int[] nums) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "target=7, nums=[2,3,1,2,4,3]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "target=100, nums=[1,1,1]",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "target=7, nums=[2,3,1,2,4,3]",
        "expectedOutput": "2",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Since all numbers are positive, growing the window always increases the sum — that monotonicity is key."
      },
      {
        "order": 2,
        "text": "Expand the window's right edge until the sum meets target, then try shrinking from the left."
      },
      {
        "order": 3,
        "text": "Every time the window sum is >= target, record the window length and shrink from the left until it drops below target again."
      }
    ],
    "visualizationSteps": {
      "algorithm": "variable-sliding-window-min",
      "steps": [
        {
          "action": "expand-until-target-met"
        },
        {
          "action": "shrink-and-record"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Because all values are positive, the window sum grows monotonically as the window expands. Expanding right until the sum meets target, then shrinking left while it still does, finds the minimal valid window in O(n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 33,
    "title": "Longest Repeating Character Replacement",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given a string and an integer k, you can replace up to k characters. Find the length of the longest substring containing the same letter after replacements.",
    "examples": [
      {
        "input": "s=\"ABAB\", k=2",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^5",
      "0 <= k <= s.length"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1) (fixed alphabet)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int characterReplacement(String s, int k) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "s=\"ABAB\", k=2",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "s=\"AABABBA\", k=1",
        "expectedOutput": "4",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "s=\"ABAB\", k=2",
        "expectedOutput": "4",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A window is valid if (window length - count of its most frequent character) <= k."
      },
      {
        "order": 2,
        "text": "Track character counts within the current window as it expands."
      },
      {
        "order": 3,
        "text": "If the window becomes invalid, shrink from the left rather than resetting the max character count."
      }
    ],
    "visualizationSteps": {
      "algorithm": "sliding-window-char-count",
      "steps": [
        {
          "action": "expand-track-max-freq"
        },
        {
          "action": "shrink-if-invalid"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A window is valid whenever its length minus the count of its most frequent character is at most k (that many replacements needed). Expanding right and shrinking left only when invalid keeps the window's max size non-decreasing, giving O(n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 34,
    "title": "Permutation in String",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given two strings s1 and s2, return true if s2 contains a permutation of s1 as a contiguous substring.",
    "examples": [
      {
        "input": "s1=\"ab\", s2=\"eidbaooo\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 <= s1.length, s2.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1) (fixed alphabet)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "s1=\"ab\", s2=\"eidbaooo\"",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "s1=\"ab\", s2=\"eidboaoo\"",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "s1=\"ab\", s2=\"eidbaooo\"",
        "expectedOutput": "true",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A permutation of s1 has exactly the same character counts as s1, in any order."
      },
      {
        "order": 2,
        "text": "Slide a fixed-size window of length s1.length across s2, tracking character counts inside it."
      },
      {
        "order": 3,
        "text": "Compare the window's character-count array to s1's character-count array at each slide."
      }
    ],
    "visualizationSteps": {
      "algorithm": "fixed-sliding-window-freq-match",
      "steps": [
        {
          "action": "build-target-counts"
        },
        {
          "action": "slide-and-compare"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A fixed-size window matching s1's length slides across s2, maintaining a running character-count array. If that array ever matches s1's character counts exactly, a permutation exists — O(n) with a constant-size alphabet comparison.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 35,
    "title": "Fruit Into Baskets",
    "topic": "Sliding Window",
    "pattern": "Sliding Window",
    "difficulty": "medium",
    "description": "Given an array representing fruit types on a row of trees, you have two baskets, each can hold only one type of fruit. Find the length of the longest subarray with at most two distinct types.",
    "examples": [
      {
        "input": "[1,2,1]",
        "output": "3"
      },
      {
        "input": "[0,1,2,2]",
        "output": "3"
      }
    ],
    "constraints": [
      "1 <= fruits.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int totalFruit(int[] fruits) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,1]",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[0,1,2,2]",
        "expectedOutput": "3",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,2,1]",
        "expectedOutput": "3",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is really \"longest substring with at most 2 distinct values\" wearing a fruit costume."
      },
      {
        "order": 2,
        "text": "Track counts of each fruit type currently in the window using a HashMap."
      },
      {
        "order": 3,
        "text": "When the window has more than 2 distinct types, shrink from the left until it has at most 2 again."
      }
    ],
    "visualizationSteps": {
      "algorithm": "sliding-window-distinct-limit",
      "steps": [
        {
          "action": "expand-track-types"
        },
        {
          "action": "shrink-if-too-many-types"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "This is the \"at most K distinct\" sliding window pattern with K=2. A HashMap tracks counts of fruit types in the window; whenever a third type appears, shrink from the left until only two remain — O(n) overall.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 36,
    "title": "Sliding Window Maximum",
    "topic": "Sliding Window",
    "pattern": "Monotonic Deque",
    "difficulty": "hard",
    "description": "Given an array and a window size k, return the maximum value in each sliding window as it moves from left to right.",
    "examples": [
      {
        "input": "nums=[1,3,-1,-3,5,3,6,7], k=3",
        "output": "[3,3,5,5,6,7]"
      }
    ],
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(k)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        return new int[0];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[1,3,-1,-3,5,3,6,7], k=3",
        "expectedOutput": "[3,3,5,5,6,7]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "k == nums.length",
        "expectedOutput": "single max",
        "type": "Boundary Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[1,3,-1,-3,5,3,6,7], k=3",
        "expectedOutput": "[3,3,5,5,6,7]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Recomputing the max of every window is O(n*k) — too slow for large inputs."
      },
      {
        "order": 2,
        "text": "Maintain a deque of indices where values are in decreasing order — the front is always the current max."
      },
      {
        "order": 3,
        "text": "Before adding a new index, pop smaller values from the back; before reading the max, pop indices that fell out of the window from the front."
      }
    ],
    "visualizationSteps": {
      "algorithm": "monotonic-deque-window-max",
      "steps": [
        {
          "action": "push-and-pop-smaller"
        },
        {
          "action": "evict-out-of-window"
        },
        {
          "action": "record-front-as-max"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A monotonic decreasing deque of indices keeps the current window's maximum always at the front. Each index is pushed and popped at most once, giving O(n) total time despite the appearance of nested work.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 37,
    "title": "Binary Search",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "easy",
    "description": "Given a sorted array and a target value, return the index of target, or -1 if not found, in O(log n) time.",
    "examples": [
      {
        "input": "nums=[-1,0,3,5,9,12], target=9",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4",
      "nums sorted ascending, all unique"
    ],
    "expectedComplexity": {
      "time": "O(log n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[-1,0,3,5,9,12], target=9",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[-1,0,3,5,9,12], target=2",
        "expectedOutput": "-1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[-1,0,3,5,9,12], target=9",
        "expectedOutput": "4",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Sorted data means you can eliminate half the search space with one comparison."
      },
      {
        "order": 2,
        "text": "Keep left and right boundaries; compare the middle element to target."
      },
      {
        "order": 3,
        "text": "If nums[mid] < target search the right half, if greater search the left half, else return mid."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search",
      "steps": [
        {
          "left": 0,
          "right": 5,
          "mid": 2,
          "action": "check-mid"
        },
        {
          "left": 3,
          "right": 5,
          "mid": 4,
          "action": "move-right"
        },
        {
          "left": 4,
          "right": 4,
          "mid": 4,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Binary search halves the search space each step by comparing the target to the middle element and discarding the half that cannot contain it — O(log n) time.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 38,
    "title": "Search Insert Position",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "easy",
    "description": "Given a sorted array and a target, return the index if found; otherwise return the index where it would be inserted to keep the array sorted.",
    "examples": [
      {
        "input": "nums=[1,3,5,6], target=5",
        "output": "2"
      },
      {
        "input": "nums=[1,3,5,6], target=2",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(log n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[1,3,5,6], target=5",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[1,3,5,6], target=7",
        "expectedOutput": "4",
        "type": "Boundary Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "target smaller than all",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is standard binary search, but you need to know where the pointers land even on a miss."
      },
      {
        "order": 2,
        "text": "Track left and right boundaries as usual, narrowing the range based on comparisons with mid."
      },
      {
        "order": 3,
        "text": "When the loop ends without finding target, the left pointer is exactly the correct insertion index."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-insert",
      "steps": [
        {
          "left": 0,
          "right": 3,
          "mid": 1,
          "action": "check-mid"
        },
        {
          "left": 2,
          "right": 3,
          "mid": 2,
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Standard binary search narrows left/right boundaries; when the loop exits without a match, the left pointer has naturally converged to the correct insertion point, since it always represents \"first index that could hold target\".",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 39,
    "title": "Find First and Last Position of Element in Sorted Array",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "medium",
    "description": "Given a sorted array possibly containing duplicates, find the starting and ending index of a given target value's range.",
    "examples": [
      {
        "input": "nums=[5,7,7,8,8,10], target=8",
        "output": "[3,4]"
      }
    ],
    "constraints": [
      "0 <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(log n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] searchRange(int[] nums, int target) {\n        return new int[]{-1, -1};\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[5,7,7,8,8,10], target=8",
        "expectedOutput": "[3,4]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[5,7,7,8,8,10], target=6",
        "expectedOutput": "[-1,-1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[5,7,7,8,8,10], target=8",
        "expectedOutput": "[3,4]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You essentially need two separate binary searches, not one."
      },
      {
        "order": 2,
        "text": "One search should find the leftmost occurrence, another the rightmost."
      },
      {
        "order": 3,
        "text": "When nums[mid] == target during the \"find leftmost\" search, keep searching left (right = mid - 1) instead of stopping immediately, and mirror that for rightmost."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-bounds",
      "steps": [
        {
          "action": "search-leftmost"
        },
        {
          "action": "search-rightmost"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Two variants of binary search find the range: one biased to keep narrowing left when it finds a match (locating the first occurrence), one biased to keep narrowing right (locating the last) — both still O(log n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 40,
    "title": "Search in Rotated Sorted Array",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "medium",
    "description": "Given a rotated sorted array with unique values, search for a target and return its index, or -1 if not present, in O(log n).",
    "examples": [
      {
        "input": "nums=[4,5,6,7,0,1,2], target=0",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000",
      "nums was originally sorted then rotated"
    ],
    "expectedComplexity": {
      "time": "O(log n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[4,5,6,7,0,1,2], target=0",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "nums=[4,5,6,7,0,1,2], target=3",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "no rotation at all",
        "expectedOutput": "standard binary search result",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At any mid point, at least one of the two halves is still normally sorted — figure out which."
      },
      {
        "order": 2,
        "text": "Compare nums[left] to nums[mid] to determine whether the left half is the sorted one."
      },
      {
        "order": 3,
        "text": "Once you know which half is sorted, check if target lies within that half's range to decide which side to search next."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-rotated",
      "steps": [
        {
          "action": "identify-sorted-half"
        },
        {
          "action": "check-target-in-range"
        },
        {
          "action": "narrow-search"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "At each midpoint, one half of the array (left-to-mid or mid-to-right) is guaranteed to be normally sorted. Checking which half is sorted, then whether the target falls in its range, lets you eliminate half the array each step — still O(log n) despite the rotation.",
    "xp": 250,
    "isBoss": false
  }
];
