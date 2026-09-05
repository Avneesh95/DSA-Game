/**
 * Door 83: Clone Graph. Input is a 1-indexed adjacency list (LeetCode's
 * own convention for this problem). The harness builds a Node graph from
 * it, calls the user's cloneGraph(node1), then walks the *returned
 * clone* to rebuild its adjacency list (by node value) and prints that,
 * sorted per-node, for comparison against the canonicalized input (see
 * server/seed/specialCaseTestData.js).
 */

function buildCloneGraphHarness(language, userCode) {
  if (language === 'python') {
    return `# Auto-generated judge harness (graph round-trip). Do not edit.
import sys, json

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

${userCode}

def _run():
    adj = json.loads(sys.stdin.readline())
    n = len(adj)
    if n == 0:
        print(json.dumps([]))
        return
    nodes = [Node(i + 1) for i in range(n)]
    for i, neighbors in enumerate(adj):
        nodes[i].neighbors = [nodes[j - 1] for j in neighbors]
    sol = Solution()
    clone = sol.clone_graph(nodes[0]) if hasattr(sol, 'clone_graph') else sol.cloneGraph(nodes[0])
    seen = {}
    stack = [clone]
    while stack:
        node = stack.pop()
        if node.val in seen:
            continue
        seen[node.val] = sorted(nb.val for nb in node.neighbors)
        for nb in node.neighbors:
            if nb.val not in seen:
                stack.append(nb)
    out = [seen.get(v + 1, []) for v in range(n)]
    print(json.dumps(out))

if __name__ == '__main__':
    _run()
`;
  }

  if (language === 'java') {
    const solutionClass = userCode.replace(/^\s*import\s+[\w.]+(?:\.\*)?\s*;\s*$/gm, '');
    return `// Auto-generated judge harness (graph round-trip). Do not edit.
import java.util.*;

final class Node {
    public int val;
    public List<Node> neighbors;
    public Node() { val = 0; neighbors = new ArrayList<>(); }
    public Node(int val) { this.val = val; neighbors = new ArrayList<>(); }
    public Node(int val, List<Node> neighbors) { this.val = val; this.neighbors = neighbors; }
}

final class _Json {
    private final String s;
    private int i = 0;
    private _Json(String s) { this.s = s; }
    static Object parse(String text) { return new _Json(text.trim()).parseValue(); }
    private void skipWs() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }
    private Object parseValue() {
        skipWs();
        char c = s.charAt(i);
        if (c == '[') return parseArray();
        return parseNumber();
    }
    private List<Object> parseArray() {
        List<Object> out = new ArrayList<>();
        i++; skipWs();
        if (s.charAt(i) == ']') { i++; return out; }
        while (true) {
            out.add(parseValue());
            skipWs();
            if (s.charAt(i) == ',') { i++; continue; }
            if (s.charAt(i) == ']') { i++; break; }
            throw new RuntimeException("bad json");
        }
        return out;
    }
    private Double parseNumber() {
        int start = i;
        while (i < s.length() && (Character.isDigit(s.charAt(i)) || s.charAt(i) == '-')) i++;
        return Double.parseDouble(s.substring(start, i));
    }
}

${solutionClass}

public class Main {
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
        String line = br.readLine();
        List<Object> adj = (List<Object>) _Json.parse(line);
        int n = adj.size();
        if (n == 0) { System.out.println("[]"); return; }
        Node[] nodes = new Node[n];
        for (int i = 0; i < n; i++) nodes[i] = new Node(i + 1);
        for (int i = 0; i < n; i++) {
            List<Object> neighbors = (List<Object>) adj.get(i);
            for (Object nb : neighbors) nodes[i].neighbors.add(nodes[(int) Math.round((Double) nb) - 1]);
        }
        Solution sol = new Solution();
        Node clone = sol.cloneGraph(nodes[0]);
        Map<Integer, List<Integer>> seen = new HashMap<>();
        Deque<Node> stack = new ArrayDeque<>();
        stack.push(clone);
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            if (seen.containsKey(node.val)) continue;
            List<Integer> nb = new ArrayList<>();
            for (Node x : node.neighbors) nb.add(x.val);
            Collections.sort(nb);
            seen.put(node.val, nb);
            for (Node x : node.neighbors) if (!seen.containsKey(x.val)) stack.push(x);
        }
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < n; i++) {
            if (i > 0) sb.append(",");
            List<Integer> nb = seen.getOrDefault(i + 1, new ArrayList<>());
            sb.append(nb.toString());
        }
        sb.append("]");
        System.out.println(sb.toString());
    }
}
`;
  }

  if (language === 'cpp') {
    return `// Auto-generated judge harness (graph round-trip). Do not edit.
#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() { val = 0; }
    Node(int _val) { val = _val; }
    Node(int _val, vector<Node*> _neighbors) { val = _val; neighbors = _neighbors; }
};

${userCode}

int main() {
    string line;
    std::getline(std::cin, line);
    json adj = json::parse(line);
    int n = adj.size();
    if (n == 0) { cout << "[]" << endl; return 0; }
    vector<Node*> nodes(n);
    for (int i = 0; i < n; i++) nodes[i] = new Node(i + 1);
    for (int i = 0; i < n; i++) {
        for (auto& nb : adj[i]) nodes[i]->neighbors.push_back(nodes[nb.get<int>() - 1]);
    }
    Solution sol;
    Node* clone = sol.cloneGraph(nodes[0]);
    map<int, vector<int>> seen;
    vector<Node*> stack = { clone };
    while (!stack.empty()) {
        Node* node = stack.back(); stack.pop_back();
        if (seen.count(node->val)) continue;
        vector<int> nb;
        for (auto* x : node->neighbors) nb.push_back(x->val);
        sort(nb.begin(), nb.end());
        seen[node->val] = nb;
        for (auto* x : node->neighbors) if (!seen.count(x->val)) stack.push_back(x);
    }
    json out = json::array();
    for (int i = 1; i <= n; i++) out.push_back(seen.count(i) ? seen[i] : vector<int>());
    cout << out.dump() << endl;
    return 0;
}
`;
  }

  return null; // C not supported for this door
}

module.exports = { buildCloneGraphHarness };
