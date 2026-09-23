import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import {
  X, Code2, ExternalLink, Check, ChevronDown,
  RotateCcw, Maximize2, Minimize2, Save,
} from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

/* ── Starter code templates per language ── */
const STARTER = {
  java: (title) => `// ${title}
// Write your solution below

class Solution {
    public Object solve() {
        // TODO: implement
        return null;
    }
}`,

  python: (title) => `# ${title}
# Write your solution below

class Solution:
    def solve(self):
        # TODO: implement
        pass`,

  cpp: (title) => `// ${title}
// Write your solution below

#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    auto solve() {
        // TODO: implement
    }
};`,
};

const LANG_LABELS = { java: 'Java ☕', python: 'Python 🐍', cpp: 'C++ ⚡' };
const MONACO_LANG = { java: 'java', python: 'python', cpp: 'cpp' };

/**
 * PracticeEditorModal
 * Props:
 *  - problem: { id, title, difficulty, leetcodeUrl | leetcode }
 *  - onClose: () => void
 *  - onMarkDone: (id) => void
 *  - isSolved: boolean
 *  - storagePrefix: 'neetcode' | 'amazon' | 'striver'
 */
export default function PracticeEditorModal({
  problem,
  onClose,
  onMarkDone,
  isSolved,
  storagePrefix = 'neetcode',
}) {
  const isLight = useThemeStore((s) => s.theme) === 'light';
  const editorRef = useRef(null);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dsa100_practice_lang') || 'java';
  });
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [saved, setSaved] = useState(false);

  const codeKey = `dsa100_${storagePrefix}_code_${problem.id}_${language}`;

  const [code, setCode] = useState(() => {
    return localStorage.getItem(codeKey) || STARTER[language](problem.title);
  });

  // Load code for the selected language
  useEffect(() => {
    const saved = localStorage.getItem(codeKey);
    setCode(saved || STARTER[language](problem.title));
  }, [language, problem.id]);

  // ESC key closes modal
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleEditorMount = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const handleSave = useCallback(() => {
    const val = editorRef.current ? editorRef.current.getValue() : code;
    localStorage.setItem(codeKey, val);
    setCode(val);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [code, codeKey]);

  const handleReset = useCallback(() => {
    const fresh = STARTER[language](problem.title);
    setCode(fresh);
    if (editorRef.current) editorRef.current.setValue(fresh);
    localStorage.removeItem(codeKey);
  }, [language, problem.title, codeKey]);

  const handleLangChange = (lang) => {
    const val = editorRef.current ? editorRef.current.getValue() : code;
    localStorage.setItem(codeKey, val);
    setLanguage(lang);
    localStorage.setItem('dsa100_practice_lang', lang);
    setShowLangMenu(false);
  };

  const leetUrl = problem.leetcodeUrl || problem.leetcode || '#';
  const diffColors = {
    easy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  const diffKey = (problem.difficulty || 'medium').toLowerCase();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
            isFullscreen
              ? 'fixed inset-2 sm:inset-4'
              : 'w-full max-w-4xl h-[90vh] sm:h-[85vh]'
          } ${
            isLight
              ? 'bg-white border-slate-200'
              : 'bg-[#1c1c1e] border-white/10'
          }`}
        >
          {/* ── Header ── */}
          <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141416] border-white/10'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0">
                <Code2 size={16} className="text-violet-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-bold text-sm truncate max-w-[200px] sm:max-w-[400px]">
                  {problem.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border capitalize ${diffColors[diffKey] || diffColors.medium}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Practice Editor · code auto-saved</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mark Done */}
              <button
                onClick={() => onMarkDone(problem.id)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
                  isSolved
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                    : isLight
                    ? 'border-slate-300 bg-slate-50 text-slate-600 hover:border-emerald-500 hover:text-emerald-700'
                    : 'border-white/20 bg-black/30 text-slate-400 hover:border-emerald-500 hover:text-emerald-300'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  isSolved ? 'bg-white border-white text-emerald-600' : 'border-current'
                }`}>
                  {isSolved && <Check size={10} strokeWidth={4} />}
                </div>
                {isSolved ? 'Solved ✓' : 'Mark Done'}
              </button>

              {/* LeetCode reference (optional) */}
              {leetUrl !== '#' && (
                <a
                  href={leetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                    isLight
                      ? 'border-slate-300 text-slate-500 hover:border-[#ff9500] hover:text-[#ff9500]'
                      : 'border-white/10 text-slate-400 hover:border-[#ff9500] hover:text-[#ff9500]'
                  }`}
                  title="View problem on LeetCode for reference"
                >
                  <ExternalLink size={12} />
                  <span>Ref</span>
                </a>
              )}

              {/* Fullscreen */}
              <button
                onClick={() => setIsFullscreen((f) => !f)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isLight ? 'border-slate-200 text-slate-500 hover:bg-slate-100' : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg border transition-all ${
                  isLight
                    ? 'border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                    : 'border-white/10 text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                }`}
                title="Close (Esc)"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Editor Toolbar ── */}
          <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${
            isLight ? 'bg-white border-slate-100' : 'bg-[#161618] border-white/5'
          }`}>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu((v) => !v)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
                  isLight
                    ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
                    : 'bg-violet-950/30 border-violet-500/30 text-violet-300 hover:bg-violet-950/50'
                }`}
              >
                <span>{LANG_LABELS[language]}</span>
                <ChevronDown size={11} className={showLangMenu ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className={`absolute top-full mt-1 left-0 rounded-xl border shadow-xl overflow-hidden z-10 min-w-[130px] ${
                      isLight ? 'bg-white border-slate-200' : 'bg-[#1c1c1e] border-white/10'
                    }`}
                  >
                    {Object.entries(LANG_LABELS).map(([lang, label]) => (
                      <button
                        key={lang}
                        onClick={() => handleLangChange(lang)}
                        className={`w-full text-left px-3 py-2 font-mono text-xs transition-colors ${
                          language === lang
                            ? 'bg-violet-600 text-white font-bold'
                            : isLight
                            ? 'text-slate-700 hover:bg-slate-50'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Reset + Save */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                  isLight
                    ? 'border-slate-200 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50'
                    : 'border-white/10 text-slate-400 hover:border-amber-500/40 hover:text-amber-400'
                }`}
                title="Reset to starter code"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all shadow-sm ${
                  saved
                    ? 'bg-emerald-500 text-white border border-emerald-500'
                    : 'bg-[#ff9500] text-black border border-[#ff9500] hover:brightness-110'
                }`}
              >
                <Save size={12} />
                <span>{saved ? 'Saved!' : 'Save'}</span>
              </button>
            </div>
          </div>

          {/* ── Monaco Editor ── */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Editor
              height="100%"
              language={MONACO_LANG[language]}
              value={code}
              theme={isLight ? 'vs' : 'vs-dark'}
              onChange={(val) => setCode(val || '')}
              onMount={handleEditorMount}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* ── Bottom bar (mobile Mark Done) ── */}
          <div className={`sm:hidden flex items-center justify-between px-4 py-2 border-t shrink-0 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#141416] border-white/10'
          }`}>
            <button
              onClick={() => onMarkDone(problem.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all ${
                isSolved
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-white/20 bg-black/30 text-slate-400 hover:border-emerald-500'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                isSolved ? 'bg-white border-white text-emerald-600' : 'border-current'
              }`}>
                {isSolved && <Check size={10} strokeWidth={4} />}
              </div>
              {isSolved ? 'Solved ✓' : 'Mark Done'}
            </button>
            {leetUrl !== '#' && (
              <a href={leetUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-[#ff9500]">
                <ExternalLink size={12} /> LeetCode ref
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
