const { JAVA_HELPERS } = require('./javaHelpers');

/** Picks the `_Json.asXxx` conversion helper name for a classified param. */
function converterFor(p) {
  const { kind, depth, wrapper } = p;
  if (kind === 'listnode') return depth === 1 ? 'buildListNodeArr' : 'buildListNode';
  if (kind === 'treenode') return null; // handled specially (buildTreeNode / findByValue)

  const scalarFns = {
    int: 'asInt', long: 'asLong', double: 'asDouble', float: 'asFloat',
    boolean: 'asBool', char: 'asChar', string: 'asString',
  };
  if (depth === 0) return scalarFns[kind];

  if (wrapper === 'array') {
    const arrFns1 = { int: 'asIntArr', long: 'asLongArr', double: 'asDoubleArr', boolean: 'asBoolArr', char: 'asCharArr', string: 'asStringArr' };
    const arrFns2 = { int: 'asIntArr2', double: 'asDoubleArr2', char: 'asCharArr2', string: 'asStringArr2' };
    if (depth === 1) return arrFns1[kind];
    if (depth === 2) return arrFns2[kind];
  }
  if (wrapper === 'list') {
    const listFns1 = { int: 'asListInt', string: 'asListStr' };
    const listFns2 = { int: 'asListListInt', string: 'asListListStr' };
    if (depth === 1) return listFns1[kind];
    if (depth === 2) return listFns2[kind];
  }
  return null;
}

/**
 * @param {string} userCode - submitted Java source (defines `class Solution`)
 * @param {object} classified - result of signatureUtil.classifySignature
 * @returns {string} full runnable Main.java content (public class must be named Main)
 */
function buildJavaHarness(userCode, classified) {
  const { methodName, params, returnType, returnJavaType } = classified;

  const firstTreeParam = params.find((p) => p.kind === 'treenode' && !p.isTreeRef);
  const firstTreeVarName = firstTreeParam ? `arg${params.indexOf(firstTreeParam)}` : null;

  const argLines = [];
  const callArgs = [];
  params.forEach((p, idx) => {
    const rawVar = `raw${idx}`;
    const argVar = `arg${idx}`;
    argLines.push(`        Object ${rawVar} = _args.get(${idx});`);
    if (p.kind === 'treenode' && p.isTreeRef) {
      argLines.push(`        TreeNode ${argVar} = _Json.findByValue(${firstTreeVarName}, _Json.asInt(${rawVar}));`);
    } else if (p.kind === 'treenode') {
      argLines.push(`        TreeNode ${argVar} = _Json.buildTreeNode(${rawVar});`);
    } else {
      const fn = converterFor(p);
      if (!fn) {
        throw new Error(`No Java converter for param "${p.name}" of type ${p.javaType}`);
      }
      argLines.push(`        ${p.javaType} ${argVar} = _Json.${fn}(${rawVar});`);
    }
    callArgs.push(argVar);
  });

  // Pull any `import ...;` lines out of the user's submission (they must
  // precede all type declarations in Java, but our helpers/Main classes
  // already come first in the file) and hoist them to the very top instead.
  const importLines = [];
  let solutionClass = userCode.replace(/^\s*import\s+[\w.]+(?:\.\*)?\s*;\s*$/gm, (m) => {
    importLines.push(m.trim());
    return '';
  });
  solutionClass = solutionClass.replace(/public\s+class\s+Solution/, 'class Solution').replace(/public\s+class\s+Codec/, 'class Codec');
  const extraImports = [...new Set(importLines)].filter((imp) => !imp.includes('java.util.*')).join('\n');

  const isVoid = returnType.kind === 'void';
  const callStmt = isVoid && params.length > 0
    ? `        _sol.${methodName}(${callArgs.join(', ')});\n        Object _out = _Json.toJson(arg0);`
    : isVoid
    ? `        _sol.${methodName}(${callArgs.join(', ')});\n        Object _out = null;`
    : `        ${returnJavaType} _result = _sol.${methodName}(${callArgs.join(', ')});\n        Object _out = _Json.toJson(_result);`;

  return `// Auto-generated judge harness. Do not edit.
import java.util.*;
${extraImports}

${JAVA_HELPERS}

${solutionClass}

public class Main {
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
        String line = br.readLine();
        List<Object> _args = (List<Object>) _Json.parse(line);
        Solution _sol = new Solution();
${argLines.join('\n')}
${callStmt}
        System.out.println(_Json.stringify(_out));
    }
}
`;
}

module.exports = { buildJavaHarness, converterFor };
