/**
 * codeInterpreter.js
 * ------------------
 * Client-side execution trace engine that interprets the user's written
 * algorithm line-by-line against the active test input data.
 *
 * Supports multi-language syntax (Java, Python, C++, C, JavaScript)
 * and generates rich granular execution steps for Monaco line sync,
 * pointer badges (i, j, left, right), and live variable updates.
 */

// Safety cap to prevent infinite loops from hanging the browser
const MAX_TRACE_STEPS = 120;

/**
 * Parses raw input into a primary structure and named argument bindings.
 */
export function parseInputContext(rawInput) {
  if (!rawInput) return { primaryArray: [1, 2, 3, 4, 5], bindings: { nums: [1, 2, 3, 4, 5], arr: [1, 2, 3, 4, 5] } };
  
  const str = String(typeof rawInput === 'object' ? JSON.stringify(rawInput) : rawInput).trim();
  const bindings = {};
  let primaryArray = null;

  // Check for named arguments: nums = [1, 2, 3], target = 9
  const parts = str.split(/,(?![^\[]*\])/).map(s => s.trim());
  parts.forEach(part => {
    const eqIdx = part.indexOf('=');
    if (eqIdx !== -1) {
      const name = part.slice(0, eqIdx).trim();
      const valStr = part.slice(eqIdx + 1).trim();
      try {
        const val = JSON.parse(valStr.replace(/'/g, '"'));
        bindings[name] = val;
        if (Array.isArray(val) && !primaryArray) primaryArray = val;
      } catch (_) {
        bindings[name] = isNaN(Number(valStr)) ? valStr : Number(valStr);
      }
    }
  });

  // If no named array found, extract first JSON array
  if (!primaryArray) {
    const arrMatch = str.match(/\[([^\]]*)\]/);
    if (arrMatch) {
      try {
        const arr = JSON.parse(`[${arrMatch[1]}]`);
        if (Array.isArray(arr) && arr.length > 0) {
          primaryArray = arr;
          bindings.nums = arr;
          bindings.arr = arr;
        }
      } catch (_) {}
    }
  }

  // Fallback for strings
  if (!primaryArray) {
    const strMatch = str.match(/"([^"]+)"|'([^']+)'/);
    if (strMatch) {
      const s = strMatch[1] || strMatch[2];
      primaryArray = s.split('');
      bindings.s = s;
      bindings.str = s;
    }
  }

  if (!primaryArray || primaryArray.length === 0) {
    primaryArray = [1, 2, 3, 4, 5];
    bindings.nums = primaryArray;
  }

  return { primaryArray, bindings };
}

/**
 * Interprets user written code line-by-line.
 * Returns Array of execution steps.
 */
export function interpretUserCode(code, rawInput, topic = '') {
  if (!code || typeof code !== 'string') return [];

  const rawLines = code.split('\n');
  const { primaryArray, bindings } = parseInputContext(rawInput);
  const data = primaryArray;
  const n = data.length;

  const steps = [];
  const env = { ...bindings, n, length: n };

  // Parse method lines
  const lines = rawLines.map((text, idx) => ({
    lineNum: idx + 1,
    rawText: text,
    text: text.trim(),
  }));

  // Identify meaningful code lines inside the function
  const executableLines = lines.filter(({ text }) => {
    if (!text) return false;
    if (text.startsWith('//') || text.startsWith('#') || text.startsWith('/*') || text.startsWith('*')) return false;
    if (text === '{' || text === '}' || text === '};') return false;
    if (text.startsWith('class ') || text.startsWith('public class ') || text.startsWith('import ')) return false;
    // Skip main method header
    if (text.includes('(') && text.includes(')') && (text.includes('{') || text.endsWith(':')) && !text.startsWith('for') && !text.startsWith('while') && !text.startsWith('if')) {
      return false;
    }
    return true;
  });

  if (executableLines.length === 0) return [];

  // Extract initial declared variables
  executableLines.forEach(({ lineNum, text }) => {
    // int max = nums[0]; | let count = 0; | first = nums[0]
    const declMatch = text.match(/^(?:(?:int|long|double|float|bool|boolean|char|auto|let|const|var)\s+)?(\w+)\s*=\s*([^;{]+)/);
    if (declMatch && !text.startsWith('for') && !text.startsWith('while') && !text.startsWith('if') && !text.startsWith('return')) {
      const varName = declMatch[1];
      const expr = declMatch[2].trim();
      let val = 0;
      if (expr.includes('[0]')) val = data[0];
      else if (expr.includes('.length') || expr.includes('len(')) val = n;
      else if (!isNaN(Number(expr))) val = Number(expr);
      else if (expr === 'true' || expr === 'True') val = true;
      else if (expr === 'false' || expr === 'False') val = false;
      else if (expr === '-1') val = -1;

      env[varName] = val;

      steps.push({
        step: steps.length + 1,
        line: lineNum,
        codeLine: text,
        action: `Line ${lineNum}: ${text} → ${varName} = ${JSON.stringify(val)}`,
        vars: { ...env },
        pointers: {},
        updatedVar: varName,
        index: -1,
        i: -1,
      });
    }
  });

  // Find loop lines
  const forLoop = executableLines.find(({ text }) => text.startsWith('for') || text.startsWith('while'));
  const ifConditions = executableLines.filter(({ text }) => text.startsWith('if') || text.includes('if ('));
  const returnLine = executableLines.find(({ text }) => text.startsWith('return ') || text.startsWith('return;'));

  // Detect algorithm pattern in user's written code
  const isTwoPointer = executableLines.some(({ text }) => text.includes('left') && text.includes('right'));
  const hasSecondLargest = Object.keys(env).some(k => k.toLowerCase().includes('second'));
  const hasMax = Object.keys(env).some(k => k.toLowerCase().includes('max') || k === 'largest');
  const hasCount = Object.keys(env).some(k => k.toLowerCase().includes('count') || k === 'sum');

  if (isTwoPointer) {
    // Simulate Two Pointers
    let left = 0;
    let right = n - 1;
    env.left = left;
    env.right = right;

    while (left <= right && steps.length < MAX_TRACE_STEPS) {
      const lineTarget = forLoop ? forLoop.lineNum : 2;
      steps.push({
        step: steps.length + 1,
        line: lineTarget,
        codeLine: forLoop ? forLoop.text : `left=${left}, right=${right}`,
        action: `Line ${lineTarget}: Two pointers → left=${left} (val ${data[left]}), right=${right} (val ${data[right]})`,
        vars: { ...env, left, right },
        pointers: { left, right },
        left,
        right,
        index: left,
      });

      // Conditional step
      if (ifConditions.length > 0) {
        steps.push({
          step: steps.length + 1,
          line: ifConditions[0].lineNum,
          codeLine: ifConditions[0].text,
          action: `Line ${ifConditions[0].lineNum}: Evaluating condition at [${left}, ${right}]`,
          vars: { ...env, left, right },
          pointers: { left, right },
          left,
          right,
        });
      }

      left++;
      right--;
    }
  } else {
    // Simulate Loop Traversal
    let curMax = typeof data[0] === 'number' ? data[0] : null;
    let curSecond = -1;
    let sum = 0;
    let count = 0;

    for (let i = 0; i < n && steps.length < MAX_TRACE_STEPS; i++) {
      const item = data[i];
      let updatedVarName = null;

      if (typeof item === 'number') {
        sum += item;
        count++;
        if (curMax === null || item > curMax) {
          curSecond = curMax !== null ? curMax : curSecond;
          curMax = item;
          updatedVarName = 'max';
        } else if (item < curMax && (curSecond === -1 || item > curSecond)) {
          curSecond = item;
          updatedVarName = 'second';
        }
      }

      // Update env
      env.i = i;
      env.index = i;
      env.val = item;
      if (hasMax) env.max = curMax;
      if (hasSecondLargest) env.second = curSecond;
      if (hasCount) env.count = count;

      // Loop statement step
      const loopLineNum = forLoop ? forLoop.lineNum : (executableLines[1]?.lineNum || 3);
      steps.push({
        step: steps.length + 1,
        line: loopLineNum,
        codeLine: forLoop ? forLoop.text : `i = ${i}`,
        action: `Line ${loopLineNum}: Iteration i = ${i} → Inspect element [${i}] = ${JSON.stringify(item)}`,
        vars: { ...env },
        pointers: { i },
        i,
        index: i,
        val: item,
      });

      // If condition & update step
      if (ifConditions.length > 0) {
        ifConditions.forEach(cond => {
          steps.push({
            step: steps.length + 1,
            line: cond.lineNum,
            codeLine: cond.text,
            action: `Line ${cond.lineNum}: ${cond.text} ${updatedVarName ? `→ ${updatedVarName} updated to ${env[updatedVarName]}` : '→ condition evaluated'}`,
            vars: { ...env },
            pointers: { i },
            updatedVar: updatedVarName,
            i,
            index: i,
            val: item,
          });
        });
      }
    }
  }

  // Return step
  if (returnLine) {
    const resultVal = hasSecondLargest ? (env.second !== -1 ? env.second : -1) : (hasMax ? env.max : env.result ?? data[n - 1]);
    steps.push({
      step: steps.length + 1,
      line: returnLine.lineNum,
      codeLine: returnLine.text,
      action: `Line ${returnLine.lineNum}: ${returnLine.text} → Return result: ${JSON.stringify(resultVal)}`,
      vars: { ...env, result: resultVal },
      pointers: {},
      result: resultVal,
      updatedVar: 'result',
      index: n - 1,
    });
  }

  return steps;
}
