// problemsData41to70.js for DSA 100 Doors.

module.exports = [
  {
    "doorNumber": 41,
    "title": "Find Minimum in Rotated Sorted Array",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "medium",
    "description": "Given a rotated sorted array with unique values, find the minimum element in O(log n) time.",
    "examples": [
      {
        "input": "[3,4,5,1,2]",
        "output": "1"
      },
      {
        "input": "[4,5,6,7,0,1,2]",
        "output": "0"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(log n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int findMin(int[] nums) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[3,4,5,1,2]",
        "expectedOutput": "1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "5000 elements, rotated near end",
        "expectedOutput": "minimum value",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The minimum sits exactly where the rotation \"breaks\" the ascending order."
      },
      {
        "order": 2,
        "text": "Compare nums[mid] to nums[right] to decide which half still contains the break point."
      },
      {
        "order": 3,
        "text": "If nums[mid] > nums[right], the minimum is to the right of mid; otherwise it is at or to the left of mid."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-find-min",
      "steps": [
        {
          "action": "compare-mid-to-right"
        },
        {
          "action": "narrow-to-break-point"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Comparing nums[mid] to nums[right] reveals which half contains the rotation point (where the minimum lives). Repeatedly narrowing toward that break point finds the minimum in O(log n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 42,
    "title": "Koko Eating Bananas",
    "topic": "Binary Search",
    "pattern": "Binary Search on Answer",
    "difficulty": "medium",
    "description": "Koko eats bananas from piles at a fixed speed k per hour, one pile at a time. Find the minimum integer k so she can eat all bananas within h hours.",
    "examples": [
      {
        "input": "piles=[3,6,7,11], h=8",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= piles.length <= 10^4",
      "piles.length <= h <= 10^9"
    ],
    "expectedComplexity": {
      "time": "O(n log m)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int minEatingSpeed(int[] piles, int h) {\n        return 1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "piles=[3,6,7,11], h=8",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "piles=[30,11,23,4,20], h=5",
        "expectedOutput": "30",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "piles=[3,6,7,11], h=8",
        "expectedOutput": "4",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is not searching an array — it is searching the space of possible eating speeds (the \"answer\")."
      },
      {
        "order": 2,
        "text": "For a given speed k, you can compute exactly how many hours it takes to finish all piles."
      },
      {
        "order": 3,
        "text": "Binary search over k from 1 to max(piles), checking \"is this speed fast enough within h hours\" at each mid."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-on-answer",
      "steps": [
        {
          "action": "try-mid-speed"
        },
        {
          "action": "compute-hours-needed"
        },
        {
          "action": "narrow-speed-range"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Binary search over the answer space (possible speeds 1..max(piles)) rather than the input array. For each candidate speed, computing total hours needed is O(n), giving O(n log m) overall where m is the largest pile.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 43,
    "title": "Search a 2D Matrix",
    "topic": "Binary Search",
    "pattern": "Binary Search",
    "difficulty": "medium",
    "description": "Given an m x n matrix where each row is sorted ascending and the first integer of each row is greater than the last integer of the previous row, determine if a target value exists, in O(log(m*n)) time.",
    "examples": [
      {
        "input": "matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3",
        "output": "true"
      }
    ],
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "expectedComplexity": {
      "time": "O(log(m*n))",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean searchMatrix(int[][] matrix, int target) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "matrix=[[1]], target=1",
        "expectedOutput": "true",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The matrix behaves like a single flattened sorted array — you do not need to search rows separately."
      },
      {
        "order": 2,
        "text": "Map a single mid index into (row, col) using division and modulo by the number of columns."
      },
      {
        "order": 3,
        "text": "Run standard binary search over indices 0 to m*n-1, converting each mid to matrix[mid/cols][mid%cols]."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-2d-as-1d",
      "steps": [
        {
          "action": "map-mid-to-row-col"
        },
        {
          "action": "compare-and-narrow"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Because rows are sorted and chained (each row's first value exceeds the previous row's last), the whole matrix behaves like one flattened sorted array. Standard binary search works by converting a flat index to (row, col) via division and modulo.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 44,
    "title": "Median of Two Sorted Arrays",
    "topic": "Binary Search",
    "pattern": "Binary Search on Partition",
    "difficulty": "hard",
    "description": "Given two sorted arrays, find the median of the two combined, in O(log(min(m,n))) time.",
    "examples": [
      {
        "input": "nums1=[1,3], nums2=[2]",
        "output": "2.0"
      },
      {
        "input": "nums1=[1,2], nums2=[3,4]",
        "output": "2.5"
      }
    ],
    "constraints": [
      "0 <= m, n <= 1000",
      "At least one array is non-empty"
    ],
    "expectedComplexity": {
      "time": "O(log(min(m, n)))",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums1=[1,3], nums2=[2]",
        "expectedOutput": "2.0",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "nums1=[1,2], nums2=[3,4]",
        "expectedOutput": "2.5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "one array empty",
        "expectedOutput": "median of the other",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "hard"
      },
      {
        "input": "1000 elements each",
        "expectedOutput": "correct median",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Merging both arrays would work but is O(m+n) — this problem wants a logarithmic solution."
      },
      {
        "order": 2,
        "text": "Binary search on a partition point in the smaller array; the partition in the other array is then determined."
      },
      {
        "order": 3,
        "text": "Find a partition where every element on the left side of both arrays combined is <= every element on the right side — the median comes directly from the boundary values."
      }
    ],
    "visualizationSteps": {
      "algorithm": "binary-search-partition-median",
      "steps": [
        {
          "action": "binary-search-partition-in-smaller-array"
        },
        {
          "action": "derive-partition-in-larger-array"
        },
        {
          "action": "validate-boundary-condition"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Binary searching a partition index in the smaller array (and deriving the matching partition in the larger one) finds a split where all left-side elements are ≤ all right-side elements. The median follows directly from the four boundary values — O(log(min(m,n))).",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 45,
    "title": "Reverse Linked List",
    "topic": "Linked List",
    "pattern": "Iterative Pointer Reversal",
    "difficulty": "easy",
    "description": "Given the head of a singly linked list, reverse the list and return the new head.",
    "examples": [
      {
        "input": "1 -> 2 -> 3 -> 4 -> 5",
        "output": "5 -> 4 -> 3 -> 2 -> 1"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "// ListNode is predefined: class ListNode { int val; ListNode next; }\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        return head;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "1->2->3->4->5",
        "expectedOutput": "5->4->3->2->1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "empty list",
        "expectedOutput": "empty list",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "single node",
        "expectedOutput": "same single node",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You need to change the direction of every \"next\" pointer."
      },
      {
        "order": 2,
        "text": "Keep track of the previous node as you walk forward, since you will need to point back to it."
      },
      {
        "order": 3,
        "text": "At each node, save its next pointer, point it backward to prev, then advance prev and current forward."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linked-list-iterative-reverse",
      "steps": [
        {
          "action": "save-next"
        },
        {
          "action": "point-backward"
        },
        {
          "action": "advance-pointers"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Walking the list while re-pointing each node's \"next\" back to the previous node reverses the list in a single O(n) pass using three pointers (prev, current, next) and O(1) space.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 46,
    "title": "Middle of the Linked List",
    "topic": "Linked List",
    "pattern": "Fast & Slow Pointers",
    "difficulty": "easy",
    "description": "Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second.",
    "examples": [
      {
        "input": "1->2->3->4->5",
        "output": "3"
      },
      {
        "input": "1->2->3->4->5->6",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public ListNode middleNode(ListNode head) {\n        return head;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "[3,4,5]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1,2,3,4,5,6]",
        "expectedOutput": "[4,5,6]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Finding the middle usually requires knowing the length first — unless you use two pointers moving at different speeds."
      },
      {
        "order": 2,
        "text": "A slow pointer moves one step at a time; a fast pointer moves two steps."
      },
      {
        "order": 3,
        "text": "When the fast pointer reaches the end, the slow pointer is exactly at the middle."
      }
    ],
    "visualizationSteps": {
      "algorithm": "fast-slow-pointer",
      "steps": [
        {
          "action": "move-slow-one-fast-two"
        },
        {
          "action": "fast-reaches-end"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A slow pointer advances one node at a time while a fast pointer advances two. When the fast pointer reaches the end of the list, the slow pointer has covered exactly half the distance — landing on the middle node in one O(n) pass.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 47,
    "title": "Linked List Cycle",
    "topic": "Linked List",
    "pattern": "Fast & Slow Pointers",
    "difficulty": "easy",
    "description": "Given the head of a linked list, determine if the list has a cycle in it.",
    "examples": [
      {
        "input": "list with a cycle back to an earlier node",
        "output": "true"
      },
      {
        "input": "list with no cycle",
        "output": "false"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,4]",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1]",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "[1,2]",
        "expectedOutput": "false",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "If two runners move at different speeds around a circular track, they will eventually meet."
      },
      {
        "order": 2,
        "text": "Use a slow pointer (1 step) and a fast pointer (2 steps)."
      },
      {
        "order": 3,
        "text": "If the fast pointer ever equals the slow pointer, there is a cycle; if fast reaches null, there is not."
      }
    ],
    "visualizationSteps": {
      "algorithm": "floyd-cycle-detection-list",
      "steps": [
        {
          "action": "move-slow-fast"
        },
        {
          "action": "check-meeting-or-null"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Floyd's Tortoise and Hare: a slow and fast pointer traverse the list at different speeds. If the list has a cycle, they are guaranteed to meet inside it; if not, the fast pointer reaches null first.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 48,
    "title": "Merge Two Sorted Lists",
    "topic": "Linked List",
    "pattern": "Two Pointer / Merge",
    "difficulty": "easy",
    "description": "Merge two sorted linked lists into one sorted list by splicing their nodes together.",
    "examples": [
      {
        "input": "list1=1->2->4, list2=1->3->4",
        "output": "1->1->2->3->4->4"
      }
    ],
    "constraints": [
      "0 <= nodes in each list <= 50"
    ],
    "expectedComplexity": {
      "time": "O(n + m)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "list1=1->2->4, list2=1->3->4",
        "expectedOutput": "1->1->2->3->4->4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "both empty",
        "expectedOutput": "empty list",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "one list empty",
        "expectedOutput": "the other list unchanged",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A dummy head node simplifies building the merged list without special-casing the first node."
      },
      {
        "order": 2,
        "text": "Compare the current nodes of both lists, attaching the smaller one to the merged list each time."
      },
      {
        "order": 3,
        "text": "When one list runs out, attach the rest of the other list directly."
      }
    ],
    "visualizationSteps": {
      "algorithm": "merge-two-lists",
      "steps": [
        {
          "action": "compare-heads"
        },
        {
          "action": "attach-smaller"
        },
        {
          "action": "attach-remainder"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Using a dummy head node and a tail pointer, repeatedly compare the front of both lists and attach the smaller node to the merged list. Once one list is exhausted, splice in the rest of the other — O(n+m) time, O(1) extra space.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 49,
    "title": "Remove Nth Node From End of List",
    "topic": "Linked List",
    "pattern": "Two Pointer (Gap)",
    "difficulty": "medium",
    "description": "Given the head of a linked list, remove the nth node from the end and return the head, in one pass.",
    "examples": [
      {
        "input": "head=1->2->3->4->5, n=2",
        "output": "1->2->3->5"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 30",
      "1 <= n <= number of nodes"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        return head;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "head=1->2->3->4->5, n=2",
        "expectedOutput": "1->2->3->5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "head=1, n=1",
        "expectedOutput": "empty list",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "remove the head (n == length)",
        "expectedOutput": "list without first node",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You do not need to know the list length beforehand if you keep two pointers a fixed gap apart."
      },
      {
        "order": 2,
        "text": "Advance a \"fast\" pointer n steps ahead of a \"slow\" pointer first."
      },
      {
        "order": 3,
        "text": "Then move both together until fast reaches the end; slow will be right before the node to remove."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-pointer-gap-removal",
      "steps": [
        {
          "action": "advance-fast-n-steps"
        },
        {
          "action": "move-both-together"
        },
        {
          "action": "unlink-target-node"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Advancing a fast pointer n steps ahead of a slow pointer, then moving both together, positions the slow pointer exactly before the target node when fast reaches the end — a single O(n) pass with a dummy head to handle removing the first node cleanly.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 50,
    "title": "Palindrome Linked List",
    "topic": "Linked List",
    "pattern": "Fast & Slow Pointers + Reversal",
    "difficulty": "medium",
    "description": "Given the head of a singly linked list, determine if it is a palindrome, ideally in O(1) extra space.",
    "examples": [
      {
        "input": "1->2->2->1",
        "output": "true"
      },
      {
        "input": "1->2",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isPalindrome(ListNode head) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "1->2->2->1",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "1->2",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "1->2->2->1",
        "expectedOutput": "true",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Copying to an array works but uses O(n) space — can you avoid that?"
      },
      {
        "order": 2,
        "text": "Find the middle of the list using fast/slow pointers, then reverse the second half in place."
      },
      {
        "order": 3,
        "text": "Compare the first half and the reversed second half node by node."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linked-list-palindrome-check",
      "steps": [
        {
          "action": "find-middle"
        },
        {
          "action": "reverse-second-half"
        },
        {
          "action": "compare-halves"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Finding the middle with fast/slow pointers, reversing the second half in place, then comparing both halves node by node checks for a palindrome in O(n) time and O(1) extra space (optionally restoring the list afterward).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 51,
    "title": "Add Two Numbers",
    "topic": "Linked List",
    "pattern": "Simulation",
    "difficulty": "medium",
    "description": "Two non-negative integers are represented as linked lists in reverse order, one digit per node. Add the two numbers and return the sum as a linked list in the same format.",
    "examples": [
      {
        "input": "l1=2->4->3, l2=5->6->4",
        "output": "7->0->8",
        "explanation": "342 + 465 = 807"
      }
    ],
    "constraints": [
      "1 <= nodes in each list <= 100"
    ],
    "expectedComplexity": {
      "time": "O(max(n, m))",
      "space": "O(max(n, m))"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        return null;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "l1=2->4->3, l2=5->6->4",
        "expectedOutput": "7->0->8",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "l1=9->9, l2=1",
        "expectedOutput": "0->0->1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "100-digit numbers",
        "expectedOutput": "correct sum list",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This mirrors how you add numbers by hand, digit by digit, from least significant to most."
      },
      {
        "order": 2,
        "text": "Track a running carry as you walk both lists simultaneously."
      },
      {
        "order": 3,
        "text": "At each step, sum the two digits plus carry, create a node for sum % 10, and update carry to sum / 10; keep going until both lists and the carry are exhausted."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linked-list-digit-addition",
      "steps": [
        {
          "action": "add-digits-with-carry"
        },
        {
          "action": "build-result-node"
        },
        {
          "action": "handle-final-carry"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Since digits are stored least-significant-first, adding the lists mirrors manual addition: walk both simultaneously, summing digits plus a running carry and building result nodes, continuing past the shorter list until both and the carry are exhausted.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 52,
    "title": "Reorder List",
    "topic": "Linked List",
    "pattern": "Fast & Slow Pointers + Reversal + Merge",
    "difficulty": "hard",
    "description": "Given a linked list L0→L1→…→Ln, reorder it in place to L0→Ln→L1→Ln-1→L2→Ln-2→…",
    "examples": [
      {
        "input": "1->2->3->4",
        "output": "1->4->2->3"
      },
      {
        "input": "1->2->3->4->5",
        "output": "1->5->2->4->3"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 5*10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public void reorderList(ListNode head) {\n        // modify in place\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,4]",
        "expectedOutput": "[1,4,2,3]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,2,3,4,5]",
        "expectedOutput": "[1,5,2,4,3]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "[1]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This combines three techniques you already know: find the middle, reverse a half, then merge."
      },
      {
        "order": 2,
        "text": "Split the list into two halves using fast/slow pointers, then reverse the second half."
      },
      {
        "order": 3,
        "text": "Merge the two halves by alternating nodes: first half node, then second (reversed) half node, and so on."
      }
    ],
    "visualizationSteps": {
      "algorithm": "linked-list-reorder",
      "steps": [
        {
          "action": "find-middle-split"
        },
        {
          "action": "reverse-second-half"
        },
        {
          "action": "interleave-merge"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Reordering combines three earlier patterns: find the middle with fast/slow pointers, reverse the second half in place, then interleave-merge the two halves node by node — all in O(n) time and O(1) extra space.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 53,
    "title": "Valid Parentheses",
    "topic": "Stack & Queue",
    "pattern": "Stack",
    "difficulty": "easy",
    "description": "Given a string of brackets ()[]{}, determine if it is valid: every opening bracket is closed by the same type in the correct order.",
    "examples": [
      {
        "input": "\"()[]{}\"",
        "output": "true"
      },
      {
        "input": "\"(]\"",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "\"()[]{}\"",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "\"(]\"",
        "expectedOutput": "false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "\"(((\"",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The most recently opened bracket must be the next one closed — that \"last in, first out\" behavior is a strong hint."
      },
      {
        "order": 2,
        "text": "Push opening brackets onto a stack; when you see a closing bracket, check the top of the stack."
      },
      {
        "order": 3,
        "text": "If the top does not match the expected opening bracket (or the stack is empty), the string is invalid."
      }
    ],
    "visualizationSteps": {
      "algorithm": "stack-bracket-matching",
      "steps": [
        {
          "action": "push-opening"
        },
        {
          "action": "pop-and-match-closing"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A stack naturally models \"last opened, first closed\": push opening brackets, and on each closing bracket check that it matches the top of the stack. Valid only if the stack ends empty.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 54,
    "title": "Min Stack",
    "topic": "Stack & Queue",
    "pattern": "Stack",
    "difficulty": "medium",
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element, all in O(1) time.",
    "examples": [
      {
        "input": "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
        "output": "-3, 0, -2"
      }
    ],
    "constraints": [
      "-2^31 <= val <= 2^31 - 1",
      "pop/top/getMin called only on non-empty stack"
    ],
    "expectedComplexity": {
      "time": "O(1) per operation",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class MinStack {\n    public MinStack() {}\n    public void push(int val) {}\n    public void pop() {}\n    public int top() { return -1; }\n    public int getMin() { return -1; }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
        "expectedOutput": "-3, 0, -2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "push same min value twice, then pop once",
        "expectedOutput": "min unchanged",
        "type": "Duplicate Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "many operations",
        "expectedOutput": "all O(1)",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A single stack cannot tell you the minimum after pops without extra bookkeeping."
      },
      {
        "order": 2,
        "text": "Maintain a second stack that tracks the minimum value at each point in time."
      },
      {
        "order": 3,
        "text": "Push onto the min-stack only when the new value is <= its current top, and pop from it in sync whenever the main stack pops that same minimum."
      }
    ],
    "visualizationSteps": {
      "algorithm": "stack-with-min-tracking",
      "steps": [
        {
          "action": "push-to-both-stacks"
        },
        {
          "action": "pop-in-sync"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A second \"min stack\" tracks the running minimum alongside the main stack, pushing a new minimum whenever the incoming value is <= the current one and popping in sync — giving O(1) getMin without rescanning.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 55,
    "title": "Implement Queue using Stacks",
    "topic": "Stack & Queue",
    "pattern": "Stack",
    "difficulty": "easy",
    "description": "Implement a first-in-first-out queue using only two stacks.",
    "examples": [
      {
        "input": "push(1), push(2), peek(), pop(), empty()",
        "output": "1, 1, false"
      }
    ],
    "constraints": [
      "1 <= number of calls <= 100"
    ],
    "expectedComplexity": {
      "time": "Amortized O(1) per operation",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class MyQueue {\n    public MyQueue() {}\n    public void push(int x) {}\n    public int pop() { return -1; }\n    public int peek() { return -1; }\n    public boolean empty() { return true; }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "push(1), push(2), peek(), pop(), empty()",
        "expectedOutput": "1, 1, false",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "interleaved push/pop calls",
        "expectedOutput": "correct FIFO order",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "100 mixed operations",
        "expectedOutput": "amortized O(1)",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A single stack reverses order — using two stacks can reverse it back to FIFO."
      },
      {
        "order": 2,
        "text": "Use an \"in\" stack for pushes and an \"out\" stack for pops/peeks."
      },
      {
        "order": 3,
        "text": "Only when the \"out\" stack is empty, dump everything from \"in\" into \"out\" (reversing it), then operate on \"out\"."
      }
    ],
    "visualizationSteps": {
      "algorithm": "two-stack-queue",
      "steps": [
        {
          "action": "push-to-in-stack"
        },
        {
          "action": "transfer-to-out-stack-when-empty"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Pushes go onto an \"in\" stack. When \"out\" is empty and a pop/peek is needed, everything from \"in\" is transferred to \"out\", reversing the order back to FIFO. Each element moves between stacks at most once, giving amortized O(1).",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 56,
    "title": "Next Greater Element I",
    "topic": "Stack & Queue",
    "pattern": "Monotonic Stack",
    "difficulty": "easy",
    "description": "For each element in nums1, find its next greater element in nums2 (where nums1 is a subset of nums2); if none exists, use -1.",
    "examples": [
      {
        "input": "nums1=[4,1,2], nums2=[1,3,4,2]",
        "output": "[-1,3,-1]"
      }
    ],
    "constraints": [
      "1 <= nums1.length <= nums2.length <= 1000"
    ],
    "expectedComplexity": {
      "time": "O(n + m)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] nextGreaterElement(int[] nums1, int[] nums2) {\n        return new int[nums1.length];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums1=[4,1,2], nums2=[1,3,4,2]",
        "expectedOutput": "[-1,3,-1]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums1=[2,4], nums2=[1,2,3,4]",
        "expectedOutput": "[3,-1]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "1000 elements",
        "expectedOutput": "all next-greater values",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A brute-force nested loop is O(n*m) — a stack can find every \"next greater\" in one pass over nums2."
      },
      {
        "order": 2,
        "text": "Walk nums2 while maintaining a decreasing stack of values still waiting for their next greater element."
      },
      {
        "order": 3,
        "text": "When the current number is greater than the stack's top, pop and record that number as the top's next greater, repeating until the stack top is bigger (or empty)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "monotonic-stack-next-greater",
      "steps": [
        {
          "action": "push-if-decreasing"
        },
        {
          "action": "pop-and-resolve-when-greater"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A monotonic decreasing stack processes nums2 once: whenever the current value exceeds the stack's top, that top has found its next greater element and is popped. A HashMap records these results for O(1) lookup when building the nums1 answer.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 57,
    "title": "Daily Temperatures",
    "topic": "Stack & Queue",
    "pattern": "Monotonic Stack",
    "difficulty": "medium",
    "description": "Given daily temperatures, return an array where answer[i] is the number of days until a warmer temperature; 0 if none exists.",
    "examples": [
      {
        "input": "[73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]"
      }
    ],
    "constraints": [
      "1 <= temperatures.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[temperatures.length];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[73,74,75,71,69,72,76,73]",
        "expectedOutput": "[1,1,4,2,1,1,0,0]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[30,40,50,60]",
        "expectedOutput": "[1,1,1,0]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[73,74,75,71,69,72,76,73]",
        "expectedOutput": "[1,1,4,2,1,1,0,0]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is the \"next greater element\" pattern, but tracking distance (in days) rather than the value itself."
      },
      {
        "order": 2,
        "text": "Maintain a stack of indices whose warmer day hasn't been found yet."
      },
      {
        "order": 3,
        "text": "When today's temperature exceeds the temperature at the stack's top index, pop it and record today's index minus that index as the wait."
      }
    ],
    "visualizationSteps": {
      "algorithm": "monotonic-stack-indices",
      "steps": [
        {
          "action": "push-index-if-cooler"
        },
        {
          "action": "pop-and-record-distance"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A monotonic decreasing stack of indices tracks days still waiting for a warmer one. When a warmer day appears, popped indices get their answer as (current index - popped index) — every index pushed and popped once, giving O(n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 58,
    "title": "Evaluate Reverse Polish Notation",
    "topic": "Stack & Queue",
    "pattern": "Stack",
    "difficulty": "medium",
    "description": "Evaluate an arithmetic expression given in Reverse Polish Notation (postfix notation).",
    "examples": [
      {
        "input": "[\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "output": "9",
        "explanation": "(2 + 1) * 3 = 9"
      }
    ],
    "constraints": [
      "1 <= tokens.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int evalRPN(String[] tokens) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "expectedOutput": "9",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[\"4\",\"13\",\"5\",\"/\",\"+\"]",
        "expectedOutput": "6",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "expectedOutput": "9",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Postfix notation is built for a stack-based evaluator — no parentheses or precedence rules needed."
      },
      {
        "order": 2,
        "text": "Push numbers onto a stack; when you see an operator, pop the two most recent numbers."
      },
      {
        "order": 3,
        "text": "Apply the operator to the two popped values (second-popped OP first-popped), then push the result back."
      }
    ],
    "visualizationSteps": {
      "algorithm": "stack-postfix-eval",
      "steps": [
        {
          "action": "push-numbers"
        },
        {
          "action": "pop-two-apply-operator"
        },
        {
          "action": "push-result"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A stack evaluates postfix notation directly: numbers are pushed, and each operator pops the two most recent operands, applies itself, and pushes the result back — no precedence parsing required, O(n) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 59,
    "title": "Largest Rectangle in Histogram",
    "topic": "Stack & Queue",
    "pattern": "Monotonic Stack",
    "difficulty": "hard",
    "description": "Given heights of bars in a histogram, find the area of the largest rectangle that fits within it.",
    "examples": [
      {
        "input": "[2,1,5,6,2,3]",
        "output": "10"
      }
    ],
    "constraints": [
      "1 <= heights.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int largestRectangleArea(int[] heights) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[2,1,5,6,2,3]",
        "expectedOutput": "10",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[2,4]",
        "expectedOutput": "4",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "[2,1,5,6,2,3]",
        "expectedOutput": "10",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "For every bar, the largest rectangle using its height extends left and right until a shorter bar blocks it."
      },
      {
        "order": 2,
        "text": "Maintain a stack of indices with increasing heights."
      },
      {
        "order": 3,
        "text": "When a shorter bar appears, pop taller bars from the stack, computing each popped bar's max rectangle using the current index and the new stack top as boundaries."
      }
    ],
    "visualizationSteps": {
      "algorithm": "monotonic-stack-histogram",
      "steps": [
        {
          "action": "push-increasing-heights"
        },
        {
          "action": "pop-and-compute-area"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A monotonic increasing stack of bar indices lets each bar's maximal rectangle be computed exactly once: when a shorter bar forces a pop, the popped bar's width is determined by the current index and the new stack top — O(n) since each index is pushed and popped once.",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 60,
    "title": "Basic Calculator II",
    "topic": "Stack & Queue",
    "pattern": "Stack",
    "difficulty": "hard",
    "description": "Evaluate a simple expression string containing non-negative integers and +, -, *, / operators (no parentheses), respecting operator precedence.",
    "examples": [
      {
        "input": "\"3+2*2\"",
        "output": "7"
      },
      {
        "input": "\" 3/2 \"",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= s.length <= 3*10^5"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int calculate(String s) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "\"3+2*2\"",
        "expectedOutput": "7",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "\" 3/2 \"",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "\"3+2*2\"",
        "expectedOutput": "7",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Addition and subtraction can be deferred, but multiplication and division must happen immediately due to precedence."
      },
      {
        "order": 2,
        "text": "Push each number onto a stack; for + just push it, for - push its negation."
      },
      {
        "order": 3,
        "text": "For * and /, pop the last pushed number, apply the operator with the current number, and push the result back — sum the stack at the end."
      }
    ],
    "visualizationSteps": {
      "algorithm": "stack-precedence-eval",
      "steps": [
        {
          "action": "parse-number-and-operator"
        },
        {
          "action": "apply-immediate-or-defer"
        },
        {
          "action": "sum-stack"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A stack holds signed numbers to be summed at the end. Addition/subtraction just push a (possibly negated) number; multiplication/division pop the previous number, apply the operator immediately, and push the result — correctly respecting precedence without parsing a full expression tree.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 61,
    "title": "Fibonacci Number (Recursion)",
    "topic": "Recursion & Backtracking",
    "pattern": "Recursion with Memoization",
    "difficulty": "easy",
    "description": "Compute the nth Fibonacci number using recursion, optimized with memoization to avoid exponential blowup.",
    "examples": [
      {
        "input": "n=2",
        "output": "1"
      },
      {
        "input": "n=10",
        "output": "55"
      }
    ],
    "constraints": [
      "0 <= n <= 30"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int fib(int n) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "n=2",
        "expectedOutput": "1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "n=10",
        "expectedOutput": "55",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "n=30",
        "expectedOutput": "832040",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Plain recursion recomputes the same subproblems many times — that is the real cost, not the recursion itself."
      },
      {
        "order": 2,
        "text": "Cache each computed fib(n) in a map or array the first time you compute it."
      },
      {
        "order": 3,
        "text": "Before recursing, check if fib(n) is already cached and return it directly if so."
      }
    ],
    "visualizationSteps": {
      "algorithm": "recursion-call-stack",
      "steps": [
        {
          "action": "recursive-call"
        },
        {
          "action": "check-memo-cache"
        },
        {
          "action": "base-case-return"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Naive recursion recomputes overlapping subproblems exponentially. Memoizing each fib(n) the first time it is computed turns this into O(n) time by ensuring each value is computed exactly once.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 62,
    "title": "Subsets",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "medium",
    "description": "Given an array of unique integers, return all possible subsets (the power set).",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10"
    ],
    "expectedComplexity": {
      "time": "O(2^n)",
      "space": "O(2^n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3]",
        "expectedOutput": "all 8 subsets",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[0]",
        "expectedOutput": "[[],[0]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "10 elements",
        "expectedOutput": "all 1024 subsets",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Each element has exactly two choices: include it in the current subset, or don't."
      },
      {
        "order": 2,
        "text": "Build subsets with backtracking: recurse forward through the array, adding the current subset to results at every recursive call."
      },
      {
        "order": 3,
        "text": "For each index, first recurse without including nums[i], then include it, recurse, and remove it (backtrack) before returning."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-decision-tree",
      "steps": [
        {
          "action": "choose-include"
        },
        {
          "action": "recurse"
        },
        {
          "action": "backtrack-exclude"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Backtracking explores a binary decision tree — include or exclude each element — recording the current subset at every node of the tree. With n elements there are 2^n subsets, matching the exponential time and space.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 63,
    "title": "Permutations",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "medium",
    "description": "Given an array of distinct integers, return all possible permutations.",
    "examples": [
      {
        "input": "[1,2,3]",
        "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 6"
    ],
    "expectedComplexity": {
      "time": "O(n!)",
      "space": "O(n!)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3]",
        "expectedOutput": "all 6 permutations",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1]",
        "expectedOutput": "[[1]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "6 elements",
        "expectedOutput": "all 720 permutations",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each position of the permutation, you choose one of the remaining unused numbers."
      },
      {
        "order": 2,
        "text": "Track which numbers are already used in the current path with a boolean array or set."
      },
      {
        "order": 3,
        "text": "Recurse by trying each unused number, marking it used, recursing, then unmarking it (backtracking) before trying the next."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-permutation-tree",
      "steps": [
        {
          "action": "choose-unused-number"
        },
        {
          "action": "recurse-deeper"
        },
        {
          "action": "backtrack-unmark"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Backtracking builds each permutation position by position, trying every not-yet-used number, recursing, and then un-choosing it to try the next option — exploring all n! orderings via a decision tree.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 64,
    "title": "Combination Sum",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "medium",
    "description": "Given an array of distinct positive integers (candidates, reusable unlimited times) and a target, return all unique combinations that sum to target.",
    "examples": [
      {
        "input": "candidates=[2,3,6,7], target=7",
        "output": "[[2,2,3],[7]]"
      }
    ],
    "constraints": [
      "1 <= candidates.length <= 30",
      "2 <= target <= 40"
    ],
    "expectedComplexity": {
      "time": "Exponential (bounded by target/min candidate)",
      "space": "O(target)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> combinationSum(int[] candidates, int target) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "candidates=[2,3,6,7], target=7",
        "expectedOutput": "[[2,2,3],[7]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "candidates=[2], target=1",
        "expectedOutput": "[]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "target=40, many candidates",
        "expectedOutput": "all valid combinations",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Since numbers can repeat, at each step you can either reuse the current candidate or move to the next one."
      },
      {
        "order": 2,
        "text": "Sort candidates first so you can prune branches early once the remaining target goes negative."
      },
      {
        "order": 3,
        "text": "Recurse with (index, remainingTarget): try including candidates[index] again (same index) or moving to index+1, backtracking after each choice."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-combination-sum",
      "steps": [
        {
          "action": "try-reuse-or-advance"
        },
        {
          "action": "prune-if-negative"
        },
        {
          "action": "record-if-zero"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Backtracking recurses on (current index, remaining target), allowing the same candidate to be reused by not advancing the index. Sorting first allows pruning branches as soon as remaining target goes negative, keeping the exponential search efficient in practice.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 65,
    "title": "Generate Parentheses",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "medium",
    "description": "Given n pairs of parentheses, generate all combinations of well-formed parentheses strings.",
    "examples": [
      {
        "input": "n=3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]"
      }
    ],
    "constraints": [
      "1 <= n <= 8"
    ],
    "expectedComplexity": {
      "time": "O(4^n / sqrt(n))",
      "space": "Same (Catalan number bound)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<String> generateParenthesis(int n) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "n=3",
        "expectedOutput": "5 valid strings",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "n=1",
        "expectedOutput": "[\"()\"]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "n=8",
        "expectedOutput": "all 1430 valid strings",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each step you can add an opening or closing bracket, but not any sequence is valid."
      },
      {
        "order": 2,
        "text": "Track counts of open and close brackets used so far in the current path."
      },
      {
        "order": 3,
        "text": "Only add an open bracket if open < n; only add a close bracket if close < open."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-parentheses",
      "steps": [
        {
          "action": "add-open-if-allowed"
        },
        {
          "action": "add-close-if-allowed"
        },
        {
          "action": "record-when-length-2n"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Backtracking builds strings character by character, only adding \"(\" while open count < n and only adding \")\" while close count < open count — this constraint alone guarantees every generated string is well-formed, avoiding invalid branches entirely.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 66,
    "title": "Word Search",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking (DFS on Grid)",
    "difficulty": "medium",
    "description": "Given a 2D grid of letters and a word, determine if the word can be formed by sequentially adjacent cells (horizontally or vertically), without reusing a cell.",
    "examples": [
      {
        "input": "board=[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word=\"ABCCED\"",
        "output": "true"
      }
    ],
    "constraints": [
      "1 <= board rows, cols <= 6",
      "1 <= word.length <= 15"
    ],
    "expectedComplexity": {
      "time": "O(rows * cols * 4^L)",
      "space": "O(L) recursion depth"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean exist(char[][] board, String word) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "board=[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word=\"ABCCED\"",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "board=[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word=\"SEE\"",
        "expectedOutput": "true",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "board=[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word=\"ABCB\"",
        "expectedOutput": "false",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Try starting the search from every cell that matches the word's first letter."
      },
      {
        "order": 2,
        "text": "From a matching cell, explore all four directions recursively, matching the next letter of the word."
      },
      {
        "order": 3,
        "text": "Mark a cell as visited before recursing into it, and un-mark it (backtrack) after, so it can be reused on a different path."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-grid-dfs",
      "steps": [
        {
          "action": "try-starting-cell"
        },
        {
          "action": "explore-four-directions"
        },
        {
          "action": "mark-and-unmark-visited"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A DFS-with-backtracking explores all four directions from each matching cell, temporarily marking cells visited to avoid reuse within a single path, then un-marking them when backtracking to allow other paths to reuse that cell.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 67,
    "title": "Palindrome Partitioning",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "medium",
    "description": "Given a string, partition it such that every substring in the partition is a palindrome. Return all possible partitions.",
    "examples": [
      {
        "input": "\"aab\"",
        "output": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]"
      }
    ],
    "constraints": [
      "1 <= s.length <= 16"
    ],
    "expectedComplexity": {
      "time": "O(n * 2^n)",
      "space": "O(n) recursion depth"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<String>> partition(String s) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "\"aab\"",
        "expectedOutput": "[[\"a\",\"a\",\"b\"],[\"aa\",\"b\"]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "\"a\"",
        "expectedOutput": "[[\"a\"]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "16-char string",
        "expectedOutput": "all valid partitions",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each position, try every possible \"next cut\" and check if the piece before it is a palindrome."
      },
      {
        "order": 2,
        "text": "If a prefix substring is a palindrome, recurse on the remaining suffix."
      },
      {
        "order": 3,
        "text": "Backtrack by removing the current piece from the path after exploring it, before trying a longer or shorter cut."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-palindrome-cuts",
      "steps": [
        {
          "action": "try-cut-length"
        },
        {
          "action": "check-palindrome"
        },
        {
          "action": "recurse-on-suffix"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Backtracking tries every possible prefix cut at each position; if that prefix is a palindrome, it recurses on the remaining suffix, building up valid partitions and backtracking when a cut does not lead to a full palindrome partition.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 68,
    "title": "N-Queens",
    "topic": "Recursion & Backtracking",
    "pattern": "Backtracking",
    "difficulty": "hard",
    "description": "Place n queens on an n×n chessboard so that no two queens attack each other. Return all distinct solutions.",
    "examples": [
      {
        "input": "n=4",
        "output": "2 solutions"
      }
    ],
    "constraints": [
      "1 <= n <= 9"
    ],
    "expectedComplexity": {
      "time": "O(n!)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<String>> solveNQueens(int n) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "n=4",
        "expectedOutput": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "n=1",
        "expectedOutput": "[[\"Q\"]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "n=2",
        "expectedOutput": "[]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Place one queen per row, and only worry about column and diagonal conflicts as you go."
      },
      {
        "order": 2,
        "text": "Track used columns and both diagonal directions (row-col and row+col are constant along a diagonal) to check conflicts in O(1)."
      },
      {
        "order": 3,
        "text": "Recurse row by row: for each column in the current row, if it is safe, place the queen, recurse to the next row, then remove it (backtrack)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "backtracking-n-queens",
      "steps": [
        {
          "action": "try-column-in-row"
        },
        {
          "action": "check-column-and-diagonals"
        },
        {
          "action": "place-and-recurse"
        },
        {
          "action": "backtrack"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Placing one queen per row and tracking used columns plus both diagonals (using row-col and row+col as constant diagonal identifiers) allows O(1) conflict checks. Backtracking explores placements row by row, undoing a placement whenever no valid column remains ahead.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 69,
    "title": "Binary Tree Inorder Traversal",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, return the inorder traversal of its node values (left, root, right).",
    "examples": [
      {
        "input": "tree [1,null,2,3]",
        "output": "[1,3,2]"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h) recursion depth"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "// TreeNode is predefined: class TreeNode { int val; TreeNode left, right; }\nclass Solution {\n    public List<Integer> inorderTraversal(TreeNode root) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [1,null,2,3]",
        "expectedOutput": "[1,3,2]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "empty tree",
        "expectedOutput": "[]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "single node",
        "expectedOutput": "[value]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Inorder means: visit everything in the left subtree, then the node itself, then everything in the right subtree."
      },
      {
        "order": 2,
        "text": "This maps directly onto a recursive function structure."
      },
      {
        "order": 3,
        "text": "recurse(left), add current value, recurse(right) — applied recursively at every node."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-inorder-traversal",
      "steps": [
        {
          "action": "recurse-left"
        },
        {
          "action": "visit-node"
        },
        {
          "action": "recurse-right"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Inorder traversal recursively visits the left subtree, then the current node, then the right subtree — for a Binary Search Tree this naturally produces values in sorted order. O(n) time, O(h) space for the recursion stack.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 70,
    "title": "Maximum Depth of Binary Tree",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from root to a leaf).",
    "examples": [
      {
        "input": "tree [3,9,20,null,null,15,7]",
        "output": "3"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h) recursion depth"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int maxDepth(TreeNode root) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [3,9,20,null,null,15,7]",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "empty tree",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "tree [3,9,20,null,null,15,7]",
        "expectedOutput": "3",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The depth of a tree relates simply to the depths of its two subtrees."
      },
      {
        "order": 2,
        "text": "The depth of a node is 1 plus the maximum depth of its children."
      },
      {
        "order": 3,
        "text": "Recursively compute leftDepth and rightDepth, then return 1 + max(leftDepth, rightDepth), with 0 as the base case for a null node."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-max-depth-dfs",
      "steps": [
        {
          "action": "recurse-left-and-right"
        },
        {
          "action": "combine-plus-one"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A node's depth is 1 plus the larger of its two subtrees' depths, with an empty tree having depth 0. This recursive definition maps directly to a DFS that computes both subtree depths and combines them — O(n) time.",
    "xp": 100,
    "isBoss": false
  }
];
