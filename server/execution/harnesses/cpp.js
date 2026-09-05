/**
 * Builds a standalone C++17 program. Uses the vendored single-header
 * nlohmann/json (server/execution/vendor/json.hpp) for parsing/serializing,
 * since our canonical test format never needs JSON objects — only arrays,
 * numbers, strings, booleans and null — which nlohmann's `json` handles
 * with simple implicit conversions to/from vector<T>/string/etc.
 */

const HELPERS = `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

ListNode* _buildListNode(const json& arr) {
    ListNode dummy(0);
    ListNode* cur = &dummy;
    for (const auto& v : arr) { cur->next = new ListNode(v.get<int>()); cur = cur->next; }
    return dummy.next;
}
vector<ListNode*> _buildListNodeArr(const json& arr) {
    vector<ListNode*> out;
    for (const auto& v : arr) out.push_back(_buildListNode(v));
    return out;
}
json _printListNode(ListNode* node) {
    json out = json::array();
    int guard = 0;
    while (node != nullptr && guard < 200000) { out.push_back(node->val); node = node->next; guard++; }
    return out;
}
json _printListNodeArr(const vector<ListNode*>& nodes) {
    json out = json::array();
    for (auto* n : nodes) out.push_back(_printListNode(n));
    return out;
}
TreeNode* _buildTreeNode(const json& arr) {
    if (arr.empty() || arr[0].is_null()) return nullptr;
    TreeNode* root = new TreeNode(arr[0].get<int>());
    queue<TreeNode*> q;
    q.push(root);
    size_t i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size()) {
            if (!arr[i].is_null()) { node->left = new TreeNode(arr[i].get<int>()); q.push(node->left); }
            i++;
        }
        if (i < arr.size()) {
            if (!arr[i].is_null()) { node->right = new TreeNode(arr[i].get<int>()); q.push(node->right); }
            i++;
        }
    }
    return root;
}
json _printTreeNode(TreeNode* root) {
    json out = json::array();
    if (root == nullptr) return out;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node == nullptr) { out.push_back(nullptr); }
        else { out.push_back(node->val); q.push(node->left); q.push(node->right); }
    }
    while (!out.empty() && out.back().is_null()) out.erase(out.end() - 1);
    return out;
}
TreeNode* _findByValue(TreeNode* root, int val) {
    if (root == nullptr) return nullptr;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node == nullptr) continue;
        if (node->val == val) return node;
        q.push(node->left);
        q.push(node->right);
    }
    return nullptr;
}
`;

/** C++ type text to declare for a given classified param/return (mirrors Java's javaType almost 1:1). */
function cppDeclType(entry) {
  const { kind, depth, wrapper } = entry;
  if (kind === 'listnode') return depth === 1 ? 'vector<ListNode*>' : 'ListNode*';
  if (kind === 'treenode') return 'TreeNode*';
  const base = { int: 'int', long: 'long long', double: 'double', float: 'float', boolean: 'bool', char: 'char', string: 'string' }[kind];
  if (depth === 0) return base;
  const inner = depth === 2 ? `vector<${base}>` : base;
  return `vector<${inner}>`;
}

function buildArgExpr(p, rawVar, firstTreeVarName) {
  if (p.kind === 'listnode') return p.depth === 1 ? `_buildListNodeArr(${rawVar})` : `_buildListNode(${rawVar})`;
  if (p.kind === 'treenode') {
    return p.isTreeRef ? `_findByValue(${firstTreeVarName}, ${rawVar}.get<int>())` : `_buildTreeNode(${rawVar})`;
  }
  const declType = cppDeclType(p);
  return `${rawVar}.get<${declType}>()`;
}

function buildResultToJsonExpr(returnType, resultVar) {
  if (returnType.kind === 'void') return 'nullptr';
  if (returnType.kind === 'listnode') return returnType.depth === 1 ? `_printListNodeArr(${resultVar})` : `_printListNode(${resultVar})`;
  if (returnType.kind === 'treenode') return `_printTreeNode(${resultVar})`;
  return `json(${resultVar})`;
}

function buildCppHarness(userCode, classified) {
  const { methodName, params, returnType } = classified;
  const firstTreeParam = params.find((p) => p.kind === 'treenode' && !p.isTreeRef);
  const firstTreeVarName = firstTreeParam ? `arg${params.indexOf(firstTreeParam)}` : null;

  const argLines = [];
  const callArgs = [];
  params.forEach((p, idx) => {
    const rawVar = `_args[${idx}]`;
    const argVar = `arg${idx}`;
    const declType = p.kind === 'treenode' ? 'TreeNode*' : p.kind === 'listnode' ? cppDeclType(p) : cppDeclType(p);
    argLines.push(`    ${declType} ${argVar} = ${buildArgExpr(p, rawVar, firstTreeVarName)};`);
    callArgs.push(argVar);
  });

  const isVoid = returnType.kind === 'void';
  const callStmt = isVoid
    ? `    sol.${methodName}(${callArgs.join(', ')});\n    json _out = nullptr;`
    : `    auto _result = sol.${methodName}(${callArgs.join(', ')});\n    json _out = ${buildResultToJsonExpr(returnType, '_result')};`;

  return `// Auto-generated judge harness. Do not edit.
#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

${HELPERS}

${userCode}

int main() {
    string line;
    std::getline(std::cin, line);
    json _args = json::parse(line);
    Solution sol;
${argLines.join('\n')}
${callStmt}
    cout << _out.dump() << endl;
    return 0;
}
`;
}

module.exports = { buildCppHarness, HELPERS };
