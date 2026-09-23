import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Code2,
  Star, ShoppingBag, Check,
  ListFilter,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { AMAZON_CATEGORIES, AMAZON_150_PROBLEMS } from '../data/amazon150Data';
import useThemeStore from '../store/useThemeStore';
import PracticeEditorModal from '../components/PracticeEditorModal';

export default function Amazon150() {
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Focus Areas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null); // problem open in editor modal

  // Persistent standalone bookmarks and manual solved states
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_amazon_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  const [customSolvedIds, setCustomSolvedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_amazon_solved') || '[]'));
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
      localStorage.setItem('dsa100_amazon_solved', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleBookmark = (pId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      localStorage.setItem('dsa100_amazon_bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  const solvedAmazonCount = useMemo(() => {
    return AMAZON_150_PROBLEMS.filter((p) => customSolvedIds.has(p.id)).length;
  }, [customSolvedIds]);

  const totalProblems = AMAZON_150_PROBLEMS.length;
  const progressPct = Math.round((solvedAmazonCount / totalProblems) * 100) || 0;

  // Filter problems
  const filteredProblems = useMemo(() => {
    return AMAZON_150_PROBLEMS.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty.toUpperCase() === selectedDifficulty;
      const matchesCat = selectedCategory === 'All Focus Areas' || p.category === selectedCategory;
      const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.has(p.id);
      const matchesSolved = !showOnlyUnsolved || !isProblemSolved(p);
      return matchesSearch && matchesDiff && matchesCat && matchesBookmark && matchesSolved;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory, showOnlyBookmarks, showOnlyUnsolved, bookmarkedIds, customSolvedIds]);

  const difficultyColors = {
    easy: isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30',
    medium: isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-950/40 text-amber-300 border-amber-500/30',
    hard: isLight ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-rose-950/40 text-rose-300 border-rose-500/30',
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* ── Amazon Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
            isLight
              ? 'bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white border-slate-200 shadow-sm'
              : 'bg-gradient-to-r from-[#241a10] via-[#1c1c1e] to-[#121214] border-white/10 shadow-2xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9500]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ff9500] text-black shadow-sm">
                  <ShoppingBag size={13} /> AMAZON TOP 150
                </span>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                  isLight ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  High-Frequency Interview Pool
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold">
                Amazon SDE Interview Masterlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                The most frequently tested coding questions in Amazon SDE loops. Track your progress with independent checkboxes and frequency meters.
              </p>
            </div>

            {/* Progress Card */}
            <div className={`p-4 rounded-2xl border min-w-[240px] ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Amazon Solved Progress</span>
                <span className="text-[#ff9500] font-bold">{solvedAmazonCount} / {totalProblems} ({progressPct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#ff9500] to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>150 Questions</span>
                <span className="text-emerald-500 font-semibold">{solvedAmazonCount} Solved</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Category & Filter Bar ── */}
        <div className="space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {AMAZON_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-mono font-medium transition-all shrink-0 border ${
                  selectedCategory === cat
                    ? 'bg-[#ff9500] border-[#ff9500] text-black font-bold shadow-sm'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

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
                    ? 'bg-[#ff9500] text-black border-[#ff9500] font-bold shadow-sm'
                    : isLight
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <ListFilter size={13} />
                <span>Unsolved Only</span>
              </button>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Showing {filteredProblems.length} Amazon Interview Questions
            </span>
          </div>

          {/* Search + Difficulty Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search question, tag, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-2 focus:ring-[#ff9500]/30 ${
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
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-sm'
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

        {/* ── Problem Cards Grid ── */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 font-mono text-xs">
            No questions found matching &quot;{searchQuery}&quot;. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProblems.map((p) => {
              const solved = isProblemSolved(p);
              const bookmarked = bookmarkedIds.has(p.id);
              const diffKey = p.difficulty.toLowerCase();

              return (
                <motion.div
                  key={p.id}
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
                    {/* Top Row: Checkbox Box, Difficulty, Frequency, Bookmark */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        {/* Clear Mark Solved Checkbox Box */}
                        <button
                          onClick={() => toggleSolved(p.id)}
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
                          {p.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Frequency Stars */}
                        <div className="flex items-center gap-0.5" title={`Interview Frequency: ${p.frequency}/5`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={i < p.frequency ? 'fill-[#ff9500] text-[#ff9500]' : 'text-slate-300 dark:text-slate-700'}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() => toggleBookmark(p.id)}
                          className={`p-1 rounded-md transition-colors ${
                            bookmarked
                              ? 'text-amber-500'
                              : 'text-slate-300 dark:text-white/20 hover:text-amber-400'
                          }`}
                          title={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                        >
                          <Star size={14} fill={bookmarked ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Question Title — click to open in-app editor */}
                    <button
                      onClick={() => setActiveProblem(p)}
                      className={`text-xs sm:text-sm font-semibold font-display mb-1.5 leading-snug line-clamp-2 block text-left hover:underline w-full ${
                        solved
                          ? 'text-slate-500 dark:text-slate-400 line-through'
                          : isLight ? 'text-slate-900 hover:text-[#bf5f00]' : 'text-slate-100 hover:text-amber-400'
                      }`}
                    >
                      {p.title}
                    </button>

                    {/* Category & Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium">
                        {p.category}
                      </span>
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                            isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/5 text-slate-400'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action: Open in-app code editor */}
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 mt-auto">
                    <button
                      onClick={() => setActiveProblem(p)}
                      className="w-full py-1.5 px-3 rounded-lg font-mono text-xs font-semibold text-black bg-[#ff9500] hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-1.5 group"
                    >
                      <Code2 size={12} />
                      <span>Practice in Editor</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── In-App Practice Editor Modal ── */}
      {activeProblem && (
        <PracticeEditorModal
          problem={activeProblem}
          onClose={() => setActiveProblem(null)}
          onMarkDone={(id) => { toggleSolved(id); }}
          isSolved={isProblemSolved(activeProblem)}
          storagePrefix="amazon"
        />
      )}
    </MainLayout>
  );
}
