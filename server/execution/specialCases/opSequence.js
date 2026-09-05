/**
 * Judge harnesses for doors 54 (Min Stack) and 55 (Implement Queue using
 * Stacks) — stateful multi-method classes rather than a single pure
 * function, so they don't go through the generic signature-driven
 * harnesses. Wire format: argsJson is `[ops, args]` where `ops` is an
 * array of method-name strings and `args[i]` is the argument array for
 * ops[i]; expectedJson is one result per op (null for void ops).
 */

const CONFIG = {
  54: {
    className: 'MinStack',
    // op name -> { javaCall, pyCall, cppCall, resultKind: 'void'|'int'|'bool' }
    ops: {
      push: { pyMethod: 'push', resultKind: 'void' },
      pop: { pyMethod: 'pop', resultKind: 'void' },
      top: { pyMethod: 'top', resultKind: 'int' },
      getMin: { pyMethod: 'get_min', javaMethod: 'getMin', cppMethod: 'getMin', resultKind: 'int' },
    },
  },
  55: {
    className: 'MyQueue',
    ops: {
      push: { pyMethod: 'push', resultKind: 'void' },
      pop: { pyMethod: 'pop', resultKind: 'int' },
      peek: { pyMethod: 'peek', resultKind: 'int' },
      empty: { pyMethod: 'empty', resultKind: 'bool' },
    },
  },
};

function buildPythonOpHarness(doorNumber, userCode) {
  const cfg = CONFIG[doorNumber];
  const dispatch = Object.entries(cfg.ops)
    .map(([op, m]) => `        if op == ${JSON.stringify(op)}:\n            r = obj.${m.pyMethod}(*a)\n            out.append(r if ${JSON.stringify(m.resultKind)} != 'void' else None)\n            continue`)
    .join('\n');
  return `# Auto-generated judge harness (op-sequence). Do not edit.
import sys, json

${userCode}

def _run():
    ops, args = json.loads(sys.stdin.readline())
    obj = ${cfg.className}()
    out = []
    for op, a in zip(ops, args):
${dispatch}
    print(json.dumps(out))

if __name__ == '__main__':
    _run()
`;
}

function buildJavaOpHarness(doorNumber, userCode) {
  const cfg = CONFIG[doorNumber];
  const cases = Object.entries(cfg.ops)
    .map(([op, m]) => {
      const method = m.javaMethod || op;
      if (m.resultKind === 'void') {
        const argExpr = op === 'push' ? '_Json.asInt(a.get(0))' : '';
        return `            case ${JSON.stringify(op)}: obj.${method}(${argExpr}); out.add(null); break;`;
      }
      if (m.resultKind === 'bool') return `            case ${JSON.stringify(op)}: out.add(obj.${method}()); break;`;
      return `            case ${JSON.stringify(op)}: out.add((double) obj.${method}()); break;`;
    })
    .join('\n');

  const { JAVA_HELPERS } = require('../harnesses/javaHelpers');
  const solutionClass = userCode.replace(/^\s*import\s+[\w.]+(?:\.\*)?\s*;\s*$/gm, '');

  return `// Auto-generated judge harness (op-sequence). Do not edit.
import java.util.*;

${JAVA_HELPERS}

${solutionClass}

public class Main {
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        java.io.BufferedReader br = new java.io.BufferedReader(new java.io.InputStreamReader(System.in));
        String line = br.readLine();
        List<Object> pair = (List<Object>) _Json.parse(line);
        List<Object> ops = (List<Object>) pair.get(0);
        List<Object> argsList = (List<Object>) pair.get(1);
        ${cfg.className} obj = new ${cfg.className}();
        List<Object> out = new ArrayList<>();
        for (int i = 0; i < ops.size(); i++) {
            String op = (String) ops.get(i);
            List<Object> a = (List<Object>) argsList.get(i);
            switch (op) {
${cases}
            }
        }
        System.out.println(_Json.stringify(out));
    }
}
`;
}

function buildCppOpHarness(doorNumber, userCode) {
  const cfg = CONFIG[doorNumber];
  const cases = Object.entries(cfg.ops)
    .map(([op, m]) => {
      const method = m.cppMethod || op;
      if (m.resultKind === 'void') {
        const argExpr = op === 'push' ? 'a[0].get<int>()' : '';
        return `        if (op == ${JSON.stringify(op)}) { obj.${method}(${argExpr}); out.push_back(nullptr); continue; }`;
      }
      return `        if (op == ${JSON.stringify(op)}) { out.push_back(obj.${method}()); continue; }`;
    })
    .join('\n');

  return `// Auto-generated judge harness (op-sequence). Do not edit.
#include <bits/stdc++.h>
#include "json.hpp"
using namespace std;
using json = nlohmann::json;

${userCode}

int main() {
    string line;
    std::getline(std::cin, line);
    json pair = json::parse(line);
    json ops = pair[0];
    json argsList = pair[1];
    ${cfg.className} obj;
    json out = json::array();
    for (size_t i = 0; i < ops.size(); i++) {
        string op = ops[i].get<string>();
        json a = argsList[i];
${cases}
    }
    cout << out.dump() << endl;
    return 0;
}
`;
}

function buildCOpHarness(doorNumber, userCode) {
  const cfg = CONFIG[doorNumber];
  // The C starter stub for these two doors uses a hand-written opaque
  // struct + free functions (minStackCreate/minStackPush/... etc from
  // starterCodeGenerator's MANUAL_OVERRIDES), not a class — dispatch by
  // calling those free functions directly.
  const prefix = doorNumber === 54 ? 'minStack' : 'myQueue';
  const cases = Object.entries(cfg.ops)
    .map(([op, m]) => {
      const fn = `${prefix}${op.charAt(0).toUpperCase()}${op.slice(1)}`;
      if (m.resultKind === 'void') {
        const argExpr = op === 'push' ? ', j_int(a->arr[0])' : '';
        return `        if (strcmp(op, ${JSON.stringify(op)}) == 0) { ${fn}(obj${argExpr}); printf("%snull", i ? "," : ""); continue; }`;
      }
      if (m.resultKind === 'bool') return `        if (strcmp(op, ${JSON.stringify(op)}) == 0) { printf("%s%s", i ? "," : "", ${fn}(obj) ? "true" : "false"); continue; }`;
      return `        if (strcmp(op, ${JSON.stringify(op)}) == 0) { printf("%s%d", i ? "," : "", ${fn}(obj)); continue; }`;
    })
    .join('\n');

  const createFn = `${prefix}Create`;

  return `// Auto-generated judge harness (op-sequence). Do not edit.
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${require('../harnesses/c').C_JSON_LIB}

${userCode}

int main() {
    char* line = NULL;
    size_t cap = 0;
    if (getline(&line, &cap, stdin) < 0) return 1;
    JVal* pair = j_parse(line);
    JVal* opsArr = pair->arr[0];
    JVal* argsArr = pair->arr[1];
    ${cfg.className}* obj = ${createFn}();
    printf("[");
    for (int i = 0; i < opsArr->arrLen; i++) {
        char* op = j_str(opsArr->arr[i]);
        JVal* a = argsArr->arr[i];
${cases}
    }
    printf("]\\n");
    return 0;
}
`;
}

function buildOpSequenceHarness(doorNumber, language, userCode) {
  if (language === 'python') return buildPythonOpHarness(doorNumber, userCode);
  if (language === 'java') return buildJavaOpHarness(doorNumber, userCode);
  if (language === 'cpp') return buildCppOpHarness(doorNumber, userCode);
  if (language === 'c') return buildCOpHarness(doorNumber, userCode);
  return null;
}

module.exports = { buildOpSequenceHarness, CONFIG };
