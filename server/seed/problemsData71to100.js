// problemsData71to100.js for DSA 100 Doors.

module.exports = [
  {
    "doorNumber": 71,
    "title": "Invert Binary Tree",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, invert the tree (mirror it) and return its root.",
    "examples": [
      {
        "input": "tree [4,2,7,1,3,6,9]",
        "output": "[4,7,2,9,6,3,1]"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 100"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return root;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [4,2,7,1,3,6,9]",
        "expectedOutput": "[4,7,2,9,6,3,1]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "empty tree",
        "expectedOutput": "empty tree",
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
        "text": "Inverting a tree just means swapping left and right children, recursively, at every node."
      },
      {
        "order": 2,
        "text": "Recurse on both children first (or swap first, then recurse — either order works)."
      },
      {
        "order": 3,
        "text": "Swap root.left and root.right, then recursively invert both subtrees."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-invert-dfs",
      "steps": [
        {
          "action": "swap-children"
        },
        {
          "action": "recurse-left-right"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Recursively swapping the left and right children at every node mirrors the entire tree — a simple O(n) DFS with no extra data structures needed.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 72,
    "title": "Symmetric Tree",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "easy",
    "description": "Given the root of a binary tree, check whether it is a mirror of itself (symmetric around its center).",
    "examples": [
      {
        "input": "tree [1,2,2,3,4,4,3]",
        "output": "true"
      },
      {
        "input": "tree [1,2,2,null,3,null,3]",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 1000"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isSymmetric(TreeNode root) {\n        return true;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [1,2,2,3,4,4,3]",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "tree [1,2,2,null,3,null,3]",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "single node",
        "expectedOutput": "true",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A tree is symmetric if its left subtree is a mirror image of its right subtree."
      },
      {
        "order": 2,
        "text": "Write a helper that compares two subtrees for mirror symmetry, not just equality."
      },
      {
        "order": 3,
        "text": "Two subtrees mirror each other if their roots match and left1 mirrors right2 while right1 mirrors left2."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-mirror-check",
      "steps": [
        {
          "action": "compare-outer-pair"
        },
        {
          "action": "compare-inner-pair"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A helper function checks if two subtrees are mirrors: their values must match, and the left of one must mirror the right of the other (and vice versa) — applied recursively down both sides simultaneously.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 73,
    "title": "Binary Tree Level Order Traversal",
    "topic": "Trees & BST",
    "pattern": "BFS",
    "difficulty": "medium",
    "description": "Given the root of a binary tree, return the level order traversal of its node values (left to right, level by level).",
    "examples": [
      {
        "input": "tree [3,9,20,null,null,15,7]",
        "output": "[[3],[9,20],[15,7]]"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 2000"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [3,9,20,null,null,15,7]",
        "expectedOutput": "[[3],[9,20],[15,7]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "empty tree",
        "expectedOutput": "[]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "2000 node tree",
        "expectedOutput": "all levels",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Processing \"level by level\" is a strong signal for BFS rather than DFS."
      },
      {
        "order": 2,
        "text": "Use a queue, but process it in batches — the current queue size at the start of a loop iteration is exactly the current level's node count."
      },
      {
        "order": 3,
        "text": "For each level, dequeue exactly that many nodes, collecting their values and enqueueing their children."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-bfs-level-order",
      "steps": [
        {
          "action": "enqueue-root"
        },
        {
          "action": "process-level-batch"
        },
        {
          "action": "enqueue-children"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A BFS queue processes the tree level by level: capturing the queue's size at the start of each iteration tells you exactly how many nodes belong to the current level, letting you group values correctly — O(n) time and space.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 74,
    "title": "Validate Binary Search Tree",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS) with Bounds",
    "difficulty": "medium",
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    "examples": [
      {
        "input": "tree [2,1,3]",
        "output": "true"
      },
      {
        "input": "tree [5,1,4,null,null,3,6]",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return true;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [2,1,3]",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "tree [5,1,4,null,null,3,6]",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "tree [2,1,3]",
        "expectedOutput": "true",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Just checking that a node's immediate children are smaller/larger is not enough — the whole subtree matters."
      },
      {
        "order": 2,
        "text": "Pass down a valid (min, max) range as you recurse into each subtree."
      },
      {
        "order": 3,
        "text": "At each node, check it falls within (min, max); recurse left with (min, node.val) and right with (node.val, max)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-bst-bounds-check",
      "steps": [
        {
          "action": "check-node-within-range"
        },
        {
          "action": "narrow-range-for-children"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Rather than only comparing a node to its direct children, pass down an allowed (min, max) range as recursion descends — narrowed appropriately for left and right children — so violations anywhere in the subtree are caught, in O(n) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 75,
    "title": "Lowest Common Ancestor of a BST",
    "topic": "Trees & BST",
    "pattern": "BST Property Traversal",
    "difficulty": "medium",
    "description": "Given a BST and two nodes p and q, find their lowest common ancestor (LCA).",
    "examples": [
      {
        "input": "BST, p=2, q=8",
        "output": "node 6 (root)"
      }
    ],
    "constraints": [
      "2 <= number of nodes <= 10^5",
      "p and q both exist in the tree"
    ],
    "expectedComplexity": {
      "time": "O(h)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        return root;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "root=[6,2,8,0,4,7,9,null,null,3,5], p=2, q=8",
        "expectedOutput": "6",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "root=[6,2,8,0,4,7,9,null,null,3,5], p=2, q=4",
        "expectedOutput": "2",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "root=[2,1], p=2, q=1",
        "expectedOutput": "2",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The BST property (left < root < right) tells you which direction to go without searching both subtrees."
      },
      {
        "order": 2,
        "text": "If both p and q are smaller than the current node, the LCA is in the left subtree; if both are larger, it is in the right."
      },
      {
        "order": 3,
        "text": "The first node where p and q \"split\" (one smaller, one larger, or one equals the node) is the LCA."
      }
    ],
    "visualizationSteps": {
      "algorithm": "bst-lca-traversal",
      "steps": [
        {
          "action": "compare-to-current"
        },
        {
          "action": "go-left-or-right"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Using the BST property, walk from the root: if both targets are smaller, go left; if both larger, go right; the first node where they diverge (or one equals the current node) is the lowest common ancestor — O(h) time, no need to search both subtrees blindly.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 76,
    "title": "Diameter of Binary Tree",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "medium",
    "description": "Given the root of a binary tree, return the length (in edges) of the longest path between any two nodes.",
    "examples": [
      {
        "input": "tree [1,2,3,4,5]",
        "output": "3",
        "explanation": "Path 4-2-1-3 or 5-2-1-3."
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int diameterOfBinaryTree(TreeNode root) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [1,2,3,4,5]",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "single node",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "tree [1,2,3,4,5]",
        "expectedOutput": "3",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "The longest path through a node equals the sum of the depths of its left and right subtrees."
      },
      {
        "order": 2,
        "text": "The diameter is not necessarily through the root — track a global maximum as you compute depths."
      },
      {
        "order": 3,
        "text": "While recursively computing each node's depth, update a running max using leftDepth + rightDepth at every node."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-diameter-dfs",
      "steps": [
        {
          "action": "compute-left-right-depth"
        },
        {
          "action": "update-global-max"
        },
        {
          "action": "return-depth-plus-one"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A single DFS computes each node's depth while simultaneously tracking a global maximum of (left depth + right depth) at every node — since the longest path through any node passes down both its subtrees. O(n) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 77,
    "title": "Convert Sorted Array to Binary Search Tree",
    "topic": "Trees & BST",
    "pattern": "Divide and Conquer",
    "difficulty": "medium",
    "description": "Given a sorted array, convert it into a height-balanced binary search tree.",
    "examples": [
      {
        "input": "[-10,-3,0,5,9]",
        "output": "a height-balanced BST, e.g. root 0"
      }
    ],
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(log n) recursion"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public TreeNode sortedArrayToBST(int[] nums) {\n        return null;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[-10,-3,0,5,9]",
        "expectedOutput": "[0,-10,5,null,-3,null,9]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[1,3]",
        "expectedOutput": "[3,1]",
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
        "text": "To keep the tree balanced, the root should split the array as evenly as possible."
      },
      {
        "order": 2,
        "text": "Pick the middle element of the current range as the root."
      },
      {
        "order": 3,
        "text": "Recursively build the left subtree from the left half and the right subtree from the right half."
      }
    ],
    "visualizationSteps": {
      "algorithm": "divide-and-conquer-bst-build",
      "steps": [
        {
          "action": "pick-middle-as-root"
        },
        {
          "action": "recurse-left-half"
        },
        {
          "action": "recurse-right-half"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Recursively choosing the middle element of each subarray as the subtree root guarantees the resulting BST is height-balanced, since both halves are as equal in size as possible at every level — O(n) time overall.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 78,
    "title": "Path Sum",
    "topic": "Trees & BST",
    "pattern": "Tree Traversal (DFS)",
    "difficulty": "easy",
    "description": "Given the root of a binary tree and a target sum, determine if the tree has a root-to-leaf path such that the values along the path add up to the target.",
    "examples": [
      {
        "input": "tree [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22",
        "output": "true"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean hasPathSum(TreeNode root, int targetSum) {\n        return false;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "root=[5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "root=[1,2,3], targetSum=5",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "root=[], targetSum=0",
        "expectedOutput": "false",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each node, you can subtract its value from the remaining target and recurse into children."
      },
      {
        "order": 2,
        "text": "A leaf node satisfies the path only if the remaining target after subtracting its value is exactly 0."
      },
      {
        "order": 3,
        "text": "Recurse into left OR right with (targetSum - node.val); return true if either subtree finds a valid path."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-path-sum-dfs",
      "steps": [
        {
          "action": "subtract-node-value"
        },
        {
          "action": "check-leaf-condition"
        },
        {
          "action": "recurse-children"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "DFS carries a running remaining sum down each path, subtracting each node's value. A leaf satisfies the target exactly when the remaining sum reaches zero there — O(n) time to check all root-to-leaf paths.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 79,
    "title": "Kth Smallest Element in a BST",
    "topic": "Trees & BST",
    "pattern": "Inorder Traversal",
    "difficulty": "medium",
    "description": "Given the root of a BST and an integer k, return the kth smallest value in the tree.",
    "examples": [
      {
        "input": "BST [3,1,4,null,2], k=1",
        "output": "1"
      }
    ],
    "constraints": [
      "1 <= number of nodes <= 10^4",
      "1 <= k <= number of nodes"
    ],
    "expectedComplexity": {
      "time": "O(h + k)",
      "space": "O(h)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int kthSmallest(TreeNode root, int k) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "root=[3,1,4,null,2], k=1",
        "expectedOutput": "1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "root=[5,3,6,2,4,null,null,1], k=3",
        "expectedOutput": "3",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "root=[1], k=1",
        "expectedOutput": "1",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Inorder traversal of a BST visits values in ascending sorted order."
      },
      {
        "order": 2,
        "text": "You do not need to collect every value — you can stop as soon as you have visited k of them."
      },
      {
        "order": 3,
        "text": "Do an iterative inorder traversal with an explicit stack, decrementing a counter each time you visit a node, and stop when the counter hits 0."
      }
    ],
    "visualizationSteps": {
      "algorithm": "bst-inorder-kth",
      "steps": [
        {
          "action": "push-left-chain"
        },
        {
          "action": "visit-and-decrement-k"
        },
        {
          "action": "move-to-right-subtree"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Since inorder traversal of a BST yields values in sorted order, an iterative inorder traversal that stops after visiting exactly k nodes gives the kth smallest directly — no need to traverse the entire tree or sort separately.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 80,
    "title": "Serialize and Deserialize Binary Tree",
    "topic": "Trees & BST",
    "pattern": "Preorder Traversal",
    "difficulty": "hard",
    "description": "Design an algorithm to serialize a binary tree to a string, and deserialize that string back into the original tree structure.",
    "examples": [
      {
        "input": "tree [1,2,3,null,null,4,5]",
        "output": "a string encoding, then reconstructed to the identical tree"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "public class Codec {\n    public String serialize(TreeNode root) {\n        return \"\";\n    }\n    public TreeNode deserialize(String data) {\n        return null;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "tree [1,2,3,null,null,4,5]",
        "expectedOutput": "round-trips to the identical tree",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "empty tree",
        "expectedOutput": "round-trips to empty tree",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "tree [1,2,3,null,null,4,5]",
        "expectedOutput": "a string encoding, then reconstructed to the identical tree",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You need a format that records enough information to know exactly where each subtree ends, including missing children."
      },
      {
        "order": 2,
        "text": "A preorder traversal that explicitly writes a marker (like \"null\") for missing children can be deserialized unambiguously."
      },
      {
        "order": 3,
        "text": "To deserialize, read tokens in the same preorder sequence, recursively building left before right, treating the \"null\" marker as a base case."
      }
    ],
    "visualizationSteps": {
      "algorithm": "tree-serialize-preorder",
      "steps": [
        {
          "action": "preorder-write-with-null-markers"
        },
        {
          "action": "preorder-read-and-rebuild"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Preorder traversal with explicit \"null\" markers for missing children encodes enough structure to reconstruct the tree unambiguously: deserializing reads tokens in the same order, recursively rebuilding left before right and treating \"null\" as a base case — O(n) for both directions.",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 81,
    "title": "Number of Islands",
    "topic": "Graphs",
    "pattern": "DFS/BFS on Grid",
    "difficulty": "medium",
    "description": "Given a 2D grid of '1's (land) and '0's (water), count the number of islands (connected groups of land, horizontally/vertically adjacent).",
    "examples": [
      {
        "input": "grid with 3 separate land clusters",
        "output": "3"
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 300"
    ],
    "expectedComplexity": {
      "time": "O(rows * cols)",
      "space": "O(rows * cols)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "grid=[[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "expectedOutput": "1",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "grid=[[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "grid=[[\"0\"]]",
        "expectedOutput": "0",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "easy"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Every unvisited land cell you find is the start of a brand-new island."
      },
      {
        "order": 2,
        "text": "From that cell, flood-fill outward (DFS or BFS) marking every connected land cell as visited."
      },
      {
        "order": 3,
        "text": "Scan every cell; whenever you find an unvisited \"1\", increment your island count and flood-fill it to \"sink\" the whole island before continuing the scan."
      }
    ],
    "visualizationSteps": {
      "algorithm": "grid-flood-fill-islands",
      "steps": [
        {
          "action": "find-unvisited-land"
        },
        {
          "action": "flood-fill-connected"
        },
        {
          "action": "increment-count"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Scanning the grid and flood-filling (DFS or BFS) every newly discovered land cell \"sinks\" an entire island at once, so each island is only counted once. Total work across all flood-fills is bounded by the grid size, giving O(rows*cols).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 82,
    "title": "Flood Fill",
    "topic": "Graphs",
    "pattern": "DFS/BFS on Grid",
    "difficulty": "easy",
    "description": "Given an image (2D grid of colors), a starting pixel, and a new color, perform a flood fill: change the color of the starting pixel and all connected pixels of the same original color.",
    "examples": [
      {
        "input": "image, sr=1, sc=1, color=2",
        "output": "image with the connected region recolored to 2"
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 50"
    ],
    "expectedComplexity": {
      "time": "O(rows * cols)",
      "space": "O(rows * cols)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[][] floodFill(int[][] image, int sr, int sc, int color) {\n        return image;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2",
        "expectedOutput": "[[2,2,2],[2,2,0],[2,0,1]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "image=[[0,0,0],[0,0,0]], sr=0, sc=0, color=0",
        "expectedOutput": "[[0,0,0],[0,0,0]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "image=[[0,0,0],[0,0,0]], sr=1, sc=1, color=2",
        "expectedOutput": "[[2,2,2],[2,2,2]]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is a direct application of DFS or BFS starting from a single cell."
      },
      {
        "order": 2,
        "text": "Watch out for the case where the new color equals the original color — that could cause infinite recursion."
      },
      {
        "order": 3,
        "text": "From the start pixel, recurse into the four neighbors that share the original color, recoloring each before recursing."
      }
    ],
    "visualizationSteps": {
      "algorithm": "grid-flood-fill-single-region",
      "steps": [
        {
          "action": "check-color-match"
        },
        {
          "action": "recolor-and-recurse-neighbors"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A DFS (or BFS) from the starting pixel visits every 4-directionally connected pixel sharing the original color, recoloring each. Guarding against new color == original color prevents infinite recursion. O(rows*cols) worst case.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 83,
    "title": "Clone Graph",
    "topic": "Graphs",
    "pattern": "DFS/BFS with Hashing",
    "difficulty": "medium",
    "description": "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.",
    "examples": [
      {
        "input": "graph with 4 nodes in a cycle",
        "output": "a fully cloned graph with the same structure"
      }
    ],
    "constraints": [
      "0 <= number of nodes <= 100"
    ],
    "expectedComplexity": {
      "time": "O(V + E)",
      "space": "O(V)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "// Node is predefined: class Node { int val; List<Node> neighbors; }\nclass Solution {\n    public Node cloneGraph(Node node) {\n        return node;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "graph with 4 nodes in a cycle",
        "expectedOutput": "structurally identical clone",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "single node with no neighbors",
        "expectedOutput": "clone of that single node",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "100 node graph",
        "expectedOutput": "complete clone",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Cloning naively can loop forever on a cyclic graph — you need to remember what you have already cloned."
      },
      {
        "order": 2,
        "text": "Use a HashMap from original node to its clone, checking it before creating a new clone."
      },
      {
        "order": 3,
        "text": "DFS or BFS from the start node: for each neighbor not yet in the map, create its clone first, then attach it to the current clone's neighbor list."
      }
    ],
    "visualizationSteps": {
      "algorithm": "graph-clone-dfs-hashmap",
      "steps": [
        {
          "action": "check-visited-map"
        },
        {
          "action": "create-clone-if-new"
        },
        {
          "action": "attach-to-neighbor-list"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A HashMap from original nodes to their clones prevents infinite loops on cycles and ensures each node is cloned exactly once. DFS or BFS visits every node and edge once, giving O(V+E) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 84,
    "title": "Course Schedule",
    "topic": "Graphs",
    "pattern": "Topological Sort (Cycle Detection)",
    "difficulty": "medium",
    "description": "Given numCourses and a list of prerequisite pairs [a, b] meaning you must take b before a, determine if it is possible to finish all courses (i.e., no cycle exists).",
    "examples": [
      {
        "input": "numCourses=2, prerequisites=[[1,0]]",
        "output": "true"
      },
      {
        "input": "numCourses=2, prerequisites=[[1,0],[0,1]]",
        "output": "false"
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000"
    ],
    "expectedComplexity": {
      "time": "O(V + E)",
      "space": "O(V + E)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return true;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "numCourses=2, prerequisites=[[1,0]]",
        "expectedOutput": "true",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "numCourses=2, prerequisites=[[1,0],[0,1]]",
        "expectedOutput": "false",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "2000 courses, dense prerequisites",
        "expectedOutput": "true/false",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This problem is really asking: does this directed graph contain a cycle?"
      },
      {
        "order": 2,
        "text": "Track courses with in-degree 0 (no remaining prerequisites) — they can always be taken next."
      },
      {
        "order": 3,
        "text": "Use Kahn's algorithm: repeatedly remove in-degree-0 nodes, decrementing their neighbors' in-degrees; if you cannot remove all nodes, a cycle exists."
      }
    ],
    "visualizationSteps": {
      "algorithm": "topological-sort-kahns",
      "steps": [
        {
          "action": "compute-in-degrees"
        },
        {
          "action": "process-zero-in-degree-queue"
        },
        {
          "action": "check-all-processed"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Kahn's algorithm repeatedly removes nodes with no remaining incoming edges (in-degree 0), decrementing neighbors' in-degrees as it goes. If every node can eventually be removed, the graph is acyclic and all courses can be finished — O(V+E) time.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 85,
    "title": "Number of Provinces",
    "topic": "Graphs",
    "pattern": "Union-Find / DFS",
    "difficulty": "medium",
    "description": "Given an n x n adjacency matrix where isConnected[i][j] = 1 means city i and city j are directly connected, return the number of provinces (connected groups of cities).",
    "examples": [
      {
        "input": "[[1,1,0],[1,1,0],[0,0,1]]",
        "output": "2"
      }
    ],
    "constraints": [
      "1 <= n <= 200"
    ],
    "expectedComplexity": {
      "time": "O(n^2)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int findCircleNum(int[][] isConnected) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[[1,1,0],[1,1,0],[0,0,1]]",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "identity matrix (no connections)",
        "expectedOutput": "n provinces",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "200x200 fully connected matrix",
        "expectedOutput": "1",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This is a connected-components problem hiding behind a matrix representation."
      },
      {
        "order": 2,
        "text": "Either DFS/BFS from each unvisited city, marking its whole component visited, or use Union-Find to merge connected cities."
      },
      {
        "order": 3,
        "text": "Each time you start a fresh DFS/BFS (or create a new Union-Find set) from an unvisited city, that is one new province."
      }
    ],
    "visualizationSteps": {
      "algorithm": "connected-components-dfs",
      "steps": [
        {
          "action": "find-unvisited-city"
        },
        {
          "action": "dfs-mark-component"
        },
        {
          "action": "increment-province-count"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Treating the matrix as an adjacency list, DFS or BFS from each unvisited city marks its entire connected component. Each fresh traversal started represents one new province — O(n^2) to scan the matrix and visit every connection.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 86,
    "title": "Rotting Oranges",
    "topic": "Graphs",
    "pattern": "Multi-source BFS",
    "difficulty": "medium",
    "description": "Given a grid where 0 = empty, 1 = fresh orange, 2 = rotten orange, and every minute a rotten orange rots its 4-directional fresh neighbors, return the minimum minutes until no fresh orange remains, or -1 if impossible.",
    "examples": [
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "output": "4"
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 10"
    ],
    "expectedComplexity": {
      "time": "O(rows * cols)",
      "space": "O(rows * cols)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int orangesRotting(int[][] grid) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[[2,1,1],[1,1,0],[0,1,1]]",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "a fresh orange fully isolated by empty cells",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "10x10 grid, many rotten sources",
        "expectedOutput": "minutes needed",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "All rotten oranges spread simultaneously, not one at a time — think of them as multiple BFS sources starting together."
      },
      {
        "order": 2,
        "text": "Enqueue every initially rotten orange first, then run BFS level by level, where each level represents one minute."
      },
      {
        "order": 3,
        "text": "Track how many fresh oranges remain; if any are left after BFS completes, return -1, otherwise return the number of levels processed."
      }
    ],
    "visualizationSteps": {
      "algorithm": "multi-source-bfs-grid",
      "steps": [
        {
          "action": "enqueue-all-rotten"
        },
        {
          "action": "process-level-as-minute"
        },
        {
          "action": "rot-fresh-neighbors"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Multi-source BFS starts with all initially rotten oranges enqueued together, so each BFS \"level\" corresponds to exactly one minute of simultaneous spreading. If fresh oranges remain unreachable after BFS finishes, the answer is -1.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 87,
    "title": "Pacific Atlantic Water Flow",
    "topic": "Graphs",
    "pattern": "Multi-source DFS/BFS",
    "difficulty": "hard",
    "description": "Given a grid of heights representing an island bordered by the Pacific (top/left) and Atlantic (bottom/right) oceans, find all cells from which water can flow to both oceans (water flows from higher or equal height to lower or equal height).",
    "examples": [
      {
        "input": "5x5 height grid",
        "output": "list of coordinates that reach both oceans"
      }
    ],
    "constraints": [
      "1 <= rows, cols <= 200"
    ],
    "expectedComplexity": {
      "time": "O(rows * cols)",
      "space": "O(rows * cols)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<List<Integer>> pacificAtlantic(int[][] heights) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        "expectedOutput": "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "heights=[[1]]",
        "expectedOutput": "[[0,0]]",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "heights=[[2,2],[2,2]]",
        "expectedOutput": "[[0,0],[0,1],[1,0],[1,1]]",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Simulating water flow from every cell forward is expensive — try thinking backward instead."
      },
      {
        "order": 2,
        "text": "Start DFS/BFS from the ocean borders, moving to neighbors with height >= current (reversing the flow direction)."
      },
      {
        "order": 3,
        "text": "Run one multi-source search from all Pacific-border cells and another from all Atlantic-border cells; the answer is the intersection of both reachable sets."
      }
    ],
    "visualizationSteps": {
      "algorithm": "reverse-flow-multi-source-dfs",
      "steps": [
        {
          "action": "dfs-from-pacific-borders"
        },
        {
          "action": "dfs-from-atlantic-borders"
        },
        {
          "action": "intersect-reachable-sets"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Rather than simulating flow from every cell, reverse the direction: run a multi-source DFS/BFS from the Pacific border and another from the Atlantic border, moving to neighbors of equal or greater height. The intersection of both reachable sets is the answer — O(rows*cols) total.",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 88,
    "title": "Word Ladder",
    "topic": "Graphs",
    "pattern": "BFS (Shortest Path)",
    "difficulty": "hard",
    "description": "Given a beginWord, endWord, and a word list, find the length of the shortest transformation sequence from beginWord to endWord, changing one letter at a time, with each intermediate word in the word list.",
    "examples": [
      {
        "input": "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5"
      }
    ],
    "constraints": [
      "1 <= beginWord.length <= 10",
      "1 <= wordList.length <= 5000"
    ],
    "expectedComplexity": {
      "time": "O(n * L^2)",
      "space": "O(n * L)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "expectedOutput": "5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "beginWord=\"hit\", endWord=\"cog\", wordList=[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "beginWord=\"a\", endWord=\"c\", wordList=[\"a\",\"b\",\"c\"]",
        "expectedOutput": "2",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Words are \"connected\" if they differ by exactly one letter — this defines an implicit graph."
      },
      {
        "order": 2,
        "text": "BFS naturally finds shortest paths in an unweighted graph."
      },
      {
        "order": 3,
        "text": "From each word, generate all one-letter variations and check if they are in the (unvisited) word set, enqueueing valid ones for the next BFS level."
      }
    ],
    "visualizationSteps": {
      "algorithm": "bfs-word-graph-shortest-path",
      "steps": [
        {
          "action": "generate-one-letter-variants"
        },
        {
          "action": "enqueue-valid-unvisited-words"
        },
        {
          "action": "track-level-as-distance"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Treating each word as a graph node connected to words one letter apart, BFS explores level by level, guaranteeing the first time endWord is reached is via the shortest transformation sequence — unweighted-graph BFS shortest path.",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 89,
    "title": "Network Delay Time",
    "topic": "Graphs",
    "pattern": "Dijkstra's Algorithm",
    "difficulty": "medium",
    "description": "Given a network of n nodes and travel times as directed edges (u, v, w), find the minimum time for a signal starting at node k to reach all nodes, or -1 if impossible.",
    "examples": [
      {
        "input": "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2",
        "output": "2"
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "1 <= edge weight <= 100"
    ],
    "expectedComplexity": {
      "time": "O(E log V)",
      "space": "O(V + E)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int networkDelayTime(int[][] times, int n, int k) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "a node unreachable from k",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "100 nodes, dense edges",
        "expectedOutput": "max shortest delay",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "You need shortest paths from a single source in a weighted graph — a classic algorithm applies directly."
      },
      {
        "order": 2,
        "text": "Use Dijkstra's algorithm with a min-heap (priority queue) keyed on current shortest known distance."
      },
      {
        "order": 3,
        "text": "After computing shortest distances to all nodes, the answer is the maximum of those distances (the last node to receive the signal); if any node is unreachable, return -1."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dijkstra-shortest-path",
      "steps": [
        {
          "action": "pop-min-distance-node"
        },
        {
          "action": "relax-neighbors"
        },
        {
          "action": "update-priority-queue"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Dijkstra's algorithm with a min-heap repeatedly pops the closest unvisited node and relaxes its outgoing edges, computing shortest distances from k to every other node in O(E log V). The answer is the max of all shortest distances, or -1 if some node stays unreachable.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 90,
    "title": "Course Schedule II",
    "topic": "Graphs",
    "pattern": "Topological Sort",
    "difficulty": "hard",
    "description": "Given numCourses and prerequisite pairs, return a valid order to take all courses, or an empty array if it is impossible.",
    "examples": [
      {
        "input": "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]",
        "output": "[0,1,2,3] (one valid order)"
      }
    ],
    "constraints": [
      "1 <= numCourses <= 2000"
    ],
    "expectedComplexity": {
      "time": "O(V + E)",
      "space": "O(V + E)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        return new int[0];\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "numCourses=2, prerequisites=[[1,0]]",
        "expectedOutput": "[0,1]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]",
        "expectedOutput": "[0,1,2,3]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "numCourses=2, prerequisites=[[1,0],[0,1]]",
        "expectedOutput": "[]",
        "type": "Edge Case Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "This extends Course Schedule I — you now need the actual order, not just a yes/no."
      },
      {
        "order": 2,
        "text": "Kahn's algorithm naturally produces a valid order as a side effect of the cycle-detection process."
      },
      {
        "order": 3,
        "text": "Every time you remove an in-degree-0 node from the queue, append it to your result order; if the result doesn't include all courses at the end, return an empty array."
      }
    ],
    "visualizationSteps": {
      "algorithm": "topological-sort-with-order",
      "steps": [
        {
          "action": "process-zero-in-degree-queue"
        },
        {
          "action": "append-to-order"
        },
        {
          "action": "check-completeness"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Kahn's algorithm builds the topological order directly: each node removed from the zero-in-degree queue is appended to the result. If the final order includes every course, it's valid; otherwise a cycle exists and the answer is empty — O(V+E).",
    "xp": 500,
    "isBoss": true
  },
  {
    "doorNumber": 91,
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming",
    "difficulty": "easy",
    "description": "You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
    "examples": [
      {
        "input": "n=2",
        "output": "2"
      },
      {
        "input": "n=3",
        "output": "3"
      }
    ],
    "constraints": [
      "1 <= n <= 45"
    ],
    "expectedComplexity": {
      "time": "O(n)",
      "space": "O(1)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "n=2",
        "expectedOutput": "2",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "n=3",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "n=45",
        "expectedOutput": "1836311903",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "medium"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "To reach step n, your last move was either from step n-1 or step n-2."
      },
      {
        "order": 2,
        "text": "That means ways(n) = ways(n-1) + ways(n-2) — this is exactly the Fibonacci recurrence."
      },
      {
        "order": 3,
        "text": "You only need the last two values at any point, so you can compute this iteratively with O(1) space instead of an array."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-fibonacci-recurrence",
      "steps": [
        {
          "action": "combine-previous-two"
        },
        {
          "action": "shift-window-forward"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "The number of ways to reach step n equals ways(n-1) + ways(n-2), since the last move was either a single step or a double step — the Fibonacci recurrence. Tracking only the last two values gives O(n) time and O(1) space.",
    "xp": 100,
    "isBoss": false
  },
  {
    "doorNumber": 92,
    "title": "House Robber",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given an array representing money in houses along a street, find the maximum amount you can rob without robbing two adjacent houses.",
    "examples": [
      {
        "input": "[1,2,3,1]",
        "output": "4",
        "explanation": "Rob house 1 and house 3 (1+3=4)."
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
        "code": "class Solution {\n    public int rob(int[] nums) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[1,2,3,1]",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "[2,7,9,3,1]",
        "expectedOutput": "12",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "100 houses",
        "expectedOutput": "max robbable amount",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "At each house, you have exactly two choices: rob it (and skip the previous), or skip it."
      },
      {
        "order": 2,
        "text": "Track the best amount achievable up through the previous house and the one before that."
      },
      {
        "order": 3,
        "text": "dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — you can keep just two rolling variables instead of a full array."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-house-robber",
      "steps": [
        {
          "action": "compute-rob-or-skip"
        },
        {
          "action": "update-rolling-max"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "At each house, the best result is the max of skipping it (carrying forward the previous best) or robbing it (previous-previous best plus this house's value) — a rolling two-variable DP that runs in O(n) time and O(1) space.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 93,
    "title": "Coin Change",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming",
    "difficulty": "medium",
    "description": "Given coin denominations and a target amount, return the fewest number of coins needed to make that amount, or -1 if impossible.",
    "examples": [
      {
        "input": "coins=[1,2,5], amount=11",
        "output": "3",
        "explanation": "5+5+1=11"
      }
    ],
    "constraints": [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(amount * coins.length)",
      "space": "O(amount)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "coins=[1,2,5], amount=11",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "coins=[2], amount=3",
        "expectedOutput": "-1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "coins=[1,2,5], amount=11",
        "expectedOutput": "3",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Greedily picking the largest coin first does not always work — think about building up from smaller amounts."
      },
      {
        "order": 2,
        "text": "Define dp[a] as the minimum coins needed to make amount a, with dp[0] = 0."
      },
      {
        "order": 3,
        "text": "For each amount from 1 to target, try every coin c <= amount: dp[amount] = min(dp[amount], dp[amount - c] + 1)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-coin-change-table",
      "steps": [
        {
          "action": "try-each-coin"
        },
        {
          "action": "update-min-at-amount"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Bottom-up DP builds dp[amount] = minimum coins to make that amount, using dp[0] = 0 as the base case. For each amount, trying every coin and taking dp[amount - coin] + 1 finds the optimum, since an optimal solution must end with some coin.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 94,
    "title": "Longest Common Subsequence",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming (2D)",
    "difficulty": "medium",
    "description": "Given two strings, return the length of their longest common subsequence (not necessarily contiguous).",
    "examples": [
      {
        "input": "text1=\"abcde\", text2=\"ace\"",
        "output": "3",
        "explanation": "\"ace\" is a common subsequence."
      }
    ],
    "constraints": [
      "1 <= text1.length, text2.length <= 1000"
    ],
    "expectedComplexity": {
      "time": "O(m * n)",
      "space": "O(m * n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int longestCommonSubsequence(String text1, String text2) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "text1=\"abcde\", text2=\"ace\"",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "no common characters",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "1000-char strings",
        "expectedOutput": "LCS length",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think about the problem in terms of prefixes of both strings."
      },
      {
        "order": 2,
        "text": "If the last characters of both prefixes match, they must be part of the LCS; if not, you have two choices to try."
      },
      {
        "order": 3,
        "text": "dp[i][j] = dp[i-1][j-1] + 1 if text1[i-1] == text2[j-1], else max(dp[i-1][j], dp[i][j-1])."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-2d-table-fill",
      "steps": [
        {
          "action": "compare-characters"
        },
        {
          "action": "fill-table-cell"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A 2D DP table over prefixes of both strings: matching characters extend the LCS diagonally by 1; mismatches take the best of skipping a character from either string — filling the whole table gives the answer in O(m*n).",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 95,
    "title": "Longest Increasing Subsequence",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming + Binary Search",
    "difficulty": "medium",
    "description": "Given an integer array, return the length of the longest strictly increasing subsequence.",
    "examples": [
      {
        "input": "[10,9,2,5,3,7,101,18]",
        "output": "4",
        "explanation": "[2,3,7,101] or [2,3,7,18]."
      }
    ],
    "constraints": [
      "1 <= nums.length <= 2500"
    ],
    "expectedComplexity": {
      "time": "O(n log n)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int lengthOfLIS(int[] nums) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "[10,9,2,5,3,7,101,18]",
        "expectedOutput": "4",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "strictly decreasing array",
        "expectedOutput": "1",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "2500 elements",
        "expectedOutput": "LIS length",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "A basic O(n^2) DP works (dp[i] = longest increasing subsequence ending at i), but a faster approach exists."
      },
      {
        "order": 2,
        "text": "Maintain an array \"tails\" where tails[k] is the smallest possible tail value of an increasing subsequence of length k+1."
      },
      {
        "order": 3,
        "text": "For each number, binary search \"tails\" for the first value >= it and replace that value; if none found, append the number, growing the LIS length."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-patience-sorting-lis",
      "steps": [
        {
          "action": "binary-search-tails"
        },
        {
          "action": "replace-or-append"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Maintaining a \"tails\" array of the smallest tail value for each subsequence length, and binary searching it for each new number to replace or extend, achieves O(n log n) — a technique related to patience sorting, better than the O(n^2) DP.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 96,
    "title": "0/1 Knapsack",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming (2D/1D)",
    "difficulty": "hard",
    "description": "Given weights and values of n items and a knapsack capacity W, find the maximum value achievable without exceeding capacity, using each item at most once.",
    "examples": [
      {
        "input": "weights=[1,3,4,5], values=[1,4,5,7], W=7",
        "output": "9",
        "explanation": "Items with weights 3 and 4 (values 4+5=9)."
      }
    ],
    "constraints": [
      "1 <= n <= 100",
      "1 <= W <= 1000"
    ],
    "expectedComplexity": {
      "time": "O(n * W)",
      "space": "O(W)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int knapsack(int[] weights, int[] values, int W) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "weights=[1,3,4,5], values=[1,4,5,7], W=7",
        "expectedOutput": "9",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "W smaller than any item weight",
        "expectedOutput": "0",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "n=100, W=1000",
        "expectedOutput": "max value",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "For each item, you have exactly two choices: include it or exclude it — this is the \"0/1\" in the name."
      },
      {
        "order": 2,
        "text": "Define dp[w] as the best value achievable with capacity w, and process items one at a time."
      },
      {
        "order": 3,
        "text": "For each item, iterate capacity from W down to the item's weight, updating dp[w] = max(dp[w], dp[w - weight] + value) — the reverse iteration prevents reusing the same item twice."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-knapsack-1d-rolling",
      "steps": [
        {
          "action": "iterate-items"
        },
        {
          "action": "update-capacity-backward"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A 1D rolling DP array dp[w] tracks the best value for each capacity. Iterating each item and updating capacities from high to low (not low to high) ensures each item is only used once, achieving O(n*W) time and O(W) space instead of a full 2D table.",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 97,
    "title": "Kth Largest Element in an Array",
    "topic": "Heap & Priority Queue",
    "pattern": "Heap",
    "difficulty": "medium",
    "description": "Given an integer array and an integer k, return the kth largest element in the array (the kth largest in sorted order, not the kth distinct element).",
    "examples": [
      {
        "input": "nums=[3,2,1,5,6,4], k=2",
        "output": "5"
      }
    ],
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "expectedComplexity": {
      "time": "O(n log k)",
      "space": "O(k)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return -1;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "nums=[3,2,1,5,6,4], k=2",
        "expectedOutput": "5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "k=1",
        "expectedOutput": "max of the array",
        "type": "Boundary Key",
        "isHidden": false,
        "difficulty": "easy"
      },
      {
        "input": "nums=[3,2,1,5,6,4], k=2",
        "expectedOutput": "5",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Fully sorting the array works but does more work than necessary."
      },
      {
        "order": 2,
        "text": "A min-heap of size k, holding the k largest values seen so far, has the kth largest at its top."
      },
      {
        "order": 3,
        "text": "Push each value onto the heap; whenever its size exceeds k, pop the smallest — at the end, the heap's top is the answer."
      }
    ],
    "visualizationSteps": {
      "algorithm": "heap-kth-largest",
      "steps": [
        {
          "action": "push-to-min-heap"
        },
        {
          "action": "pop-if-oversized"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "Maintaining a min-heap capped at size k keeps exactly the k largest elements seen so far; once every element has been processed, the heap's minimum (its top) is the kth largest overall — O(n log k) instead of a full O(n log n) sort.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 98,
    "title": "Top K Frequent Words",
    "topic": "Heap & Priority Queue",
    "pattern": "Heap",
    "difficulty": "medium",
    "description": "Given a list of words and an integer k, return the k most frequent words, sorted by frequency (highest first) and alphabetically for ties.",
    "examples": [
      {
        "input": "words=[\"i\",\"love\",\"leetcode\",\"i\",\"love\",\"coding\"], k=2",
        "output": "[\"i\",\"love\"]"
      }
    ],
    "constraints": [
      "1 <= words.length <= 500"
    ],
    "expectedComplexity": {
      "time": "O(n log k)",
      "space": "O(n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public List<String> topKFrequent(String[] words, int k) {\n        return new ArrayList<>();\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "words=[\"i\",\"love\",\"leetcode\",\"i\",\"love\",\"coding\"], k=2",
        "expectedOutput": "[\"i\",\"love\"]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "a tie in frequency",
        "expectedOutput": "alphabetically smaller word first",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "500 words",
        "expectedOutput": "top k words",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Count word frequencies first with a HashMap, just like Top K Frequent Elements."
      },
      {
        "order": 2,
        "text": "A heap can order by frequency, but you need a custom comparator to break ties alphabetically."
      },
      {
        "order": 3,
        "text": "Use a min-heap of size k with a comparator that orders by ascending frequency, then descending alphabetical order for ties (so the \"worst\" candidate is always at the top to evict)."
      }
    ],
    "visualizationSteps": {
      "algorithm": "heap-top-k-with-tiebreak",
      "steps": [
        {
          "action": "count-frequencies"
        },
        {
          "action": "maintain-heap-with-comparator"
        },
        {
          "action": "extract-and-reverse"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "After counting frequencies with a HashMap, a min-heap of size k with a comparator (ascending frequency, then descending alphabetical for ties) keeps exactly the correct top-k candidates. Extracting and reversing the heap contents gives the final ordered answer.",
    "xp": 250,
    "isBoss": false
  },
  {
    "doorNumber": 99,
    "title": "Merge K Sorted Lists",
    "topic": "Heap & Priority Queue",
    "pattern": "Heap",
    "difficulty": "hard",
    "description": "Given an array of k sorted linked lists, merge them into a single sorted linked list.",
    "examples": [
      {
        "input": "lists=[[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]"
      }
    ],
    "constraints": [
      "0 <= k <= 10^4",
      "total nodes <= 10^4"
    ],
    "expectedComplexity": {
      "time": "O(n log k)",
      "space": "O(k)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        return null;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "lists=[[1,4,5],[1,3,4],[2,6]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "empty array of lists",
        "expectedOutput": "empty list",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "lists=[[1,4,5],[1,3,4],[2,6]]",
        "expectedOutput": "[1,1,2,3,4,4,5,6]",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Merging two lists at a time repeatedly works but can be slow if done naively pairwise in sequence."
      },
      {
        "order": 2,
        "text": "A min-heap holding the current front node of each list lets you always pick the global smallest next."
      },
      {
        "order": 3,
        "text": "Pop the smallest node from the heap, attach it to the result, and push its \"next\" node (if any) back onto the heap."
      }
    ],
    "visualizationSteps": {
      "algorithm": "heap-merge-k-lists",
      "steps": [
        {
          "action": "seed-heap-with-list-heads"
        },
        {
          "action": "pop-smallest-attach-result"
        },
        {
          "action": "push-next-node"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A min-heap holding one node per list (the current front) always yields the global minimum next value in O(log k). Repeatedly popping, attaching to the result, and pushing that node's successor merges all k lists in O(n log k), where n is the total node count.",
    "xp": 350,
    "isBoss": false
  },
  {
    "doorNumber": 100,
    "title": "Edit Distance",
    "topic": "Dynamic Programming",
    "pattern": "Dynamic Programming (2D)",
    "difficulty": "boss",
    "description": "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 into word2. This is the final door of the dungeon.",
    "examples": [
      {
        "input": "word1=\"horse\", word2=\"ros\"",
        "output": "3"
      },
      {
        "input": "word1=\"intention\", word2=\"execution\"",
        "output": "5"
      }
    ],
    "constraints": [
      "0 <= word1.length, word2.length <= 500"
    ],
    "expectedComplexity": {
      "time": "O(m * n)",
      "space": "O(m * n)"
    },
    "starterCode": [
      {
        "language": "java",
        "code": "class Solution {\n    public int minDistance(String word1, String word2) {\n        return 0;\n    }\n}\n"
      }
    ],
    "keys": [
      {
        "input": "word1=\"horse\", word2=\"ros\"",
        "expectedOutput": "3",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "word1=\"intention\", word2=\"execution\"",
        "expectedOutput": "5",
        "type": "Basic Key",
        "isHidden": false,
        "difficulty": "hard"
      },
      {
        "input": "one string empty",
        "expectedOutput": "length of the other string",
        "type": "Edge Case Key",
        "isHidden": false,
        "difficulty": "medium"
      },
      {
        "input": "both strings identical",
        "expectedOutput": "0",
        "type": "Boundary Key",
        "isHidden": true,
        "difficulty": "medium"
      },
      {
        "input": "500-char strings",
        "expectedOutput": "min edit distance",
        "type": "Performance Key",
        "isHidden": true,
        "difficulty": "hard"
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think about the problem in terms of prefixes of both words, just like Longest Common Subsequence."
      },
      {
        "order": 2,
        "text": "If the last characters match, no operation is needed there; if they don't, you must choose the cheapest of insert, delete, or replace."
      },
      {
        "order": 3,
        "text": "dp[i][j] = dp[i-1][j-1] if word1[i-1] == word2[j-1], else 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for delete, insert, replace respectively."
      }
    ],
    "visualizationSteps": {
      "algorithm": "dp-2d-edit-distance",
      "steps": [
        {
          "action": "init-base-row-column"
        },
        {
          "action": "compare-characters"
        },
        {
          "action": "take-min-of-three-operations"
        },
        {
          "action": "fill-table"
        },
        {
          "action": "found"
        }
      ]
    },
    "solutionExplanation": "A 2D DP table over prefixes of both words: matching characters carry the diagonal value forward with no cost; a mismatch takes 1 plus the minimum of the three neighboring cells, representing a delete, insert, or replace. The final cell holds the answer — O(m*n) time and space, the culmination of every DP pattern learned throughout the dungeon.",
    "xp": 500,
    "isBoss": true
  }
];
