const { getCFunctionSignature, parseJavaSignature } = require('../../seed/starterCodeGenerator');

/**
 * Minimal hand-rolled JSON reader/writer for C, restricted to the grammar
 * our canonical test format actually needs: null, true/false, numbers,
 * double-quoted strings, and arrays (never objects). Produces a small
 * tagged union (`JVal`) tree, mirroring the Java/C++ harnesses.
 */
const C_JSON_LIB = `
typedef enum { J_NULL, J_BOOL, J_NUM, J_STR, J_ARR } JType;
typedef struct JVal {
    JType type;
    double num;
    char* str;
    struct JVal** arr;
    int arrLen;
} JVal;

static char* _j_input;
static int _j_pos;

static void _j_skip_ws() { while (_j_input[_j_pos] == ' ' || _j_input[_j_pos] == '\\t' || _j_input[_j_pos] == '\\n' || _j_input[_j_pos] == '\\r') _j_pos++; }

static JVal* _j_parse_value();

static JVal* _j_new(JType t) {
    JVal* v = (JVal*)malloc(sizeof(JVal));
    v->type = t; v->num = 0; v->str = NULL; v->arr = NULL; v->arrLen = 0;
    return v;
}

static JVal* _j_parse_array() {
    JVal* v = _j_new(J_ARR);
    int cap = 8;
    v->arr = (JVal**)malloc(sizeof(JVal*) * cap);
    v->arrLen = 0;
    _j_pos++; // [
    _j_skip_ws();
    if (_j_input[_j_pos] == ']') { _j_pos++; return v; }
    while (1) {
        if (v->arrLen >= cap) { cap *= 2; v->arr = (JVal**)realloc(v->arr, sizeof(JVal*) * cap); }
        v->arr[v->arrLen++] = _j_parse_value();
        _j_skip_ws();
        if (_j_input[_j_pos] == ',') { _j_pos++; continue; }
        if (_j_input[_j_pos] == ']') { _j_pos++; break; }
        break;
    }
    return v;
}

static JVal* _j_parse_string() {
    JVal* v = _j_new(J_STR);
    _j_pos++; // opening quote
    int cap = 32, len = 0;
    char* buf = (char*)malloc(cap);
    while (_j_input[_j_pos] != '"') {
        char c = _j_input[_j_pos];
        if (c == '\\\\') {
            _j_pos++;
            char esc = _j_input[_j_pos];
            if (esc == 'n') c = '\\n';
            else if (esc == 't') c = '\\t';
            else if (esc == 'r') c = '\\r';
            else c = esc;
        }
        if (len + 1 >= cap) { cap *= 2; buf = (char*)realloc(buf, cap); }
        buf[len++] = c;
        _j_pos++;
    }
    _j_pos++; // closing quote
    buf[len] = '\\0';
    v->str = buf;
    return v;
}

static JVal* _j_parse_value() {
    _j_skip_ws();
    char c = _j_input[_j_pos];
    if (c == '[') return _j_parse_array();
    if (c == '"') return _j_parse_string();
    if (c == 't') { _j_pos += 4; JVal* v = _j_new(J_BOOL); v->num = 1; return v; }
    if (c == 'f') { _j_pos += 5; JVal* v = _j_new(J_BOOL); v->num = 0; return v; }
    if (c == 'n') { _j_pos += 4; return _j_new(J_NULL); }
    int start = _j_pos;
    while (_j_input[_j_pos] == '-' || _j_input[_j_pos] == '+' || _j_input[_j_pos] == '.' ||
           _j_input[_j_pos] == 'e' || _j_input[_j_pos] == 'E' || (_j_input[_j_pos] >= '0' && _j_input[_j_pos] <= '9')) _j_pos++;
    char tmp[64];
    int n = _j_pos - start; if (n > 63) n = 63;
    memcpy(tmp, _j_input + start, n);
    tmp[n] = '\\0';
    JVal* v = _j_new(J_NUM);
    v->num = atof(tmp);
    return v;
}

static JVal* j_parse(char* text) {
    _j_input = text;
    _j_pos = 0;
    return _j_parse_value();
}

static int j_int(JVal* v) { return (int)(v->num + (v->num >= 0 ? 0.5 : -0.5)); }
static double j_double(JVal* v) { return v->num; }
static int j_bool(JVal* v) { return v->num != 0; }
static char* j_str(JVal* v) { return v->str; }

static int* j_int_arr(JVal* v, int* outSize) {
    int* out = (int*)malloc(sizeof(int) * (v->arrLen > 0 ? v->arrLen : 1));
    for (int i = 0; i < v->arrLen; i++) out[i] = j_int(v->arr[i]);
    *outSize = v->arrLen;
    return out;
}
static int** j_int_arr2(JVal* v, int* outSize, int** outColSizes) {
    int** out = (int**)malloc(sizeof(int*) * (v->arrLen > 0 ? v->arrLen : 1));
    int* colSizes = (int*)malloc(sizeof(int) * (v->arrLen > 0 ? v->arrLen : 1));
    for (int i = 0; i < v->arrLen; i++) out[i] = j_int_arr(v->arr[i], &colSizes[i]);
    *outSize = v->arrLen;
    *outColSizes = colSizes;
    return out;
}
static char** j_str_arr(JVal* v, int* outSize) {
    char** out = (char**)malloc(sizeof(char*) * (v->arrLen > 0 ? v->arrLen : 1));
    for (int i = 0; i < v->arrLen; i++) out[i] = j_str(v->arr[i]);
    *outSize = v->arrLen;
    return out;
}
static char** j_char_arr2_as_strs(JVal* v, int* outSize) {
    // char[][] boards are represented in JSON as an array of one-char-per-cell
    // strings ("X") OR an array of row strings ("XOX"); we accept row strings.
    return j_str_arr(v, outSize);
}

typedef struct ListNode { int val; struct ListNode* next; } ListNode;
typedef struct TreeNode { int val; struct TreeNode* left; struct TreeNode* right; } TreeNode;

static ListNode* j_build_listnode(JVal* v) {
    ListNode dummy; dummy.next = NULL;
    ListNode* cur = &dummy;
    for (int i = 0; i < v->arrLen; i++) {
        ListNode* n = (ListNode*)malloc(sizeof(ListNode));
        n->val = j_int(v->arr[i]); n->next = NULL;
        cur->next = n; cur = n;
    }
    return dummy.next;
}
static ListNode** j_build_listnode_arr(JVal* v, int* outSize) {
    ListNode** out = (ListNode**)malloc(sizeof(ListNode*) * (v->arrLen > 0 ? v->arrLen : 1));
    for (int i = 0; i < v->arrLen; i++) out[i] = j_build_listnode(v->arr[i]);
    *outSize = v->arrLen;
    return out;
}
static TreeNode* j_build_treenode(JVal* v) {
    if (v->arrLen == 0 || v->arr[0]->type == J_NULL) return NULL;
    TreeNode* root = (TreeNode*)malloc(sizeof(TreeNode));
    root->val = j_int(v->arr[0]); root->left = NULL; root->right = NULL;
    TreeNode** queue = (TreeNode**)malloc(sizeof(TreeNode*) * (v->arrLen + 1));
    int qh = 0, qt = 0;
    queue[qt++] = root;
    int i = 1;
    while (qh < qt && i < v->arrLen) {
        TreeNode* node = queue[qh++];
        if (i < v->arrLen) {
            if (v->arr[i]->type != J_NULL) {
                TreeNode* left = (TreeNode*)malloc(sizeof(TreeNode));
                left->val = j_int(v->arr[i]); left->left = NULL; left->right = NULL;
                node->left = left; queue[qt++] = left;
            }
            i++;
        }
        if (i < v->arrLen) {
            if (v->arr[i]->type != J_NULL) {
                TreeNode* right = (TreeNode*)malloc(sizeof(TreeNode));
                right->val = j_int(v->arr[i]); right->left = NULL; right->right = NULL;
                node->right = right; queue[qt++] = right;
            }
            i++;
        }
    }
    free(queue);
    return root;
}
static TreeNode* j_find_by_value(TreeNode* root, int val) {
    if (!root) return NULL;
    TreeNode* queue[200000];
    int qh = 0, qt = 0;
    queue[qt++] = root;
    while (qh < qt) {
        TreeNode* node = queue[qh++];
        if (!node) continue;
        if (node->val == val) return node;
        queue[qt++] = node->left;
        queue[qt++] = node->right;
    }
    return NULL;
}

// ---------- Output printers (native -> stdout JSON text) ----------
static void p_int(int v) { printf("%d", v); }
static void p_double(double v) {
    if (v == (long long)v) printf("%lld", (long long)v);
    else printf("%g", v);
}
static void p_bool(int v) { printf(v ? "true" : "false"); }
static void p_str(const char* s) {
    if (!s) { printf("null"); return; }
    printf("\\"");
    for (const char* c = s; *c; c++) {
        if (*c == '"' || *c == '\\\\') printf("\\\\");
        printf("%c", *c);
    }
    printf("\\"");
}
static void p_int_arr(int* arr, int n) {
    printf("[");
    for (int i = 0; i < n; i++) { if (i) printf(","); p_int(arr[i]); }
    printf("]");
}
static void p_int_arr2(int** arr, int n, int* colSizes) {
    printf("[");
    for (int i = 0; i < n; i++) { if (i) printf(","); p_int_arr(arr[i], colSizes[i]); }
    printf("]");
}
static void p_str_arr(char** arr, int n) {
    printf("[");
    for (int i = 0; i < n; i++) { if (i) printf(","); p_str(arr[i]); }
    printf("]");
}
static void p_str_arr2(char*** arr, int n, int* colSizes) {
    printf("[");
    for (int i = 0; i < n; i++) { if (i) printf(","); p_str_arr(arr[i], colSizes[i]); }
    printf("]");
}
static void p_listnode(ListNode* node) {
    printf("[");
    int first = 1, guard = 0;
    while (node && guard < 200000) {
        if (!first) printf(","); first = 0;
        p_int(node->val);
        node = node->next;
        guard++;
    }
    printf("]");
}
static void p_treenode(TreeNode* root) {
    if (!root) { printf("[]"); return; }
    TreeNode* queue[200000];
    int isNull[200000];
    int qh = 0, qt = 0;
    queue[qt] = root; isNull[qt] = 0; qt++;
    int outVals[200000], outIsNull[200000], outLen = 0;
    while (qh < qt) {
        TreeNode* node = queue[qh]; int wasNull = isNull[qh]; qh++;
        if (wasNull || node == NULL) { outIsNull[outLen] = 1; outLen++; continue; }
        outVals[outLen] = node->val; outIsNull[outLen] = 0; outLen++;
        if (node->left) { queue[qt] = node->left; isNull[qt] = 0; qt++; } else { queue[qt] = NULL; isNull[qt] = 1; qt++; }
        if (node->right) { queue[qt] = node->right; isNull[qt] = 0; qt++; } else { queue[qt] = NULL; isNull[qt] = 1; qt++; }
    }
    while (outLen > 0 && outIsNull[outLen - 1]) outLen--;
    printf("[");
    for (int i = 0; i < outLen; i++) {
        if (i) printf(",");
        if (outIsNull[i]) printf("null"); else p_int(outVals[i]);
    }
    printf("]");
}
`;

/** C variable-declaration type text for a classified param (mirrors starterCodeGenerator's C conventions). */
function cDeclType(kind, arrayDepth, cBaseType) {
  if (arrayDepth === 0) return null; // scalar, handled separately
  return `${cBaseType}${'*'.repeat(arrayDepth)}`;
}

function buildCHarness(userCode, classified, javaSourceForCSig) {
  // Re-derive the exact LeetCode-style C signature (param/return out-params)
  // from the same Java source, so the harness calls precisely what the
  // starter code (and therefore the user's submission) declares.
  const sig = parseJavaSignature(javaSourceForCSig);
  const cSig = getCFunctionSignature(sig);

  const firstTreeParam = classified.params.find((p) => p.kind === 'treenode' && !p.isTreeRef);
  const firstTreeVarName = firstTreeParam ? `arg${classified.params.indexOf(firstTreeParam)}` : null;

  const declLines = [];
  const callArgs = [];

  classified.params.forEach((p, idx) => {
    const rawVar = `_raw${idx}`;
    const argVar = `arg${idx}`;
    declLines.push(`    JVal* ${rawVar} = _args->arr[${idx}];`);

    if (p.kind === 'listnode') {
      if (p.depth === 1) {
        declLines.push(`    int ${argVar}Size;`);
        declLines.push(`    ListNode** ${argVar} = j_build_listnode_arr(${rawVar}, &${argVar}Size);`);
        callArgs.push(argVar, `${argVar}Size`);
      } else {
        declLines.push(`    ListNode* ${argVar} = j_build_listnode(${rawVar});`);
        callArgs.push(argVar);
      }
      return;
    }
    if (p.kind === 'treenode') {
      if (p.isTreeRef) {
        declLines.push(`    TreeNode* ${argVar} = j_find_by_value(${firstTreeVarName}, j_int(${rawVar}));`);
      } else {
        declLines.push(`    TreeNode* ${argVar} = j_build_treenode(${rawVar});`);
      }
      callArgs.push(argVar);
      return;
    }

    const cParam = cSig.params[idx];
    if (cParam.arrayDepth === 0) {
      const scalarFn = { int: 'j_int', long: 'j_int', double: 'j_double', float: 'j_double', boolean: 'j_bool', char: 'j_str', string: 'j_str' }[p.kind];
      declLines.push(`    ${cParam.cType} ${argVar} = ${scalarFn === 'j_str' && p.kind === 'char' ? `j_str(${rawVar})[0]` : `${scalarFn}(${rawVar})`};`);
      callArgs.push(argVar);
    } else if (cParam.arrayDepth === 1) {
      declLines.push(`    int ${argVar}Size;`);
      if (p.kind === 'string' || p.kind === 'char') {
        declLines.push(`    char** ${argVar} = j_str_arr(${rawVar}, &${argVar}Size);`);
      } else {
        declLines.push(`    int* ${argVar} = j_int_arr(${rawVar}, &${argVar}Size);`);
      }
      callArgs.push(argVar, `${argVar}Size`);
    } else {
      // depth 2: int[][] or char[][]
      declLines.push(`    int ${argVar}Size;`);
      declLines.push(`    int* ${argVar}ColSize;`);
      declLines.push(`    int** ${argVar} = j_int_arr2(${rawVar}, &${argVar}Size, &${argVar}ColSize);`);
      callArgs.push(argVar, `${argVar}Size`, `${argVar}ColSize`);
    }
  });

  // Return-side out params (returnSize / returnColumnSizes)
  const returnOutDecls = [];
  const returnOutArgs = [];
  if (cSig.returnOutParams.length) {
    returnOutDecls.push('    int _returnSize = 0;');
    returnOutArgs.push('&_returnSize');
    if (cSig.returnOutParams.length === 2) {
      returnOutDecls.push('    int* _returnColSize = NULL;');
      returnOutArgs.push('&_returnColSize');
    }
  }

  const allCallArgs = [...callArgs, ...returnOutArgs].join(', ');

  let printStmt;
  const rt = classified.returnType;
  if (rt.kind === 'void') {
    const p0 = classified.params[0];
    if (p0 && p0.kind === 'listnode') {
      printStmt = `    ${sig.methodName}(${allCallArgs});\n    p_listnode(_p0);\n    printf("\\n");`;
    } else if (p0 && p0.depth === 1) {
      if (p0.kind === 'string' || p0.kind === 'char') {
        printStmt = `    ${sig.methodName}(${allCallArgs});\n    p_str_arr(_p0, _p0Size);\n    printf("\\n");`;
      } else {
        printStmt = `    ${sig.methodName}(${allCallArgs});\n    p_int_arr(_p0, _p0Size);\n    printf("\\n");`;
      }
    } else if (p0 && p0.depth === 2) {
      printStmt = `    ${sig.methodName}(${allCallArgs});\n    p_int_arr2(_p0, _p0Size, _p0ColSize);\n    printf("\\n");`;
    } else {
      printStmt = `    ${sig.methodName}(${allCallArgs});\n    printf("null\\n");`;
    }
  } else if (rt.kind === 'listnode') {
    printStmt = rt.depth === 1
      ? `    // ListNode[] returns not present in this problem set; falls back to null.\n    ${cSig.cReturnType} _result = ${sig.methodName}(${allCallArgs});\n    printf("null\\n");`
      : `    ${cSig.cReturnType} _result = ${sig.methodName}(${allCallArgs});\n    p_listnode(_result);\n    printf("\\n");`;
  } else if (rt.kind === 'treenode') {
    printStmt = `    ${cSig.cReturnType} _result = ${sig.methodName}(${allCallArgs});\n    p_treenode(_result);\n    printf("\\n");`;
  } else if (cSig.returnArrayDepth === 0) {
    const printFn = { int: 'p_int', long: 'p_int', double: 'p_double', float: 'p_double', boolean: 'p_bool', char: 'p_str', string: 'p_str' }[rt.kind];
    const call = `${sig.methodName}(${allCallArgs})`;
    printStmt = rt.kind === 'char'
      ? `    char _resultBuf[2] = { ${call}, 0 };\n    p_str(_resultBuf);\n    printf("\\n");`
      : `    ${cSig.cReturnType} _result = ${call};\n    ${printFn}(_result);\n    printf("\\n");`;
  } else if (cSig.returnArrayDepth === 1) {
    const printFn = cSig.returnBaseType === 'char*' ? 'p_str_arr' : 'p_int_arr';
    printStmt = `    ${cSig.cReturnType} _result = ${sig.methodName}(${allCallArgs});\n    ${printFn}(_result, _returnSize);\n    printf("\\n");`;
  } else {
    const printFn = cSig.returnBaseType === 'char*' ? 'p_str_arr2' : 'p_int_arr2';
    printStmt = `    ${cSig.cReturnType} _result = ${sig.methodName}(${allCallArgs});\n    ${printFn}(_result, _returnSize, _returnColSize);\n    printf("\\n");`;
  }

  return `// Auto-generated judge harness. Do not edit.
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

${C_JSON_LIB}

${userCode}

int main() {
    char* line = NULL;
    size_t cap = 0;
    ssize_t len = getline(&line, &cap, stdin);
    if (len < 0) { return 1; }
    JVal* _args = j_parse(line);
${declLines.join('\n')}
${returnOutDecls.join('\n')}
${printStmt}
    return 0;
}
`;
}

module.exports = { buildCHarness, C_JSON_LIB };
