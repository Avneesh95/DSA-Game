import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Send, RefreshCw, Lightbulb, Loader2, Cpu,
  Sparkles, Maximize2, Minimize2, X, Terminal,
  CheckCircle, XCircle, FileCode2, Clock,
  Home,
} from 'lucide-react';

import MainLayout from '../layouts/MainLayout';
import KeysPanel from '../components/KeysPanel';
import HintPanel from '../components/HintPanel';
import PatternQuiz from '../components/PatternQuiz';
import DoorUnlockOverlay from '../components/DoorUnlockOverlay';
import LanguageSelector from '../components/LanguageSelector';
import StepVisualizer from '../visualizers/StepVisualizer';
import { doorApi, submissionApi, progressApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

const MONACO_LANGUAGE_MAP = { java: 'java', python: 'python', cpp: 'cpp', c: 'cpp' };

const LANG_ICONS = {
  java: '☕',
  python: '🐍',
  cpp: '⚡',
  c: '🔧',
};

export default function DoorPage() {
  const { doorNumber } = useParams();
  const navigate = useNavigate();
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const activeTheme = useThemeStore((state) => state.theme);
  const isLight = activeTheme === 'light';

  const editorRef      = useRef(null);
  const decorationsRef = useRef(null);

  const [doorData,    setDoorData]    = useState(null);
  const [code,        setCode]        = useState('');
  const [language,    setLanguage]    = useState(() => localStorage.getItem('dsa100_language') || 'java');
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [runError,    setRunError]    = useState(null);

  const [isRunning,      setIsRunning]      = useState(false);
  const [runningAction,  setRunningAction]  = useState(null);
  const [runResult,      setRunResult]      = useState(null);
  const [submitResult,   setSubmitResult]   = useState(null);
  const [hintsUsed,      setHintsUsed]      = useState(0);
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(false);
  const [isFullscreen,   setIsFullscreen]   = useState(false);
  const [lineCount,      setLineCount]      = useState(0);
  const [cursorPos,      setCursorPos]      = useState({ line: 1, col: 1 });

  /* ── Fetch door ── */
  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    setRunResult(null);
    setSubmitResult(null);
    setRunError(null);

    (async () => {
      try {
        const { data } = await doorApi.getByNumber(doorNumber);
        if (!mounted) return;
        setDoorData(data);
        setHintsUsed(data.progress?.hintsUsed || 0);
        const starter = data.problem.starterCode.find((s) => s.language === language) || data.problem.starterCode[0];
        setCode(starter?.code || '');
        if (data.progress?.status === 'AVAILABLE') {
          progressApi.update({ doorNumber: Number(doorNumber), status: 'IN_PROGRESS' }).catch(() => {});
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || 'Failed to load this door');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [doorNumber]);

  /* ── ESC key exits fullscreen ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  /* ── Handlers ── */
  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('dsa100_language', lang);
    if (doorData) {
      const starter = doorData.problem.starterCode.find((s) => s.language === lang) || doorData.problem.starterCode[0];
      setCode(starter?.code || '');
      setRunResult(null);
      setRunError(null);
      if (decorationsRef.current) decorationsRef.current.clear();
    }
  }, [doorData]);

  const handleReset = useCallback(() => {
    if (!doorData) return;
    const starter = doorData.problem.starterCode.find((s) => s.language === language) || doorData.problem.starterCode[0];
    setCode(starter?.code || '');
    setRunResult(null);
    setRunError(null);
    if (decorationsRef.current) decorationsRef.current.clear();
  }, [doorData, language]);

  const handleLoadSolution = useCallback(() => {
    if (!doorData?.problem?.referenceSolution?.code) return;
    setCode(doorData.problem.referenceSolution.code);
    setRunResult(null);
    setRunError(null);
    if (decorationsRef.current) decorationsRef.current.clear();
  }, [doorData]);

  const handleEditorMount = useCallback((editor) => {
    editorRef.current = editor;
    setLineCount(editor.getModel()?.getLineCount() || 0);

    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column });
    });
    editor.onDidChangeModelContent(() => {
      setLineCount(editor.getModel()?.getLineCount() || 0);
    });
  }, []);

  const handleLineChange = useCallback((lineNum) => {
    if (!editorRef.current) return;
    const editor = editorRef.current;
    const model  = editor.getModel();
    if (!model) return;
    const validLine = Math.min(Math.max(1, lineNum), model.getLineCount());
    editor.revealLineInCenter(validLine);
    if (decorationsRef.current) {
      decorationsRef.current.clear();
    }
  }, []);

  const handleRun = async () => {
    if (!doorData) return;
    setIsRunning(true);
    setRunningAction('run');
    setRunResult(null);
    setRunError(null);
    try {
      const { data } = await submissionApi.run({ problemId: doorData.problem._id, code, language });
      setRunResult({ ...data, mode: 'run' });
      const firstErr = data?.keyResults?.find((k) => k.error || k.stderr);
      if (firstErr) setRunError(firstErr.error || firstErr.stderr || null);
    } catch (err) {
      setRunError(err.response?.data?.message || err.message || 'Code execution failed');
    } finally {
      setIsRunning(false);
      setRunningAction(null);
    }
  };

  const handleSubmit = async () => {
    if (!doorData) return;
    setIsRunning(true);
    setRunningAction('submit');
    setRunError(null);
    try {
      const { data } = await submissionApi.submit({
        problemId: doorData.problem._id,
        code,
        language,
        hintsUsed,
      });
      setSubmitResult(data);
      setRunResult({ keyResults: data.keyResults, mode: 'submit', doorUnlocked: data.doorUnlocked });
      
      const firstErr = data?.keyResults?.find((k) => k.error || k.stderr);
      if (firstErr) setRunError(firstErr.error || firstErr.stderr || null);

      if (data.doorUnlocked) {
        setShowUnlockOverlay(true);
        refreshProfile();
      }
    } catch (err) {
      setRunError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setIsRunning(false);
      setRunningAction(null);
    }
  };

  /* ── Loading / fatal error ── */
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[40vh] gap-3">
          <Loader2 className="animate-spin text-glow-purple" size={24} />
          <p className="text-slate-400 font-mono text-sm">Loading door {doorNumber}...</p>
        </div>
      </MainLayout>
    );
  }

  if (error && !doorData) {
    return (
      <MainLayout>
        <div className="door-panel text-center py-10">
          <p className="text-glow-rose mb-3">{error}</p>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Back to Map
          </button>
        </div>
      </MainLayout>
    );
  }

  const { problem, door } = doorData;
  const isRunMode          = runResult?.mode === 'run';
  const totalKeysTested    = runResult?.keyResults?.length || 0;
  const keysCollectedCount = (runResult?.keyResults || []).filter((r) => r.passed).length;
  const allTestedPassed    = totalKeysTested > 0 && keysCollectedCount === totalKeysTested;
  const allKeysCollected   = keysCollectedCount === problem.keys.length && totalKeysTested === problem.keys.length;
  const passRate           = totalKeysTested
    ? Math.round((keysCollectedCount / totalKeysTested) * 100)
    : null;

  return (
    <MainLayout>
      <DoorUnlockOverlay
        visible={showUnlockOverlay}
        hasNextDoor={Number(doorNumber) < 100}
        onWatchAgain={() => setShowUnlockOverlay(false)}
        onNextDoor={() => {
          setShowUnlockOverlay(false);
          navigate(`/door/${Number(doorNumber) + 1}`);
        }}
        result={submitResult?.doorUnlocked ? {
          pattern: problem.pattern,
          difficulty: problem.difficulty,
          timeComplexity: problem.expectedComplexity?.time,
          spaceComplexity: problem.expectedComplexity?.space,
          attempts: submitResult.progress?.attempts || 1,
          hintsUsed: submitResult.progress?.hintsUsed || 0,
          xp: submitResult.xpBreakdown?.total || problem.xp || 50,
        } : null}
      />

      {/* ── Door Header ── */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate('/')}
            title="Back to Home"
            className={`mt-0.5 shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-mono transition-all duration-200 group ${
              isLight
                ? 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 hover:border-violet-300'
                : 'bg-dungeon-800 hover:bg-dungeon-700 border-dungeon-600 text-slate-400 hover:text-glow-purple hover:border-glow-purple/50'
            }`}
          >
            <Home size={13} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div>
            <span className={`text-xs uppercase tracking-wide ${isLight ? 'text-violet-600 font-semibold' : 'text-glow-purple'}`}>
              {door.world}
            </span>
            <h1 className={`font-display text-lg sm:text-xl leading-snug ${isLight ? 'text-violet-950 font-bold' : 'text-glow-gold'}`}>
              Door {problem.doorNumber}: {problem.title}
            </h1>
          </div>
        </div>

        <span className={`self-start sm:self-auto shrink-0 text-xs px-2.5 py-1 rounded-full border capitalize whitespace-nowrap font-medium ${
          isLight
            ? 'bg-violet-50 border-violet-200 text-violet-700'
            : 'border-dungeon-600 text-slate-300'
        }`}>
          {problem.difficulty} · {problem.xp} XP
        </span>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT: Problem + Visualizer */}
        <div className="space-y-4">
          <div className="door-panel">
            <div className="flex gap-2 text-xs mb-3">
              <span className={`px-2 py-1 rounded font-medium ${isLight ? 'bg-sky-100 text-sky-800' : 'bg-dungeon-700 text-glow-cyan'}`}>
                {problem.topic}
              </span>
              <span className={`px-2 py-1 rounded font-medium ${isLight ? 'bg-violet-100 text-violet-800' : 'bg-dungeon-700 text-glow-purple'}`}>
                {problem.pattern}
              </span>
            </div>
            <p className="text-sm whitespace-pre-line mb-4 leading-relaxed">{problem.description}</p>

            <h4 className="text-xs uppercase text-slate-500 mb-1 font-semibold">Examples</h4>
            <div className="space-y-2 mb-4">
              {problem.examples.map((ex, i) => (
                <div key={i} className={`rounded-lg p-2.5 font-mono text-xs break-words border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-dungeon-900/60 border-dungeon-800'
                }`}>
                  <div><span className={isLight ? 'text-slate-500 font-semibold' : 'text-slate-500'}>Input:</span> {ex.input}</div>
                  <div><span className={isLight ? 'text-slate-500 font-semibold' : 'text-slate-500'}>Output:</span> {ex.output}</div>
                  {ex.explanation && <div className="text-slate-500 mt-1 break-words">{ex.explanation}</div>}
                </div>
              ))}
            </div>

            <h4 className="text-xs uppercase text-slate-500 mb-1 font-semibold">Constraints</h4>
            <ul className="list-disc list-inside text-xs text-slate-400 mb-4 space-y-0.5">
              {problem.constraints.map((c, i) => <li key={i}>{c}</li>)}
            </ul>

            <h4 className="text-xs uppercase text-slate-500 mb-1 font-semibold">Expected Complexity</h4>
            <p className="text-xs text-slate-400">
              Time: <strong className={isLight ? 'text-violet-700' : 'text-glow-cyan'}>{problem.expectedComplexity.time}</strong> · Space: <strong className={isLight ? 'text-violet-700' : 'text-glow-purple'}>{problem.expectedComplexity.space}</strong>
            </p>
          </div>

          <HintPanel
            hints={problem.hints}
            hintsUsed={hintsUsed}
            onUseHint={setHintsUsed}
            problem={problem}
          />

          {/* Visualizer */}
          <StepVisualizer
            key={`vis-${doorNumber}`}
            visualizationSteps={problem.visualizationSteps}
            exampleInput={problem.examples[0]?.input}
            topic={problem.topic}
            runResult={runResult}
            userCode={code}
            onLineChange={handleLineChange}
            autoPlay={submitResult?.doorUnlocked}
          />

          {problem.solutionExplanation && submitResult?.doorUnlocked && (
            <div className="door-panel bg-dungeon-900/50">
              <h4 className="text-xs font-display text-glow-gold uppercase tracking-wider mb-2">Solution Insight</h4>
              <p className="text-xs leading-relaxed">{problem.solutionExplanation}</p>
            </div>
          )}

          {submitResult?.doorUnlocked && (
            <PatternQuiz correctPattern={problem.pattern} onAnswer={() => {}} />
          )}
        </div>

        {/* RIGHT: Monaco Editor Container */}
        <div className="space-y-4">
          <div
            className={`flex flex-col rounded-2xl border overflow-hidden transition-all ${
              isLight
                ? 'bg-white border-black/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
                : 'bg-[#1c1c1e] border-white/[0.08] shadow-[0_2px_32px_rgba(0,0,0,0.5)]'
            } ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none p-2' : ''
            }`}
          >
            {/* Top Toolbar */}
            <div className={`flex items-center justify-between px-3.5 py-2 border-b gap-2 shrink-0 ${
              isLight
                ? 'bg-[#f5f5f7] border-black/[0.06]'
                : 'bg-black/40 border-white/[0.08]'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{LANG_ICONS[language] || '💻'}</span>
                <LanguageSelector value={language} onChange={handleLanguageChange} />
              </div>

              <div className="flex items-center gap-1.5">
                {problem.referenceSolution?.code && (
                  <button
                    onClick={handleLoadSolution}
                    className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all border ${
                      isLight
                        ? 'bg-[#ff9500]/10 border-[#ff9500]/25 text-[#bf5f00] hover:bg-[#ff9500]/20'
                        : 'bg-[#ff9500]/15 text-[#ff9500] hover:bg-[#ff9500]/25 border-[#ff9500]/30'
                    }`}
                    title="Load reference solution"
                  >
                    <Sparkles size={11} /> Solution
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className={`text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    isLight
                      ? 'text-[#6e6e73] hover:text-[#ff3b30] hover:bg-black/[0.04]'
                      : 'text-white/50 hover:text-[#ff3b30] hover:bg-white/[0.06]'
                  }`}
                  title="Reset to starter code"
                >
                  <RefreshCw size={11} /> Reset
                </button>
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  className={`text-xs p-1.5 rounded-lg transition-all ${
                    isLight
                      ? 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen editor'}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                {isFullscreen && (
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="text-xs text-white/50 hover:text-[#ff3b30] hover:bg-white/[0.06] p-1.5 rounded-lg transition-all ml-1"
                    title="Close fullscreen (Esc)"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
              <Editor
                height={isFullscreen ? 'calc(100vh - 160px)' : 'clamp(320px, 52vh, 520px)'}
                language={MONACO_LANGUAGE_MAP[language]}
                theme={isLight ? 'light' : 'vs-dark'}
                value={code}
                onMount={handleEditorMount}
                onChange={(v) => {
                  setCode(v ?? '');
                  if (decorationsRef.current) decorationsRef.current.clear();
                }}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                  fontLigatures: true,
                  lineHeight: 22,
                  minimap: { enabled: isFullscreen },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  roundedSelection: true,
                  padding: { top: 12, bottom: 12 },
                  renderLineHighlight: 'none',
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true, indentation: true },
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'auto',
                    useShadows: false,
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  },
                  overviewRulerBorder: false,
                  hideCursorInOverviewRuler: true,
                  fixedOverflowWidgets: true,
                }}
              />
            </div>

            {/* Status Bar */}
            <div className={`flex items-center justify-between px-3.5 py-1.5 border-t text-[11px] font-mono shrink-0 ${
              isLight
                ? 'bg-[#f5f5f7] border-black/[0.06] text-[#6e6e73]'
                : 'bg-black/40 border-white/[0.06] text-white/40'
            }`}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-white/70">
                  <FileCode2 size={11} />
                  {language.toUpperCase()}
                </span>
                <span>Ln {cursorPos.line}, Col {cursorPos.col}</span>
                <span>{lineCount} lines</span>
              </div>
              <div className="flex items-center gap-2">
                {passRate !== null && (
                  <span className={`font-semibold ${passRate === 100 ? 'text-[#34c759]' : passRate > 0 ? 'text-[#ff9500]' : 'text-[#ff3b30]'}`}>
                    {passRate}% passed
                  </span>
                )}
                {runResult && (
                  <span className="flex items-center gap-1 font-medium">
                    {isRunMode ? (
                      allTestedPassed ? (
                        <span className="text-[#34c759] flex items-center gap-1">
                          <CheckCircle size={11} /> {keysCollectedCount}/{totalKeysTested} Public Keys Passed
                        </span>
                      ) : (
                        <span className="text-[#ff3b30] flex items-center gap-1">
                          <XCircle size={11} /> {keysCollectedCount}/{totalKeysTested} Public Keys
                        </span>
                      )
                    ) : allKeysCollected ? (
                      <span className="text-[#34c759] flex items-center gap-1 font-semibold">
                        <CheckCircle size={11} /> All {keysCollectedCount} Keys Collected!
                      </span>
                    ) : (
                      <span className="text-[#ff3b30] flex items-center gap-1 font-semibold">
                        <XCircle size={11} /> {keysCollectedCount}/{problem.keys.length} Keys
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Run / Submit Buttons */}
            <div className={`flex gap-2.5 p-3 border-t shrink-0 ${
              isLight
                ? 'bg-[#fafafa] border-black/[0.06]'
                : 'bg-black/30 border-white/[0.08]'
            }`}>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`flex-1 flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl font-semibold border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLight
                    ? 'bg-white hover:bg-black/[0.04] border-black/[0.12] text-[#1d1d1f] shadow-sm'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-white'
                }`}
              >
                {isRunning && runningAction === 'run'
                  ? <><Loader2 size={15} className="animate-spin" /> Running...</>
                  : <><Play size={14} /> Run Code</>
                }
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="flex-1 flex items-center justify-center gap-2 text-sm py-2.5 rounded-xl font-semibold text-white border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  bg-[#ff9500] hover:brightness-110 shadow-[0_2px_12px_rgba(255,149,0,0.35)] hover:shadow-[0_4px_18px_rgba(255,149,0,0.45)] hover:-translate-y-0.5"
              >
                {isRunning && runningAction === 'submit'
                  ? <><Loader2 size={15} className="animate-spin" /> Judging...</>
                  : <><Send size={14} /> Submit</>
                }
              </button>
            </div>

            {/* Error Console (bottom of editor) */}
            <AnimatePresence>
              {runError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`border-t overflow-hidden shrink-0 ${
                    isLight
                      ? 'border-rose-200 bg-rose-50/95'
                      : 'border-rose-500/40 bg-rose-950/60'
                  }`}
                >
                  <div className="flex items-start gap-2 p-3">
                    <Terminal size={13} className="text-rose-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-wider">
                          Execution Error
                        </span>
                        <button
                          onClick={() => setRunError(null)}
                          className="text-rose-400 hover:text-rose-600 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-rose-700 dark:text-rose-300 whitespace-pre-wrap break-all leading-relaxed max-h-32 overflow-y-auto">
                        {runError}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Execution Progress Bar */}
            <AnimatePresence>
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="shrink-0"
                >
                  <div className="h-0.5 bg-dungeon-900 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-glow-purple via-glow-gold to-glow-cyan"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    />
                  </div>
                  <div className={`flex items-center justify-center gap-2 py-1.5 text-[11px] font-mono ${
                    isLight ? 'bg-slate-100 text-slate-600' : 'bg-dungeon-900/80 text-slate-400'
                  }`}>
                    <Cpu size={11} className="animate-pulse text-glow-purple" />
                    {runningAction === 'submit' ? 'Compiling & judging...' : 'Running test harness...'}
                    <Clock size={11} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <KeysPanel keys={problem.keys} keyResults={runResult?.keyResults} />

          {allKeysCollected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="door-panel border-glow-emerald/70 text-center bg-emerald-950/20"
            >
              <p className="text-glow-emerald font-display text-sm flex items-center justify-center gap-2">
                <Lightbulb size={16} /> ALL KEYS COLLECTED — DOOR UNLOCKED
              </p>
            </motion.div>
          )}

          {isRunMode && allTestedPassed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="door-panel border-amber-500/40 bg-amber-950/20 text-center py-3"
            >
              <p className="text-amber-400 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle size={14} className="text-[#34c759]" /> All public test keys passed! Click <span className="bg-[#ff9500] text-white px-2 py-0.5 rounded text-[11px] font-bold">Submit</span> to test against hidden keys & unlock the door.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
