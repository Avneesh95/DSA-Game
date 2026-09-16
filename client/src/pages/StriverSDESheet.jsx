import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, Circle, Search, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Trophy, BookOpen, Layers, Bookmark,
  Filter, Star, Code2, DoorOpen, Check, ListFilter,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { STRIVER_TOPICS, STRIVER_PROBLEMS } from '../data/striverSheetData';
import { doorApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import DungeonLoader from '../components/DungeonLoader';

export default function StriverSDESheet() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [doors, setDoors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState(() => new Set(STRIVER_TOPICS.slice(0, 5)));

  // Persistent manual bookmarks & custom solved overrides
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

  useEffect(() => {
    let isMounted = true;
    const fetchDoors = async () => {
      try {
        const { data } = await doorApi.getAll();
        if (isMounted) setDoors(data.doors || []);
      } catch (err) {
        console.error('Failed to load door states for Striver SDE Sheet:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchDoors();
    return () => { isMounted = false; };
  }, []);

  const completedDoorNums = useMemo(() => {
    return new Set(doors.filter((d) => d.status === 'COMPLETED').map((d) => d.doorNumber));
  }, [doors]);

  // Check if problem is solved (either by Door completion or manual tick)
  const isProblemSolved = (p) => {
    if (p.doorNumber && completedDoorNums.has(p.doorNumber)) return true;
    return customSolvedIds.has(p.id);
  };

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
    return STRIVER_PROBLEMS.filter(isProblemSolved).length;
  }, [completedDoorNums, customSolvedIds]);

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
  }, [searchQuery, selectedDifficulty, selectedTopic, showOnlyBookmarks, showOnlyUnsolved, bookmarkedIds, customSolvedIds, completedDoorNums]);

  // Group by topic
  const groupedByTopic = useMemo(() => {
    const groups = new Map();
    STRIVER_TOPICS.forEach((topic) => {
      const proms = filteredProblems.filter((p) => p.topic === topic);
      if (proms.length > 0) groups.set(topic, proms);
    });
    return groups;
  }, [filteredProblems]);

  if (isLoading) {
    return (
      <MainLayout>
        <DungeonLoader message="Loading Striver SDE Sheet..." />
      </MainLayout>
    );
  }

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
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-red-500 text-white shadow-sm">
                  <BookOpen size={13} /> Striver SDE Sheet
                </span>
                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                  isLight ? 'bg-white/80 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'
                }`}>
                  191 Curated SDE Problems
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight">
                Master the <span className="text-red-500">Striver SDE Sheet</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The gold-standard curated roadmap by Raj Vikramaditya (Striver) for cracking FAANG / Tier-1 Software Engineering Interviews.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-500">
                  <Layers size={13} /> {STRIVER_TOPICS.length} Core Modules
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Code2 size={13} /> {totalCount} Hand-Picked Questions
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                  <CheckCircle2 size={13} /> {solvedCount} Solved
                </span>
              </div>
            </div>

            {/* Progress Card */}
            <div className={`shrink-0 p-4 rounded-xl border flex flex-col items-center justify-center min-w-[170px] ${
              isLight ? 'bg-white/90 border-red-200 shadow-sm' : 'bg-black/40 border-white/10'
            }`}>
              <div className="text-2xl sm:text-3xl font-display font-bold text-red-500">
                {progressPct}%
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                {solvedCount} / {totalCount} Completed
              </div>
              <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2.5">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Search & Filters Bar ── */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
        }`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search problem title, pattern, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono transition-all border outline-none ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 focus:bg-white focus:border-red-500 text-slate-800'
                    : 'bg-black/40 border-white/10 focus:border-red-500/60 text-slate-200'
                }`}
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1 bg-black/[0.04] dark:bg-white/[0.05] p-1 rounded-xl shrink-0 overflow-x-auto">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedDifficulty === diff
                      ? isLight
                        ? 'bg-white text-black shadow-sm font-bold'
                        : 'bg-white/20 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <Filter size={11} /> Topic:
              </span>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-mono outline-none ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/40 border-white/10 text-slate-300'
                }`}
              >
                <option value="ALL">All Modules ({STRIVER_TOPICS.length})</option>
                {STRIVER_TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              {/* Toggle Bookmarks */}
              <button
                onClick={() => setShowOnlyBookmarks((b) => !b)}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-mono text-xs transition-all ${
                  showOnlyBookmarks
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-black'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark size={11} /> Starred ({bookmarkedIds.size})
              </button>

              {/* Toggle Unsolved */}
              <button
                onClick={() => setShowOnlyUnsolved((u) => !u)}
                className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 font-mono text-xs transition-all ${
                  showOnlyUnsolved
                    ? 'bg-red-500/15 border-red-500/40 text-red-500 font-bold'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-600 hover:text-black'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Circle size={11} /> Unsolved Only
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              >
                Expand All
              </button>
              <span className="text-slate-400">·</span>
              <button
                onClick={collapseAll}
                className="text-[11px] font-mono text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>

        {/* ── Topic Groups List ── */}
        <div className="space-y-4">
          {Array.from(groupedByTopic.entries()).map(([topic, problems]) => {
            const isExpanded = expandedTopics.has(topic);
            const groupSolved = problems.filter(isProblemSolved).length;
            const groupTotal = problems.length;
            const groupPct = Math.round((groupSolved / groupTotal) * 100) || 0;

            return (
              <div
                key={topic}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isLight ? 'bg-white border-black/[0.08] shadow-sm' : 'bg-[#1c1c1e] border-white/[0.08]'
                }`}
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleTopic(topic)}
                  className={`w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-1.5 rounded-lg border text-red-500 ${
                      isLight ? 'bg-red-50 border-red-200' : 'bg-red-950/40 border-red-500/30'
                    }`}>
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
                      className="border-t border-black/[0.04] dark:border-white/[0.06] divide-y divide-black/[0.04] dark:divide-white/[0.06]"
                    >
                      {problems.map((prob) => {
                        const solved = isProblemSolved(prob);
                        const bookmarked = bookmarkedIds.has(prob.id);
                        const diffKey = prob.difficulty.toLowerCase();

                        return (
                          <div
                            key={prob.id}
                            className={`px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                              solved
                                ? isLight ? 'bg-emerald-50/40' : 'bg-emerald-950/10'
                                : isLight ? 'hover:bg-slate-50/70' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* Checkbox */}
                              <button
                                onClick={() => toggleSolved(prob.id)}
                                className={`shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                  solved
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : isLight
                                    ? 'border-slate-300 hover:border-emerald-500 bg-white'
                                    : 'border-white/20 hover:border-emerald-500 bg-black/30'
                                }`}
                                title={solved ? 'Mark as unsolved' : 'Mark as solved'}
                              >
                                {solved && <Check size={12} strokeWidth={3} />}
                              </button>

                              {/* Bookmark star */}
                              <button
                                onClick={() => toggleBookmark(prob.id)}
                                className={`shrink-0 transition-colors ${
                                  bookmarked ? 'text-amber-500' : 'text-slate-300 dark:text-white/20 hover:text-amber-400'
                                }`}
                                title={bookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                              >
                                <Star size={14} fill={bookmarked ? 'currentColor' : 'none'} />
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-xs sm:text-sm font-medium ${
                                    solved
                                      ? 'text-slate-500 dark:text-slate-400 line-through'
                                      : isLight ? 'text-slate-900' : 'text-slate-100'
                                  }`}>
                                    {prob.title}
                                  </span>

                                  {prob.doorNumber && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold">
                                      <DoorOpen size={10} /> Door {prob.doorNumber}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-400">
                                  <span className="italic">{prob.pattern}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions & Badges */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border capitalize font-semibold ${
                                difficultyColors[diffKey] || difficultyColors.medium
                              }`}>
                                {prob.difficulty}
                              </span>

                              {prob.doorNumber ? (
                                <button
                                  onClick={() => navigate(`/door/${prob.doorNumber}`)}
                                  className="text-xs px-2.5 py-1 rounded-lg font-mono font-semibold bg-[#ff9500] hover:bg-amber-400 text-black transition-all flex items-center gap-1 shadow-sm"
                                  title="Solve inside DSA Dungeon Editor"
                                >
                                  <span>Solve Door {prob.doorNumber}</span>
                                  <ArrowRight size={12} />
                                </button>
                              ) : (
                                <a
                                  href={prob.leetcode}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-xs px-2.5 py-1 rounded-lg font-mono border transition-all flex items-center gap-1 ${
                                    isLight
                                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                                  }`}
                                  title="Open problem on LeetCode / External Practice"
                                >
                                  <span>Practice</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </MainLayout>
  );
}
