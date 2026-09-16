function preprocessBraceCode(code) {
  let result = '';
  let inStr = false;
  let strChar = '';
  let parenDepth = 0;
  let inForHeader = 0;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1] || '';
    const prev = i > 0 ? code[i - 1] : '';

    if (inLineComment) {
      result += ch;
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      result += ch;
      if (prev === '*' && ch === '/') inBlockComment = false;
      continue;
    }
    if (inStr) {
      result += ch;
      if (ch === strChar && prev !== '\\') inStr = false;
      continue;
    }

    if (ch === '/' && next === '/') {
      inLineComment = true;
      result += ch;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      result += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = true;
      strChar = ch;
      result += ch;
      continue;
    }

    if (ch === '(') {
      const preceding = result.trimEnd();
      if (/\bfor\s*$/.test(preceding) || inForHeader > 0) {
        inForHeader++;
      }
      parenDepth++;
      result += ch;
      continue;
    }
    if (ch === ')') {
      if (inForHeader > 0) inForHeader--;
      if (parenDepth > 0) parenDepth--;
      result += ch;
      continue;
    }

    if (ch === ':' && /^(public|private|protected)$/.test(result.trimEnd().split(/[\s\n]+/).pop())) {
      result = result.trimEnd() + ':\n';
      continue;
    }
    if (ch === '{') {
      result = result.trimEnd() + ' {\n';
      continue;
    }

    if (ch === '}') {
      result = result.trimEnd() + '\n}\n';
      continue;
    }
    if (ch === ';' && inForHeader === 0) {
      result = result.trimEnd() + ';\n';
      continue;
    }


    result += ch;
  }
  return result;
}

function formatBraceLanguage(sourceCode) {
  const preprocessed = preprocessBraceCode(sourceCode);
  const lines = preprocessed.split('\n');
  let indentLevel = 0;
  const indentStr = '    ';
  const formatted = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    let line = rawLine.trim();

    if (!line) {
      if (formatted.length > 0 && formatted[formatted.length - 1] !== '') {
        formatted.push('');
      }
      continue;
    }

    // Adjust indent if line starts with closing brace
    const startsWithClose = /^(\}|\]|\))/.test(line);
    if (startsWithClose) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    let lineIndent = indentLevel;
    if (/^(public|private|protected)\s*:/.test(line)) {
      lineIndent = Math.max(0, indentLevel - 1);
    } else if (/^(case\s+[^:]+|default)\s*:/.test(line)) {
      lineIndent = Math.max(0, indentLevel - 1);
    }

    formatted.push(indentStr.repeat(lineIndent) + line);

    // Count open vs close in this line
    let openCount = 0;
    let closeCount = 0;
    let inS = false;
    let sChar = '';

    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      const pr = c > 0 ? line[c - 1] : '';
      if ((ch === '"' || ch === "'") && pr !== '\\') {
        if (!inS) { inS = true; sChar = ch; }
        else if (ch === sChar) { inS = false; }
      } else if (!inS) {
        if (ch === '/' && line[c + 1] === '/') break;
        if (ch === '{') openCount++;
        if (ch === '}') closeCount++;
      }
    }

    if (!startsWithClose) {
      indentLevel = Math.max(0, indentLevel + openCount - closeCount);
    } else {
      indentLevel = Math.max(0, indentLevel + openCount - (closeCount - 1));
    }
  }

  return formatted.join('\n').trim() + '\n';
}

const rawCode = 'class Solution { public: int maxElement(vector<int>& nums) { int m = nums[0]; for (int i = 0; i < nums.size(); i++) { if (nums[i] > m) m = nums[i]; } return m; } };';
console.log('--- FORMATTED ---');
console.log(formatBraceLanguage(rawCode));
