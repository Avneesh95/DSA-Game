/**
 * signatureUtil.js
 * ----------------
 * Classifies a parsed Java method signature (from starterCodeGenerator's
 * parseJavaSignature) into a language-agnostic shape description that the
 * per-language harness generators use to marshal JSON <-> native values.
 *
 * Canonical JSON test-data convention (see server/seed/testDataNormalizer.js):
 *   - A key's `argsJson` is a JSON array, one element per method parameter,
 *     in declaration order.
 *   - Scalars (int/long/double/float/boolean/char/String) are plain JSON
 *     values. Arrays / List<...> are JSON arrays (nested for 2D).
 *   - ListNode is a JSON array of numbers (the list's values in order;
 *     [] means a null head).
 *   - ListNode[] is a JSON array of such arrays.
 *   - TreeNode is a JSON array in LeetCode level-order form, e.g.
 *     [1,2,3,null,null,4,5]. A *secondary* TreeNode parameter (any
 *     TreeNode-typed parameter after the first one, e.g. `p`, `q` in a
 *     Lowest-Common-Ancestor style signature) is instead a plain JSON
 *     number: the value of the node it refers to inside the first tree.
 *   - `expectedJson` follows the same convention for the return type.
 *   - `Node` (graph) and multi-method "design" classes (MinStack, etc.)
 *     are NOT handled generically — those doors are special-cased in
 *     server/execution/specialCases/.
 */

const { parseJavaSignature } = require('../seed/starterCodeGenerator');

const SCALAR_KINDS = new Set(['int', 'long', 'double', 'float', 'boolean', 'char', 'string']);

const BASE_KIND_MAP = {
  int: 'int',
  Integer: 'int',
  long: 'long',
  Long: 'long',
  double: 'double',
  Double: 'double',
  float: 'float',
  Float: 'float',
  boolean: 'boolean',
  Boolean: 'boolean',
  char: 'char',
  Character: 'char',
  String: 'string',
  void: 'void',
};

/**
 * Strips List<...> wrappers and [] suffixes, returning the base type name
 * and the combined nesting depth (arrays and List<> both count as depth).
 */
function unwrap(javaType) {
  let t = javaType.trim();
  let depth = 0;
  let wrapper = 'none'; // 'list' | 'array' | 'none' — dataset never mixes the two
  while (/^List<(.*)>$/.test(t)) {
    t = t.match(/^List<(.*)>$/)[1].trim();
    depth += 1;
    wrapper = 'list';
  }
  const arrMatches = t.match(/\[\]/g);
  if (arrMatches) {
    depth += arrMatches.length;
    t = t.replace(/\[\]/g, '').trim();
    wrapper = 'array';
  }
  return { base: t, depth, wrapper };
}

/**
 * Classifies a single Java type string into { kind, depth }.
 *   kind: 'int'|'long'|'double'|'float'|'boolean'|'char'|'string'|'void'
 *       | 'listnode' | 'treenode' | 'node' | 'unknown'
 *   depth: 0 for a scalar/pointer type itself, 1 for a 1D array/List of it,
 *          2 for a 2D array/List of it (only meaningful for scalar kinds).
 *          For 'listnode', depth 1 means ListNode[].
 */
function classifyType(javaType) {
  const { base, depth, wrapper } = unwrap(javaType);
  if (base === 'ListNode') return { kind: 'listnode', depth, wrapper };
  if (base === 'TreeNode') return { kind: 'treenode', depth, wrapper };
  if (base === 'Node') return { kind: 'node', depth, wrapper };
  const mapped = BASE_KIND_MAP[base];
  return { kind: mapped || 'unknown', depth, wrapper };
}

/**
 * Full classification of a method signature: each parameter gets a
 * `{ name, javaType, kind, depth, isTreeRef }` entry, plus the return type
 * classification. `isTreeRef` is true for any TreeNode-kind parameter after
 * the first one (see file header) — these are transmitted as a plain
 * integer value, not a tree.
 */
function classifySignature(sig) {
  let seenTree = false;
  const params = sig.params.map((p) => {
    const c = classifyType(p.type);
    let isTreeRef = false;
    if (c.kind === 'treenode' && c.depth === 0) {
      if (seenTree) isTreeRef = true;
      else seenTree = true;
    }
    return { name: p.name, javaType: p.type, kind: c.kind, depth: c.depth, wrapper: c.wrapper, isTreeRef };
  });
  const returnType = classifyType(sig.returnType);
  return {
    methodName: sig.methodName,
    params,
    returnType,
    returnJavaType: sig.returnType,
  };
}

/** True if every param/return in this signature is handled by the generic harnesses. */
function isGenericallySupported(classified) {
  const supported = (c) => c.kind !== 'node' && c.kind !== 'unknown';
  if (!supported(classified.returnType)) return false;
  return classified.params.every((p) => supported(p));
}

module.exports = {
  unwrap,
  classifyType,
  classifySignature,
  isGenericallySupported,
  SCALAR_KINDS,
  parseJavaSignature,
};
