import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Code2, ExternalLink, BookOpen,
  ChevronDown, ChevronUp, Layers,
  Star, Check, ListFilter,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { STRIVER_TOPICS, STRIVER_PROBLEMS } from '../data/striverSheetData';
import useThemeStore from '../store/useThemeStore';
import PracticeEditorModal from '../components/PracticeEditorModal';

export default function StriverSDESheet() {
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState(() => new Set(STRIVER_TOPICS.slice(0, 5)));
  const [activeProblem, setActiveProblem] = useState(null); // problem open in editor modal

  // Persistent standalone bookmarks and custom solved state (100% independent of 100 doors game)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_striver_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  const [customSolvedIds, setCustomSolvedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_striver_solved') || '[]'));
    } catch {
      return new Set();
    }
  });

  const isProblemSolved = (p) => customSolvedIds.has(p.id);

  const toggleSolved = (pId) => {
    setCustomSolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      localStorage.setItem('dsa100_striver_solved', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleBookmark = (pId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      localStorage.setItem('dsa100_striver_bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  const solvedCount = useMemo(() => {
    return STRIVER_PROBLEMS.filter((p) => customSolvedIds.has(p.id)).length;
  }, [customSolvedIds]);

  const totalCount = STRIVER_PROBLEMS.length;
  const progressPct = Math.round((solvedCount / totalCount) * 100) || 0;

  const toggleTopic = (topic) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const expandAll = () => setExpandedTopics(new Set(STRIVER_TOPICS));
  const collapseAll = () => setExpandedTopics(new Set());

  // Filter problems
  const filteredProblems = useMemo(() => {
    return STRIVER_PROBLEMS.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q);
      const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty.toUpperCase() === selectedDifficulty;
      const matchesTopic = selectedTopic === 'ALL' || p.topic === selectedTopic;
      const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.has(p.id);
      const matchesSolved = !showOnlyUnsolved || !isProblemSolved(p);
      return matchesSearch && matchesDiff && matchesTopic && matchesBookmark && matchesSolved;
    });
  }, [searchQuery, selectedDifficulty, selectedTopic, showOnlyBookmarks, showOnlyUnsolved, bookmarkedIds, customSolvedIds]);

  // Group by topic
  const groupedByTopic = useMemo(() => {
    const groups = new Map();
    STRIVER_TOPICS.forEach((topic) => {
      const proms = filteredProblems.filter((p) => p.topic === topic);
      if (proms.length > 0) groups.set(topic, proms);
    });
    return groups;
  }, [filteredProblems]);

  const difficultyColors = {
    easy: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    medium: isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-950/40 text-amber-300 border-amber-500/30',
    hard: isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-950/40 text-rose-300 border-rose-500/30',
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-12">

        {/* ── Hero Banner ── */}
        <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-7 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-red-50/80 via-amber-50/40 to-white border-red-200/70 shadow-[0_4px_24px_rgba(239,68,68,0.06)]'
            : 'bg-gradient-to-r from-[#201111] via-[#1c1c1e] to-[#161618] border-red-500/30 shadow-[0_4px_32px_rgba(239,68,68,0.1)]'
        }`}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-600 text-white shadow-sm">
                  <BookOpen size={13} /> STRIVER SDE SHEET
                </span>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                  isLight ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  27 Modules · 149 Curated Problems
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold">
                Striver SDE Practice Sheet
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                The renowned SDE preparation sheet by TakeUForward. Track your solved status independently with checkboxes and open problems directly in new tabs.
              </p>
            </div>

            {/* Progress Card */}
            <div className={`p-4 rounded-2xl border min-w-[240px] ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Striver Solved Progress</span>
                <span className="text-red-500 font-bold">{solvedCount} / {totalCount} ({progressPct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>27 Modules</span>
                <span className="text-emerald-500 font-semibold">{solvedCount} Solved</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filters & Search ── */}
        <div className="space-y-3">
          {/* Quick Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowOnlyBookmarks((b) => !b)}
                className={`text-xs px-3 py-1.5 rounded-xl font-mono transition-all border flex items-center gap-1.5 ${
                  showOnlyBookmarks
                    ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-sm'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Star size={13} fill={showOnlyBookmarks ? 'currentColor' : 'none'} />
                <span>Bookmarked ({bookmarkedIds.size})</span>
              </button>

              <button
                onClick={() => setShowOnlyUnsolved((u) => !u)}
                className={`text-xs px-3 py-1.5 rounded-xl font-mono transition-all border flex items-center gap-1.5 ${
                  showOnlyUnsolved
                    ? 'bg-red-600 text-white border-red-600 font-bold shadow-sm'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <ListFilter size={13} />
                <span>Unsolved Only</span>
              </button>

              <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block" />

              <button
                onClick={expandAll}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                Collapse All
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredProblems.length} of {totalCount} problems
            </span>
          </div>

          {/* Search + Difficulty Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topic, pattern, or problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-2 focus:ring-red-500/30 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    : 'bg-[#1c1c1e] border-white/10 text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-mono font-medium transition-all shrink-0 border ${
                    selectedDifficulty === diff
                      ? 'bg-red-600 border-red-600 text-white font-bold shadow-sm'
                      : isLight
                      ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Topic Groups Accordion ── */}
        <div className="space-y-4">
          {Array.from(groupedByTopic.entries()).map(([topic, problems]) => {
            const isExpanded = expandedTopics.has(topic);
            const groupSolved = problems.filter(isProblemSolved).length;
            const groupTotal = problems.length;
            const groupPct = Math.round((groupSolved / groupTotal) * 100) || 0;

            return (
              <div
                key={topic}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
                }`}
              >
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-left border-b transition-colors ${
                    isLight
                      ? 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center font-bold text-xs">
                      <Layers size={14} />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-sm sm:text-base flex items-center gap-2">
                        {topic}
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-normal ${
                          isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                        }`}>
                          {problems.length} problems
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Progress indicator */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="w-24 bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full transition-all"
                          style={{ width: `${groupPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400">
                        {groupSolved}/{groupTotal}
                      </span>
                    </div>

                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>

                {/* Problem items */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 sm:p-5 border-t border-black/[0.04] dark:border-white/[0.06]"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                        {problems.map((prob) => {
                          const solved = isProblemSolved(prob);
                          const bookmarked = bookmarkedIds.has(prob.id);
                          const diffKey = prob.difficulty.toLowerCase();

                          return (
                            <motion.div
                              key={prob.id}
                              whileHover={{ y: -2 }}
                              className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden ${
                                solved
                                  ? isLight
                                    ? 'bg-emerald-50/50 border-emerald-400/80 shadow-sm'
                                    : 'bg-emerald-950/20 border-emerald-500/40'
                                  : isLight
                                  ? 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm hover:shadow-md'
                                  : 'bg-[#151517] hover:bg-[#1a1a1d] border-white/10 hover:border-white/20 shadow-sm'
                              }`}
                            >
                              {solved && (
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/15 rounded-bl-full pointer-events-none" />
                              )}

                              <div>
                                {/* Top Row: Checkbox Box, Difficulty & Bookmark */}
                                <div className="flex items-center justify-between gap-2 mb-2.5">
                                  <div className="flex items-center gap-2">
                                    {/* Clear Mark Solved Checkbox Box */}
                                    <button
                                      onClick={() => toggleSolved(prob.id)}
                                      className={`px-2 py-1 rounded-md border flex items-center gap-1.5 font-mono text-xs font-semibold transition-all ${
                                        solved
                                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                          : isLight
                                          ? 'border-slate-300 hover:border-emerald-500 bg-slate-50 text-slate-600 hover:text-emerald-700'
                                          : 'border-white/20 hover:border-emerald-500 bg-black/40 text-slate-400 hover:text-emerald-300'
                                      }`}
                                      title={solved ? 'Mark as Unsolved' : 'Mark as Solved'}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                        solved ? 'bg-white text-emerald-600 border-white' : 'border-slate-400 dark:border-white/30'
                                      }`}>
                                        {solved && <Check size={10} strokeWidth={4} />}
                                      </div>
                                      <span>{solved ? 'Solved' : 'Mark Done'}</span>
                                    </button>

                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border capitalize font-semibold ${
                                      difficultyColors[diffKey] || difficultyColors.medium
                                    }`}>
                                      {prob.difficulty}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => toggleBookmark(prob.id)}
                                    className={`p-1 rounded-md transition-colors ${
                                      bookmarked
                                        ? 'text-amber-500'
                                        : 'text-slate-300 dark:text-white/20 hover:text-amber-400'
                                    }`}
                                    title={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                                  >
                                    <Star size={14} fill={bookmarked ? 'currentColor' : 'none'} />
                                  </button>
                                </div>

                                {/* Problem Title — click to open in-app editor */}
                                <button
                                  onClick={() => setActiveProblem(prob)}
                                  className={`text-xs sm:text-sm font-semibold font-display mb-1.5 leading-snug line-clamp-2 block text-left hover:underline w-full ${
                                    solved
                                      ? 'text-slate-500 dark:text-slate-400 line-through'
                                      : isLight ? 'text-slate-900 hover:text-red-700' : 'text-slate-100 hover:text-red-400'
                                  }`}
                                >
                                  {prob.title}
                                </button>

                                {/* Pattern Tag */}
                                <div className="flex items-center gap-1.5 flex-wrap mb-4">
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-medium ${
                                    isLight
                                      ? 'bg-red-50 border-red-200/80 text-red-700'
                                      : 'bg-red-950/30 border-red-500/20 text-red-300'
                                  }`}>
                                    {prob.pattern}
                                  </span>
                                </div>
                              </div>

                              {/* Bottom Action: Practice in Editor + Direct LeetCode Link */}
                              <div className="pt-2.5 border-t border-black/5 dark:border-white/5 mt-auto flex items-center gap-2">
                                <button
                                  onClick={() => setActiveProblem(prob)}
                                  className="flex-1 py-1.5 px-3 rounded-lg font-mono text-xs font-semibold text-black bg-[#ff9500] hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-1.5 group"
                                >
                                  <Code2 size={12} />
                                  <span>Solve in App</span>
                                </button>
                                <a
                                  href={prob.leetcode}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-center ${
                                    isLight
                                      ? 'border-slate-300 text-slate-600 hover:border-[#ff9500] hover:text-[#ff9500] bg-slate-50'
                                      : 'border-white/10 text-slate-400 hover:border-[#ff9500] hover:text-[#ff9500] bg-white/5'
                                  }`}
                                  title="Open problem on LeetCode"
                                >
                                  <ExternalLink size={13} />
                                </a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── In-App Practice Editor Modal ── */}
      {activeProblem && (() => {
        const activeIdx = STRIVER_PROBLEMS.findIndex((p) => p.id === activeProblem.id);
        const hasPrev = activeIdx > 0;
        const hasNext = activeIdx >= 0 && activeIdx < STRIVER_PROBLEMS.length - 1;

        return (
          <PracticeEditorModal
            problem={activeProblem}
            onClose={() => setActiveProblem(null)}
            onMarkDone={(id) => { toggleSolved(id); }}
            isSolved={isProblemSolved(activeProblem)}
            storagePrefix="striver"
            sheetTitle="Striver SDE Sheet"
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPrevProblem={() => { if (hasPrev) setActiveProblem(STRIVER_PROBLEMS[activeIdx - 1]); }}
            onNextProblem={() => { if (hasNext) setActiveProblem(STRIVER_PROBLEMS[activeIdx + 1]); }}
          />
        );
      })()}
    </MainLayout>
  );
}
