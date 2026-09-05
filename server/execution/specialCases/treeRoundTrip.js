const { HELPERS: PY_HELPERS } = require('../harnesses/python');
const { JAVA_HELPERS } = require('../harnesses/javaHelpers');
const { HELPERS: CPP_HELPERS } = require('../harnesses/cpp');

function buildTreeRoundTripHarness(language, userCode) {
  if (language === 'python') {
    return `# Auto-generated judge harness (tree round-trip). Do not edit.
import sys, json

${PY_HELPERS}

${userCode}

def _run():
    arr = json.loads(sys.stdin.readline())
    tree = _build_treenode(arr)
    codec = Codec()
    s = codec.serialize(tree)
    tree2 = codec.deserialize(s)
    print(json.dumps(_print_treenode(tree2)))

if __name__ == '__main__':
    _run()
`;
  }

  if (language === 'java') {
    const solutionClass = userCode
      .replace(/^\s*import\s+[\w.]+(?:\.\*)?\s*;\s*$/gm, '')
      .replace(/public\s+class\s+Codec/, 'class Codec');
    return `// Auto-generated judge harness (tree round-trip). Do not edit.
import java.util.*;

${JAVA_HELPERS}

${solutionClass}

public class Main {
    public static void main(String[] args) throws Exception {
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
        String line = br.readLine();
        java.util.List<Object> arr = (java.util.List<Object>) _Json.parse(line);
        TreeNode tree = _Json.buildTreeNode(arr);
        Codec codec = new Codec();
        String s = codec.serialize(tree);
        TreeNode tree2 = codec.deserialize(s);
        System.out.println(_Json.stringify(_Json.toJson(tree2)));
    }
}
`;
  }

  if (language === 'cpp') {
    return `// Auto-generated judge harness (tree round-trip). Do not edit.
#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

${CPP_HELPERS}

${userCode}

int main() {
    string line;
    std::getline(std::cin, line);
    json arr = json::parse(line);
    TreeNode* tree = _buildTreeNode(arr);
    Codec codec;
    string s = codec.serialize(tree);
    TreeNode* tree2 = codec.deserialize(s);
    cout << _printTreeNode(tree2).dump() << endl;
    return 0;
}
`;
  }

  return null; // C not supported for this door — see server/execution/specialCases/index.js
}

module.exports = { buildTreeRoundTripHarness };
