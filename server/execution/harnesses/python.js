/**
 * Builds a standalone Python 3 program that:
 *   1. Defines ListNode/TreeNode helpers (only if the signature needs them)
 *   2. Embeds the user's `class Solution` code verbatim
 *   3. Reads one line of JSON (the argsJson array) from stdin
 *   4. Builds native arguments, calls the target method, and prints the
 *      JSON-encoded result to stdout as the LAST line.
 *
 * Python's json module already maps JSON arrays/numbers/strings/bools/null
 * onto exactly the native types List[Solution methods] expect, so only
 * ListNode / TreeNode need explicit conversion helpers.
 */

const HELPERS = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def _build_listnode(arr):
    dummy = ListNode(0)
    cur = dummy
    for v in arr:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def _print_listnode(node):
    out = []
    seen = 0
    while node is not None and seen < 200000:
        out.append(node.val)
        node = node.next
        seen += 1
    return out

def _build_treenode(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.left = TreeNode(v)
                queue.append(node.left)
        if i < len(arr):
            v = arr[i]; i += 1
            if v is not None:
                node.right = TreeNode(v)
                queue.append(node.right)
    return root

def _print_treenode(root):
    if root is None:
        return []
    out = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            out.append(None)
        else:
            out.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out

def _find_by_value(root, val):
    if root is None:
        return None
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            continue
        if node.val == val:
            return node
        queue.append(node.left)
        queue.append(node.right)
    return None
`;

function buildArgExpr(param, argVarName, firstTreeVarName) {
  const { kind, depth, isTreeRef } = param;
  if (kind === 'listnode') {
    if (depth === 1) return `[_build_listnode(x) for x in ${argVarName}]`;
    return `_build_listnode(${argVarName})`;
  }
  if (kind === 'treenode') {
    if (isTreeRef) return `_find_by_value(${firstTreeVarName}, ${argVarName})`;
    return `_build_treenode(${argVarName})`;
  }
  // scalars / arrays / lists / 2D — json already produced the right shape
  return argVarName;
}

function buildResultExpr(returnType, resultVar) {
  const { kind, depth } = returnType;
  if (kind === 'void') return 'None';
  if (kind === 'listnode') {
    if (depth === 1) return `[_print_listnode(x) for x in ${resultVar}]`;
    return `_print_listnode(${resultVar})`;
  }
  if (kind === 'treenode') return `_print_treenode(${resultVar})`;
  return resultVar;
}

/**
 * @param {string} userCode - the submitted `class Solution: ...` code
 * @param {object} classified - result of signatureUtil.classifySignature
 * @returns {string} full runnable python program
 */
function buildPythonHarness(userCode, classified) {
  const { methodName, params, returnType } = classified;
  const needsHelpers = params.some((p) => p.kind === 'listnode' || p.kind === 'treenode') || returnType.kind === 'listnode' || returnType.kind === 'treenode';

  const firstTreeParam = params.find((p) => p.kind === 'treenode' && !p.isTreeRef);
  const firstTreeVarName = firstTreeParam ? `_arg_${params.indexOf(firstTreeParam)}` : 'None';

  const argLines = [];
  const callArgs = [];
  params.forEach((p, i) => {
    const rawVar = `_raw_${i}`;
    const argVar = `_arg_${i}`;
    argLines.push(`    ${rawVar} = _args[${i}]`);
    argLines.push(`    ${argVar} = ${buildArgExpr(p, rawVar, firstTreeVarName)}`);
    callArgs.push(argVar);
  });

  const methodNameSnake = methodName.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

  return `# Auto-generated judge harness. Do not edit.
import sys, json

${needsHelpers ? HELPERS : ''}

${userCode}

def _run():
    _line = sys.stdin.readline()
    _args = json.loads(_line)
    _sol = Solution()
${argLines.join('\n')}
    try:
        _method = getattr(_sol, ${JSON.stringify(methodNameSnake)})
    except AttributeError:
        _method = getattr(_sol, ${JSON.stringify(methodName)})
    _result = _method(${callArgs.join(', ')})
    if _result is None and ${params.length} > 0:
        _result = _arg_0
    _out = ${returnType.kind === 'void' && params.length > 0 ? buildResultExpr(params[0], '_arg_0') : buildResultExpr(returnType, '_result')}
    print(json.dumps(_out))

if __name__ == '__main__':
    _run()
`;
}

module.exports = { buildPythonHarness, HELPERS };
