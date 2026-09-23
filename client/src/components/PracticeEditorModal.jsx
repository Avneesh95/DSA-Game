import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  X, Code2, ExternalLink, Check, ChevronDown, ChevronLeft, ChevronRight,
  RotateCcw, Maximize2, Minimize2, Save, Wand2, Lightbulb, BookOpen,
  FileText, Zap, Sparkles, CheckCircle2, ShieldAlert, Cpu, Layers, Bug,
  Play, RefreshCw, Terminal,
} from 'lucide-react';
import useThemeStore from '../store/useThemeStore';
import { formatCode } from '../utils/algorithmSteps';
import StepVisualizer from '../visualizers/StepVisualizer';

/* ── Starter code templates per language ── */
const STARTER_TEMPLATES = {
  java: (title, pattern) => `/**
 * Problem: ${title}
 * Pattern: ${pattern || 'Data Structures & Algorithms'}
 */

class Solution {
    // Write your optimal solution below
    public void solve() {
        // TODO: Implement solution
    }
}
`,

  python: (title, pattern) => `"""
Problem: ${title}
Pattern: ${pattern || 'Data Structures & Algorithms'}
"""

class Solution:
    def solve(self):
        # TODO: Implement solution
        pass
`,

  cpp: (title, pattern) => `/**
 * Problem: ${title}
 * Pattern: ${pattern || 'Data Structures & Algorithms'}
 */

#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void solve() {
        // TODO: Implement solution
    }
};
`,

  javascript: (title, pattern) => `/**
 * Problem: ${title}
 * Pattern: ${pattern || 'Data Structures & Algorithms'}
 */

/**
 * @return {any}
 */
function solve() {
    // TODO: Implement solution
}
`,
};

const LANG_CONFIG = [
  { id: 'java', label: 'Java', icon: '☕', monaco: 'java' },
  { id: 'python', label: 'Python', icon: '🐍', monaco: 'python' },
  { id: 'cpp', label: 'C++', icon: '⚡', monaco: 'cpp' },
  { id: 'javascript', label: 'JavaScript', icon: '🟨', monaco: 'javascript' },
];

/* ── Pattern heuristic blueprints & tips ── */
const PATTERN_KNOWLEDGE = {
  'two pointer': {
    time: 'O(N)',
    space: 'O(1)',
    concept: 'Maintain two indices moving towards each other or at varying speeds to eliminate O(N²) quadratic nested loops into a single linear O(N) pass.',
    tips: ['Ensure array is sorted or monotonically ordered before converging.', 'Watch for boundary crossing condition: left < right vs left <= right.'],
    exampleInput: 'nums = [2, 7, 11, 15], target = 9',
    steps: [
      'Initialize pointers (left = 0, right = n - 1).',
      'Evaluate condition between elements at left and right.',
      'Adjust pointers inward based on comparison with target.',
      'Return matching indices, accumulated result, or in-place length.',
    ],
  },
  'sliding window': {
    time: 'O(N)',
    space: 'O(K) / O(1)',
    concept: 'Expand a right pointer to include elements in the window, and contract the left pointer when constraints are violated.',
    tips: ['Maintain a frequency map or running sum of current window.', 'Shrink window only while constraint is violated.'],
    exampleInput: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
    steps: [
      'Initialize left = 0, right = 0, and running state tracker.',
      'Expand window by processing nums[right].',
      'While window state is invalid, shrink from left and update state.',
      'Record optimal answer (max/min window length or valid count).',
    ],
  },
  'stack': {
    time: 'O(N)',
    space: 'O(N)',
    concept: 'Use LIFO ordering or monotonic stacks to find next greater/smaller elements and parse nested expressions in O(1) amortized time.',
    tips: ['Monotonic decreasing stack finds Next Greater Element.', 'Remember to check stack.isEmpty() before calling pop/peek.'],
    exampleInput: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]',
    steps: [
      'Initialize stack data structure.',
      'Iterate through elements from left to right.',
      'Pop elements that violate monotonic invariant.',
      'Push current element/index onto stack.',
    ],
  },
  'binary search': {
    time: 'O(log N)',
    space: 'O(1)',
    concept: 'Halve the search space at every step when monotonic ordering or a predicate function exists.',
    tips: ['Calculate mid as low + (high - low) / 2 to prevent integer overflow.', 'Check whether search space is discrete values or answer space.'],
    exampleInput: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
    steps: [
      'Set bounds low = 0, high = n - 1.',
      'While low <= high, compute midpoint.',
      'If condition met, discard half of search range.',
      'Return index or binary search boundary answer.',
    ],
  },
  'dynamic programming': {
    time: 'O(N) / O(N*M)',
    space: 'O(N) / O(1)',
    concept: 'Break problem into overlapping subproblems with optimal substructure; memoize or tabulate state transitions.',
    tips: ['Identify base cases (e.g. dp[0], empty string, single item).', 'Check if space can be optimized from O(N) to O(1) by keeping last 2 variables.'],
    exampleInput: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]',
    steps: [
      'Define state: what does dp[i] represent?',
      'Establish base cases.',
      'Formulate recurrence relation: dp[i] = fn(dp[i-1], ...).',
      'Iterate and return target state dp[target].',
    ],
  },
  'tree': {
    time: 'O(N)',
    space: 'O(H)',
    concept: 'Traverse hierarchical nodes using DFS (preorder, inorder, postorder) or BFS level-order traversal with a queue.',
    tips: ['Base case: if (node == null) return appropriate neutral value (0, true, null).', 'Postorder traversal is ideal when parent needs child subtree results.'],
    exampleInput: 'root = [3, 9, 20, null, null, 15, 7]',
    steps: [
      'Check base case for null node.',
      'Recursively compute left subtree and right subtree.',
      'Combine results at current root node.',
      'Return combined subtree state to caller.',
    ],
  },
  'graph': {
    time: 'O(V + E)',
    space: 'O(V)',
    concept: 'Model vertices and edges. Use BFS for shortest path in unweighted graphs and DFS for cycle detection, topological sort, and connectivity.',
    tips: ['Always track visited nodes to avoid infinite cycles.', 'Topological sort uses Kahn algorithm (indegrees) or post-order DFS.'],
    exampleInput: 'numCourses = 2, prerequisites = [[1, 0]]',
    steps: [
      'Build adjacency list from input edge list.',
      'Initialize visited set and queue/stack.',
      'Traverse unvisited neighbors.',
      'Accumulate path, count connected components, or detect cycles.',
    ],
  },
  'default': {
    time: 'O(N) / O(N log N)',
    space: 'O(1) / O(N)',
    concept: 'Analyze constraints, identify subproblems, and choose appropriate data structures (Hash Map, Priority Queue, or Pointers).',
    tips: ['Check edge cases: empty input, duplicates, large bounds.', 'Always verify time and space complexity against problem limits.'],
    exampleInput: 'nums = [1, 2, 3, 4, 5]',
    steps: [
      'Clarify input types, boundaries, and expected return value.',
      'Identify the best-fitting data structure for optimal lookup/traversal.',
      'Draft step-by-step logic before writing code.',
      'Dry run with sample test cases and edge cases.',
    ],
  },
};

function getPatternInfo(pattern = '', topic = '', category = '') {
  const combined = `${pattern || ''} ${topic || ''} ${category || ''}`.toLowerCase();
  for (const [key, val] of Object.entries(PATTERN_KNOWLEDGE)) {
    if (key !== 'default' && combined.includes(key)) {
      return { key, ...val };
    }
  }
  return { key: 'General DSA', ...PATTERN_KNOWLEDGE.default };
}

/**
 * Enhanced PracticeEditorModal
 * Full-screen IDE Solving Page for NeetCode, Amazon, and Striver practice sheets.
 */
export default function PracticeEditorModal({
  problem,
  onClose,
  onMarkDone,
  isSolved = false,
  storagePrefix = 'sheet',
  sheetTitle = 'Practice Sheet',
  onPrevProblem,
  onNextProblem,
  hasPrev = false,
  hasNext = false,
}) {
  if (!problem) return null;

  const isLight = useThemeStore((s) => s.theme) === 'light';
  const editorRef = useRef(null);
  const decorationsRef = useRef(null);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'blueprint' | 'debugger' | 'notes'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dsa100_practice_lang') || 'java';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [formatSuccess, setFormatSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const [lineCount, setLineCount] = useState(1);

  const problemId = problem?.id || 'p-1';
  const problemTitle = problem?.title || 'Coding Problem';
  const patternName = problem?.pattern || problem?.topic || problem?.category || 'DSA Algorithm';
  const patternInfo = useMemo(() => getPatternInfo(problem?.pattern, problem?.topic, problem?.category), [problem]);

  // Storage keys
  const codeKey = `dsa100_${storagePrefix}_code_${problemId}_${language}`;
  const notesKey = `dsa100_${storagePrefix}_notes_${problemId}`;

  const [code, setCode] = useState(() => {
    return localStorage.getItem(codeKey) || (STARTER_TEMPLATES[language] || STARTER_TEMPLATES.java)(problemTitle, patternName);
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(notesKey) || '';
  });

  // Sync code on problem or language change
  useEffect(() => {
    const saved = localStorage.getItem(codeKey);
    const fallback = (STARTER_TEMPLATES[language] || STARTER_TEMPLATES.java)(problemTitle, patternName);
    setCode(saved || fallback);
  }, [language, problemId, codeKey, problemTitle, patternName]);

  // Sync notes on problem change
  useEffect(() => {
    setNotes(localStorage.getItem(notesKey) || '');
  }, [problemId, notesKey]);

  // Save notes to localStorage
  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(notesKey, val);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    setLineCount(editor.getModel()?.getLineCount() || 1);

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
    editor.onDidChangeModelContent(() => {
      setLineCount(editor.getModel()?.getLineCount() || 1);
    });

    if (monaco && monaco.languages) {
      ['cpp', 'c', 'java', 'python', 'javascript'].forEach((l) => {
        try {
          monaco.languages.registerDocumentFormattingEditProvider(l, {
            provideDocumentFormattingEdits(model) {
              const text = model.getValue();
              const formatted = formatCode(text, l);
              return [
                {
                  range: model.getFullModelRange(),
                  text: formatted || text,
                },
              ];
            },
          });
        } catch (_) {}
      });
    }
  }, []);

  const handleSave = useCallback(() => {
    const val = editorRef.current ? editorRef.current.getValue() : code;
    localStorage.setItem(codeKey, val);
    setCode(val);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1800);
  }, [code, codeKey]);

  const handleReset = useCallback(() => {
    const fresh = (STARTER_TEMPLATES[language] || STARTER_TEMPLATES.java)(problemTitle, patternName);
    setCode(fresh);
    if (editorRef.current) editorRef.current.setValue(fresh);
    localStorage.removeItem(codeKey);
  }, [language, problemTitle, patternName, codeKey]);

  const handleFormat = useCallback(() => {
    const editor = editorRef.current;
    const currentVal = editor ? editor.getValue() : code;
    if (!currentVal) return;

    try {
      const formatted = formatCode(currentVal, language);
      if (formatted) {
        setCode(formatted);
        if (editor) {
          const model = editor.getModel();
          if (model) {
            editor.pushUndoStop();
            editor.executeEdits('codeFormatter', [
              { range: model.getFullModelRange(), text: formatted, forceMoveMarkers: true },
            ]);
            editor.pushUndoStop();
          } else {
            editor.setValue(formatted);
          }
        }
        setFormatSuccess(true);
        setTimeout(() => setFormatSuccess(false), 1800);
      }
    } catch (_) {
      editor?.getAction('editor.action.formatDocument')?.run();
    }
  }, [code, language]);

  const handleLineChange = useCallback((lineNum) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;
    const validLine = Math.min(Math.max(1, lineNum), model.getLineCount());
    editor.revealLineInCenter(validLine);
    if (decorationsRef.current) {
      decorationsRef.current.clear();
    }
  }, []);

  const handleLangChange = (lang) => {
    const val = editorRef.current ? editorRef.current.getValue() : code;
    localStorage.setItem(codeKey, val);
    setLanguage(lang);
    localStorage.setItem('dsa100_practice_lang', lang);
    setShowLangMenu(false);
  };

  const leetUrl = problem.leetcodeUrl || problem.leetcode || `https://leetcode.com/problemset/all/?search=${encodeURIComponent(problemTitle)}`;

  const diffColors = {
    easy: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    medium: isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    hard: isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-950/60 text-rose-300 border-rose-500/40',
  };
  const diffKey = (problem.difficulty || 'medium').toLowerCase();
  const currentLangObj = LANG_CONFIG.find((l) => l.id === language) || LANG_CONFIG[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-3 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`flex flex-col w-full h-[98vh] sm:h-[96vh] max-w-[98vw] rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#121214] border-white/10'
          }`}
        >
          {/* ── TOP HEADER BAR ── */}
          <header className={`px-4 py-2.5 border-b shrink-0 flex items-center justify-between gap-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#18181b] border-white/10'
          }`}>
            {/* Left: Title & Badges */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-violet-600/15 flex items-center justify-center shrink-0 text-violet-500 border border-violet-500/20">
                <Code2 size={17} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-500">
                    {sheetTitle}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold capitalize ${diffColors[diffKey] || diffColors.medium}`}>
                    {problem.difficulty || 'Medium'}
                  </span>
                  {patternName && (
                    <span className={`hidden md:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {patternName}
                    </span>
                  )}
                </div>

                <h1 className="font-display font-bold text-sm sm:text-base leading-snug truncate max-w-[240px] sm:max-w-md md:max-w-xl text-slate-900 dark:text-slate-100">
                  {problemTitle}
                </h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* LeetCode Official Link Button */}
              <a
                href={leetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all shadow-sm bg-[#ff9500]/10 border-[#ff9500]/40 text-[#ff9500] hover:bg-[#ff9500] hover:text-black group"
                title="Open this exact problem on LeetCode in a new tab"
              >
                <span>Solve on LeetCode</span>
                <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Prev / Next Problem Navigation */}
              {(onPrevProblem || onNextProblem) && (
                <div className="hidden lg:flex items-center bg-black/5 dark:bg-white/5 p-0.5 rounded-xl border border-black/5 dark:border-white/10">
                  <button
                    disabled={!hasPrev}
                    onClick={onPrevProblem}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    title="Previous Problem in Sheet"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    disabled={!hasNext}
                    onClick={onNextProblem}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    title="Next Problem in Sheet"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}

              {/* Mark Solved / Done Button */}
              <button
                onClick={() => onMarkDone(problemId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all shadow-sm ${
                  isSolved
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20'
                    : isLight
                    ? 'border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700'
                    : 'border-white/20 bg-white/5 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
                }`}
                title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved / Done'}
              >
                <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  isSolved ? 'bg-white border-white text-emerald-600' : 'border-slate-400 dark:border-white/30'
                }`}>
                  {isSolved && <Check size={11} strokeWidth={3.5} />}
                </div>
                <span>{isSolved ? 'Solved ✓' : 'Mark Done'}</span>
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen((f) => !f)}
                className={`p-2 rounded-xl border transition-all ${
                  isLight ? 'border-slate-200 text-slate-600 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              {/* Close Modal Button */}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl border transition-all ${
                  isLight
                    ? 'border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                    : 'border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                }`}
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* ── TWO COLUMN SOLVING WORKSPACE ── */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-black/10 dark:divide-white/10">

            {/* ── LEFT PANEL: Problem Details, Blueprint & Debugger (5 Cols) ── */}
            <div className="lg:col-span-5 flex flex-col min-h-0 overflow-hidden bg-white dark:bg-[#151518]">
              {/* Tab Navigation */}
              <div className="flex items-center border-b border-black/5 dark:border-white/5 px-3 pt-2 gap-1 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'overview'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('blueprint')}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'blueprint'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Lightbulb size={13} />
                  <span>Algorithm</span>
                </button>

                <button
                  onClick={() => setActiveTab('debugger')}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'debugger'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Bug size={13} className="text-red-500" />
                  <span>Live Debugger</span>
                </button>

                <button
                  onClick={() => setActiveTab('notes')}
                  className={`px-3 py-1.5 rounded-t-lg text-xs font-mono font-semibold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
                    activeTab === 'notes'
                      ? 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText size={13} />
                  <span>My Notes {notes.trim() && '•'}</span>
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* LeetCode Direct Jump Card */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isLight ? 'bg-orange-50/70 border-orange-200' : 'bg-gradient-to-r from-[#241708] to-[#1a1410] border-[#ff9500]/30'
                    }`}>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-mono text-[#ff9500] font-bold flex items-center gap-1">
                          <ExternalLink size={12} /> Official Problem on LeetCode
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          View full testcases, constraints, and community submissions on LeetCode.
                        </p>
                      </div>
                      <a
                        href={leetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-[#ff9500] text-black font-mono font-bold text-xs hover:brightness-110 shrink-0 shadow-sm flex items-center gap-1"
                      >
                        <span>Open LeetCode</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>

                    {/* Pattern Strategy Card */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-violet-500 uppercase flex items-center gap-1.5">
                          <Zap size={13} /> Optimal Pattern Strategy
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-black/40 border-white/10 text-slate-400'
                        }`}>
                          {patternInfo.key}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {patternInfo.concept}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/5'}`}>
                          <span className="text-[10px] text-slate-400 block">Target Time</span>
                          <span className="font-bold text-emerald-500">{patternInfo.time}</span>
                        </div>
                        <div className={`p-2 rounded-lg border ${isLight ? 'bg-white border-slate-200' : 'bg-black/30 border-white/5'}`}>
                          <span className="text-[10px] text-slate-400 block">Target Space</span>
                          <span className="font-bold text-violet-400">{patternInfo.space}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pro-Tips & Edge Cases */}
                    <div className={`p-4 rounded-xl border space-y-2 ${
                      isLight ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-950/20 border-amber-500/20'
                    }`}>
                      <h4 className="text-xs font-mono font-bold text-amber-500 flex items-center gap-1.5">
                        <Sparkles size={13} /> Interview Pro-Tips & Edge Cases
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                        {patternInfo.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'blueprint' && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={13} /> Canonical Algorithm Steps
                    </h3>
                    {patternInfo.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/10'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-violet-600/20 text-violet-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'debugger' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                      <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5">
                        <Bug size={14} /> Live Step-by-Step Code Debugger
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentLangObj.label} Execution
                      </span>
                    </div>

                    <StepVisualizer
                      doorNumber={problem.doorNumber || 1}
                      userCode={code}
                      topic={patternName}
                      exampleInput={patternInfo.exampleInput || '[1, 2, 3, 4, 5]'}
                      onLineChange={handleLineChange}
                      autoPlay={false}
                    />
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="h-full flex flex-col space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>Personal Notes (Auto-saved)</span>
                      <span>{notes.length} chars</span>
                    </div>
                    <textarea
                      value={notes}
                      onChange={handleNotesChange}
                      placeholder="Write your approach, time complexity breakdown, or tricky edge cases here..."
                      className={`w-full flex-1 min-h-[300px] p-3 rounded-xl border text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-500/30 resize-none ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                          : 'bg-black/40 border-white/10 text-slate-200 placeholder-slate-600'
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL: Monaco Code Editor (7 Cols) ── */}
            <div className="lg:col-span-7 flex flex-col min-h-0 overflow-hidden bg-[#1e1e1e]">

              {/* Editor Sub-Header Toolbar */}
              <div className={`px-4 py-2 border-b flex items-center justify-between gap-3 shrink-0 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#18181b] border-white/10'
              }`}>
                {/* Language Selector Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu((v) => !v)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                      isLight
                        ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
                        : 'bg-violet-950/40 border-violet-500/30 text-violet-300 hover:bg-violet-900/40'
                    }`}
                  >
                    <span>{currentLangObj.icon} {currentLangObj.label}</span>
                    <ChevronDown size={12} className={showLangMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`absolute top-full mt-1.5 left-0 rounded-xl border shadow-2xl overflow-hidden z-20 min-w-[140px] ${
                          isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c1f] border-white/10'
                        }`}
                      >
                        {LANG_CONFIG.map((l) => (
                          <button
                            key={l.id}
                            onClick={() => handleLangChange(l.id)}
                            className={`w-full text-left px-3 py-2 font-mono text-xs flex items-center gap-2 transition-colors ${
                              language === l.id
                                ? 'bg-violet-600 text-white font-bold'
                                : isLight
                                ? 'text-slate-700 hover:bg-slate-50'
                                : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{l.icon}</span>
                            <span>{l.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Utilities: Debug, Format, Reset, Save */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('debugger')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-sm ${
                      activeTab === 'debugger'
                        ? 'bg-red-500 text-white border border-red-500 shadow-red-500/20'
                        : isLight
                        ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                        : 'border border-red-500/30 bg-red-950/30 text-red-400 hover:bg-red-900/40'
                    }`}
                    title="Debug Code with step visualizer"
                  >
                    <Bug size={13} />
                    <span>Debug Code</span>
                  </button>

                  <button
                    onClick={handleFormat}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                      formatSuccess
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : isLight
                        ? 'border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-600'
                        : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                    title="Format Code (Alt+Shift+F)"
                  >
                    <Wand2 size={13} className={formatSuccess ? 'text-emerald-400 animate-spin' : ''} />
                    <span className="hidden sm:inline">{formatSuccess ? 'Formatted!' : 'Format'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                      isLight
                        ? 'border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600'
                        : 'border-white/10 text-slate-400 hover:border-amber-500/40 hover:text-amber-400'
                    }`}
                    title="Reset to starter code"
                  >
                    <RotateCcw size={12} />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all shadow-sm ${
                      savedSuccess
                        ? 'bg-emerald-500 text-white border border-emerald-500 shadow-emerald-500/20'
                        : 'bg-[#ff9500] text-black border border-[#ff9500] hover:brightness-110 shadow-orange-500/20'
                    }`}
                    title="Save code (Ctrl+S)"
                  >
                    <Save size={12} />
                    <span>{savedSuccess ? 'Saved ✓' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Monaco Code Editor Instance */}
              <div className="flex-1 min-h-0 relative">
                <Editor
                  height="100%"
                  language={currentLangObj.monaco}
                  value={code}
                  theme={isLight ? 'vs' : 'vs-dark'}
                  onChange={(val) => setCode(val || '')}
                  onMount={handleEditorMount}
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    tabSize: 4,
                    renderLineHighlight: 'all',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    contextmenu: true,
                    automaticLayout: true,
                    padding: { top: 14, bottom: 14 },
                  }}
                />
              </div>

              {/* Bottom Status Bar */}
              <div className={`px-4 py-1.5 border-t flex items-center justify-between text-[11px] font-mono shrink-0 ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-[#141416] border-white/5 text-slate-400'
              }`}>
                <div className="flex items-center gap-3">
                  <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                  <span>{lineCount} lines</span>
                  <span className="text-emerald-500 hidden sm:inline">● Auto-Saved</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">Ctrl+S to save • Esc to exit</span>
                  <a
                    href={leetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ff9500] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>LeetCode</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
