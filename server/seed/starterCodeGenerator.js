/**
 * Starter Code Generator
 * ----------------------
 * Every problem is authored once with a Java starter stub. This module
 * mechanically derives equivalent Python, C++, and C stubs from that
 * single Java signature, so all 100 problems get consistent multi-language
 * support without hand-writing ~300 additional snippets.
 *
 * A small number of problems (design-style, multi-method classes like
 * MinStack) don't fit the "single method" pattern and are special-cased
 * in MANUAL_OVERRIDES below, keyed by doorNumber.
 */

// ---- Java type -> {py, cpp, c} ----
const BASE_TYPES = {
  'int': { py: 'int', cpp: 'int', c: 'int' },
  'long': { py: 'int', cpp: 'long long', c: 'long long' },
  'double': { py: 'float', cpp: 'double', c: 'double' },
  'float': { py: 'float', cpp: 'float', c: 'float' },
  'boolean': { py: 'bool', cpp: 'bool', c: 'bool' },
  'char': { py: 'str', cpp: 'char', c: 'char' },
  'String': { py: 'str', cpp: 'string', c: 'char*' },
  'void': { py: 'None', cpp: 'void', c: 'void' },
};

const POINTER_TYPES = ['ListNode', 'TreeNode', 'Node'];

function stripGenerics(type) {
  // "List<Integer>" -> depth 1 array of int; "List<List<Integer>>" -> depth 2, etc.
  let depth = 0;
  let inner = type;
  while (/^List<(.*)>$/.test(inner.trim())) {
    inner = inner.trim().match(/^List<(.*)>$/)[1];
    depth += 1;
  }
  return { inner: inner.trim(), depth };
}

function arraySuffixDepth(type) {
  const matches = type.match(/\[\]/g);
  return matches ? matches.length : 0;
}

// Maps a single Java type (e.g. "int[]", "List<List<Integer>>", "TreeNode") to
// { py, cpp, c, cArrayDepth, cBaseType } describing how to render it per language.
function mapType(javaType) {
  const trimmed = javaType.trim();

  // Generic List<...> forms
  if (trimmed.startsWith('List<')) {
    const { inner, depth } = stripGenerics(trimmed);
    const innerMapped = mapType(inner === 'Integer' ? 'int' : inner === 'String' ? 'String' : inner);
    const pyType = 'List['.repeat(depth) + innerMapped.py + ']'.repeat(depth);
    const cppType = depth === 1 ? `vector<${innerMapped.cpp}>` : `vector<vector<${innerMapped.cpp}>>`;
    // NOTE: previously this stripped a trailing '*' from innerMapped.c, which
    // silently collapsed List<String> down to a bare `char` base type (losing
    // a pointer level). Keep the base type's own pointer-ness intact — the
    // depth/stars logic in generateC() adds the *array* nesting on top of it.
    const cBase = innerMapped.c || 'int';
    return { py: pyType, cpp: cppType, c: cBase, cArrayDepth: depth, cBaseType: cBase };
  }

  // Array forms: int[], int[][], char[][], ListNode[]
  const depth = arraySuffixDepth(trimmed);
  if (depth > 0) {
    const base = trimmed.replace(/\[\]/g, '').trim();
    const baseMapped = mapType(base);
    const pyType = 'List['.repeat(depth) + baseMapped.py + ']'.repeat(depth);
    const cppType = depth === 1 ? `vector<${baseMapped.cpp}>` : `vector<vector<${baseMapped.cpp}>>`;
    return { py: pyType, cpp: cppType, c: baseMapped.c, cArrayDepth: depth, cBaseType: baseMapped.c };
  }

  // Pointer-style custom classes (predefined structs, mirroring LeetCode conventions)
  if (POINTER_TYPES.includes(trimmed)) {
    return { py: `Optional['${trimmed}']`, cpp: `${trimmed}*`, c: `struct ${trimmed}*`, cArrayDepth: 0, cBaseType: `struct ${trimmed}*` };
  }

  // Base primitive/known types
  if (BASE_TYPES[trimmed]) {
    return { ...BASE_TYPES[trimmed], cArrayDepth: 0, cBaseType: BASE_TYPES[trimmed].c };
  }

  // Fallback: treat unknown types as opaque pointers/objects
  return { py: trimmed, cpp: trimmed, c: `void*`, cArrayDepth: 0, cBaseType: 'void*' };
}

// Splits a Java parameter list on top-level commas (ignoring commas inside <> or [])
function splitParams(paramsStr) {
  if (!paramsStr.trim()) return [];
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of paramsStr) {
    if (ch === '<') depth += 1;
    if (ch === '>') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function coreTypeName(type) {
  // Strips array brackets and List<...> generic wrappers down to the base identifier.
  let t = type.trim();
  while (/^List<(.*)>$/.test(t)) t = t.match(/^List<(.*)>$/)[1].trim();
  return t.replace(/\[\]/g, '').trim();
}

function usesType(types, baseName) {
  return types.some((t) => coreTypeName(t) === baseName);
}

function camelToSnake(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function parseJavaSignature(javaCode) {
  const match = javaCode.match(/public\s+([A-Za-z_][\w<>,\[\]\s]*?)\s+(\w+)\s*\(([^)]*)\)/);
  if (!match) return null;
  const [, returnType, methodName, paramsRaw] = match;
  const params = splitParams(paramsRaw).map((p) => {
    const lastSpace = p.lastIndexOf(' ');
    return { type: p.slice(0, lastSpace).trim(), name: p.slice(lastSpace + 1).trim() };
  });
  return { returnType: returnType.trim(), methodName, params };
}

// Comment header noting predefined helper structs/classes, mirroring what
// LeetCode-style templates assume are already defined for you.
function predefinedComment(lang, usesListNode, usesTreeNode, usesNode) {
  const lines = [];
  if (lang === 'python') {
    if (usesListNode) lines.push('# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next');
    if (usesTreeNode) lines.push('# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right');
    if (usesNode) lines.push('# class Node:\n#     def __init__(self, val=0, neighbors=None):\n#         self.val = val\n#         self.neighbors = neighbors or []');
  } else if (lang === 'cpp') {
    if (usesListNode) lines.push('// struct ListNode { int val; ListNode *next; ListNode(int x) : val(x), next(nullptr) {} };');
    if (usesTreeNode) lines.push('// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };');
    if (usesNode) lines.push('// struct Node { int val; vector<Node*> neighbors; };');
  } else if (lang === 'c') {
    if (usesListNode) lines.push('// struct ListNode { int val; struct ListNode *next; };');
    if (usesTreeNode) lines.push('// struct TreeNode { int val; struct TreeNode *left, *right; };');
    if (usesNode) lines.push('// struct Node { int val; struct Node **neighbors; int neighborsSize; };');
  }
  return lines.length ? lines.join('\n') + '\n' : '';
}

function defaultPyReturn(returnType) {
  if (returnType === 'void') return 'pass';
  if (returnType === 'boolean') return 'return False';
  if (returnType.includes('[]') || returnType.startsWith('List<')) return 'return []';
  if (POINTER_TYPES.includes(returnType)) return 'return None';
  if (returnType === 'String') return 'return ""';
  if (returnType === 'double' || returnType === 'float') return 'return 0.0';
  return 'return 0';
}

function defaultCppReturn(cppType) {
  if (cppType === 'void') return '';
  if (cppType === 'bool') return 'return false;';
  if (cppType.startsWith('vector<')) return `return ${cppType}();`;
  if (cppType === 'string') return 'return "";';
  if (cppType.endsWith('*')) return 'return nullptr;';
  if (cppType === 'double' || cppType === 'float') return 'return 0.0;';
  return 'return 0;';
}

function generatePython(sig) {
  const allTypes = [sig.returnType, ...sig.params.map((p) => p.type)];
  const usesListNode = usesType(allTypes, 'ListNode');
  const usesTreeNode = usesType(allTypes, 'TreeNode');
  const usesNode = usesType(allTypes, 'Node');

  const pyParams = sig.params.map((p) => `${camelToSnake(p.name)}: ${mapType(p.type).py}`).join(', ');
  const pyReturnType = mapType(sig.returnType).py;
  const methodName = camelToSnake(sig.methodName);

  return (
    predefinedComment('python', usesListNode, usesTreeNode, usesNode) +
    `from typing import List, Optional\n\n` +
    `class Solution:\n` +
    `    def ${methodName}(self, ${pyParams}) -> ${pyReturnType}:\n` +
    `        # Write your solution here\n` +
    `        ${defaultPyReturn(sig.returnType)}\n`
  );
}

function generateCpp(sig) {
  const allTypes = [sig.returnType, ...sig.params.map((p) => p.type)];
  const usesListNode = usesType(allTypes, 'ListNode');
  const usesTreeNode = usesType(allTypes, 'TreeNode');
  const usesNode = usesType(allTypes, 'Node');

  const cppParams = sig.params
    .map((p) => {
      const mapped = mapType(p.type);
      const isRefCandidate = mapped.cpp.startsWith('vector<') || mapped.cpp === 'string';
      return `${mapped.cpp}${isRefCandidate ? '&' : ''} ${p.name}`;
    })
    .join(', ');
  const cppReturnType = mapType(sig.returnType).cpp;

  return (
    '#include <vector>\n#include <string>\nusing namespace std;\n\n' +
    predefinedComment('cpp', usesListNode, usesTreeNode, usesNode) +
    `class Solution {\n` +
    `public:\n` +
    `    ${cppReturnType} ${sig.methodName}(${cppParams}) {\n` +
    `        // Write your solution here\n` +
    `        ${defaultCppReturn(cppReturnType)}\n` +
    `    }\n` +
    `};\n`
  );
}

/**
 * Computes the LeetCode-style C function signature for a parsed Java
 * method: parameter list with array-size out-params, return type, and
 * (for array-returning functions) the returnSize / returnColumnSizes
 * out-params. Shared by generateC() (starter stub text) and the C
 * execution harness (server/execution/harnesses/c.js), so the harness
 * always calls the exact signature the starter code declares.
 */
function getCFunctionSignature(sig) {
  const extraSizeParams = [];
  const params = sig.params.map((p) => {
    const mapped = mapType(p.type);
    if (mapped.cArrayDepth >= 1) {
      const stars = '*'.repeat(mapped.cArrayDepth);
      extraSizeParams.push({ name: `${p.name}Size`, cType: 'int' });
      if (mapped.cArrayDepth === 2) extraSizeParams.push({ name: `${p.name}ColSize`, cType: 'int*' });
      return { name: p.name, cType: `${mapped.cBaseType}${stars}`, arrayDepth: mapped.cArrayDepth, cBaseType: mapped.cBaseType };
    }
    return { name: p.name, cType: mapped.c, arrayDepth: 0, cBaseType: mapped.c };
  });

  const returnMapped = mapType(sig.returnType);
  const returnsArray = returnMapped.cArrayDepth >= 1;
  const cReturnType = returnsArray ? `${returnMapped.cBaseType}${'*'.repeat(returnMapped.cArrayDepth)}` : returnMapped.c;

  const returnOutParams = [];
  if (returnsArray) {
    returnOutParams.push({ name: 'returnSize', cType: 'int*' });
    if (returnMapped.cArrayDepth === 2) returnOutParams.push({ name: 'returnColumnSizes', cType: 'int**' });
  }

  const allParams = [...params, ...extraSizeParams, ...returnOutParams];
  return {
    methodName: sig.methodName,
    cReturnType,
    returnArrayDepth: returnMapped.cArrayDepth,
    returnBaseType: returnMapped.cBaseType,
    params,
    extraSizeParams,
    returnOutParams,
    allParams,
    paramListStr: allParams.length ? allParams.map((p) => `${p.cType} ${p.name}`).join(', ') : 'void',
  };
}

function generateC(sig) {
  const allTypes = [sig.returnType, ...sig.params.map((p) => p.type)];
  const usesListNode = usesType(allTypes, 'ListNode');
  const usesTreeNode = usesType(allTypes, 'TreeNode');
  const usesNode = usesType(allTypes, 'Node');

  const cSig = getCFunctionSignature(sig);

  let defaultReturn = 'return 0;';
  if (cSig.cReturnType === 'void') defaultReturn = '';
  else if (cSig.cReturnType === 'bool') defaultReturn = 'return false;';
  else if (cSig.cReturnType.endsWith('*')) defaultReturn = 'return NULL;';
  else if (cSig.cReturnType === 'double' || cSig.cReturnType === 'float') defaultReturn = 'return 0.0;';

  const initReturnSize = cSig.returnOutParams.length ? '    *returnSize = 0;\n' : '';

  return (
    '#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\n' +
    predefinedComment('c', usesListNode, usesTreeNode, usesNode) +
    `${cSig.cReturnType} ${sig.methodName}(${cSig.paramListStr}) {\n` +
    `    // Write your solution here\n` +
    initReturnSize +
    `    ${defaultReturn}\n` +
    `}\n`
  );
}

// ---- Manual overrides for multi-method "design" problems ----
// These don't fit the single-method-per-class pattern the parser above
// handles, so their multi-language stubs are written directly.
const MANUAL_OVERRIDES = {
  54: {
    // Min Stack
    python:
      'class MinStack:\n' +
      '    def __init__(self):\n' +
      '        # Write your solution here\n' +
      '        pass\n\n' +
      '    def push(self, val: int) -> None:\n' +
      '        pass\n\n' +
      '    def pop(self) -> None:\n' +
      '        pass\n\n' +
      '    def top(self) -> int:\n' +
      '        return -1\n\n' +
      '    def get_min(self) -> int:\n' +
      '        return -1\n',
    cpp:
      '#include <vector>\nusing namespace std;\n\n' +
      'class MinStack {\n' +
      'public:\n' +
      '    MinStack() {}\n' +
      '    void push(int val) {}\n' +
      '    void pop() {}\n' +
      '    int top() { return -1; }\n' +
      '    int getMin() { return -1; }\n' +
      '};\n',
    c:
      '#include <stdlib.h>\n\n' +
      'typedef struct {\n' +
      '    // Write your fields here\n' +
      '} MinStack;\n\n' +
      'MinStack* minStackCreate() { return NULL; }\n' +
      'void minStackPush(MinStack* obj, int val) {}\n' +
      'void minStackPop(MinStack* obj) {}\n' +
      'int minStackTop(MinStack* obj) { return -1; }\n' +
      'int minStackGetMin(MinStack* obj) { return -1; }\n' +
      'void minStackFree(MinStack* obj) {}\n',
  },
  55: {
    // Implement Queue using Stacks
    python:
      'class MyQueue:\n' +
      '    def __init__(self):\n' +
      '        # Write your solution here\n' +
      '        pass\n\n' +
      '    def push(self, x: int) -> None:\n' +
      '        pass\n\n' +
      '    def pop(self) -> int:\n' +
      '        return -1\n\n' +
      '    def peek(self) -> int:\n' +
      '        return -1\n\n' +
      '    def empty(self) -> bool:\n' +
      '        return True\n',
    cpp:
      'class MyQueue {\n' +
      'public:\n' +
      '    MyQueue() {}\n' +
      '    void push(int x) {}\n' +
      '    int pop() { return -1; }\n' +
      '    int peek() { return -1; }\n' +
      '    bool empty() { return true; }\n' +
      '};\n',
    c:
      '#include <stdlib.h>\n#include <stdbool.h>\n\n' +
      'typedef struct {\n' +
      '    // Write your fields here\n' +
      '} MyQueue;\n\n' +
      'MyQueue* myQueueCreate() { return NULL; }\n' +
      'void myQueuePush(MyQueue* obj, int x) {}\n' +
      'int myQueuePop(MyQueue* obj) { return -1; }\n' +
      'int myQueuePeek(MyQueue* obj) { return -1; }\n' +
      'bool myQueueEmpty(MyQueue* obj) { return true; }\n' +
      'void myQueueFree(MyQueue* obj) {}\n',
  },
  80: {
    // Serialize and Deserialize Binary Tree
    python:
      "# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\n" +
      'class Codec:\n' +
      '    def serialize(self, root) -> str:\n' +
      '        # Write your solution here\n' +
      '        return ""\n\n' +
      '    def deserialize(self, data: str):\n' +
      '        return None\n',
    cpp:
      '#include <string>\nusing namespace std;\n\n' +
      '// struct TreeNode { int val; TreeNode *left, *right; TreeNode(int x) : val(x), left(nullptr), right(nullptr) {} };\n\n' +
      'class Codec {\n' +
      'public:\n' +
      '    string serialize(TreeNode* root) {\n' +
      '        // Write your solution here\n' +
      '        return "";\n' +
      '    }\n' +
      '    TreeNode* deserialize(string data) {\n' +
      '        return nullptr;\n' +
      '    }\n' +
      '};\n',
    c:
      '#include <stdlib.h>\n\n' +
      '// struct TreeNode { int val; struct TreeNode *left, *right; };\n\n' +
      'char* serialize(struct TreeNode* root) {\n' +
      '    // Write your solution here\n' +
      '    return NULL;\n' +
      '}\n\n' +
      'struct TreeNode* deserialize(char* data) {\n' +
      '    return NULL;\n' +
      '}\n',
  },
};

/**
 * Given a problem object with a Java-only starterCode array, returns a new
 * starterCode array with python/cpp/c entries appended (Java entry preserved).
 * Falls back gracefully (skips a language) if the signature can't be parsed,
 * rather than throwing and blocking the whole seed.
 */
function expandStarterCode(problem) {
  const javaEntry = problem.starterCode.find((s) => s.language === 'java');
  if (!javaEntry) return problem.starterCode;

  const result = [...problem.starterCode];

  if (MANUAL_OVERRIDES[problem.doorNumber]) {
    const overrides = MANUAL_OVERRIDES[problem.doorNumber];
    result.push({ language: 'python', code: overrides.python });
    result.push({ language: 'cpp', code: overrides.cpp });
    result.push({ language: 'c', code: overrides.c });
    return result;
  }

  const sig = parseJavaSignature(javaEntry.code);
  if (!sig) {
    console.warn(`[starterCodeGenerator] Could not parse signature for door ${problem.doorNumber}; only Java will be available.`);
    return result;
  }

  try {
    result.push({ language: 'python', code: generatePython(sig) });
    result.push({ language: 'cpp', code: generateCpp(sig) });
    result.push({ language: 'c', code: generateC(sig) });
  } catch (err) {
    console.warn(`[starterCodeGenerator] Failed generating multi-language stubs for door ${problem.doorNumber}: ${err.message}`);
  }

  return result;
}

module.exports = { expandStarterCode, parseJavaSignature, mapType, getCFunctionSignature };
