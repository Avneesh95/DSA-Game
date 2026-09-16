import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, CheckCircle2, Circle, Search, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Trophy, Sparkles, Filter, BookOpen, Layers,
  Star, Check, DoorOpen, ListFilter,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { NEETCODE_TRACKS, NEETCODE_150_PROBLEMS } from '../data/neetcode150Data';
import { doorApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import DungeonLoader from '../components/DungeonLoader';

export default function NeetCode150() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [doors, setDoors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTrack, setSelectedTrack] = useState('ALL');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);
  const [showOnlyUnsolved, setShowOnlyUnsolved] = useState(false);
  const [expandedTracks, setExpandedTracks] = useState(() => new Set(NEETCODE_TRACKS.slice(0, 6)));

  // Persistent bookmarks and custom solved state
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_neetcode_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  const [customSolvedIds, setCustomSolvedIds] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('dsa100_neetcode_solved') || '[]'));
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
        console.error('Failed to load door states for NeetCode 150:', err);
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

  const isProblemSolved = (p) => {
    if (p.doorNumber && completedDoorNums.has(p.doorNumber)) return true;
    return customSolvedIds.has(p.id);
  };

  const toggleSolved = (pId) => {
    setCustomSolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      localStorage.setItem('dsa100_neetcode_solved', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleBookmark = (pId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(pId)) next.delete(pId);
      else next.add(pId);
      localStorage.setItem('dsa100_neetcode_bookmarks', JSON.stringify([...next]));
      return next;
    });
  };

  const solvedNeetCodeCount = useMemo(() => {
    return NEETCODE_150_PROBLEMS.filter(isProblemSolved).length;
  }, [completedDoorNums, customSolvedIds]);

  const totalProblems = NEETCODE_150_PROBLEMS.length;
  const progressPct = Math.round((solvedNeetCodeCount / totalProblems) * 100) || 0;

  // Toggle track accordion
  const toggleTrack = (track) => {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(track)) next.delete(track);
      else next.add(track);
      return next;
    });
  };

  const expandAll = () => setExpandedTracks(new Set(NEETCODE_TRACKS));
  const collapseAll = () => setExpandedTracks(new Set());

  // Filter problems
  const filteredProblems = useMemo(() => {
    return NEETCODE_150_PROBLEMS.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.pattern.toLowerCase().includes(q) ||
        p.track.toLowerCase().includes(q);
      const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty.toUpperCase() === selectedDifficulty;
      const matchesTrack = selectedTrack === 'ALL' || p.track === selectedTrack;
      const matchesBookmark = !showOnlyBookmarks || bookmarkedIds.has(p.id);
      const matchesSolved = !showOnlyUnsolved || !isProblemSolved(p);
      return matchesSearch && matchesDiff && matchesTrack && matchesBookmark && matchesSolved;
    });
  }, [searchQuery, selectedDifficulty, selectedTrack, showOnlyBookmarks, showOnlyUnsolved, bookmarkedIds, customSolvedIds, completedDoorNums]);

  // Group filtered problems by track
  const groupedByTrack = useMemo(() => {
    const groups = new Map();
    NEETCODE_TRACKS.forEach((track) => {
      const proms = filteredProblems.filter((p) => p.track === track);
      if (proms.length > 0) groups.set(track, proms);
    });
    return groups;
  }, [filteredProblems]);

  if (isLoading) {
    return (
      <MainLayout>
        <DungeonLoader message="Loading NeetCode 150 roadmap..." />
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
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* ── Header Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
            isLight
              ? 'bg-gradient-to-r from-violet-50 via-white to-orange-50/60 border-slate-200 shadow-sm'
              : 'bg-gradient-to-r from-[#1e1528] via-[#1c1c1e] to-[#121214] border-white/10 shadow-2xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-violet-600 text-white shadow-sm">
                  <Zap size={13} /> NEETCODE 150
                </span>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                  isLight ? 'bg-white/80 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  18 Tracks · 150 Problems
                </span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-bold">
                NeetCode 150 Algorithm Roadmap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                The definitive blind 150 coding interview guide, organized into interactive cards with instant solution doors, checkboxes, and pattern tags.
              </p>
            </div>

            {/* Progress Card */}
            <div className={`p-4 rounded-2xl border min-w-[240px] ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Your Progress</span>
                <span className="text-violet-500 font-bold">{solvedNeetCodeCount} / {totalProblems} ({progressPct}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-[#ff9500] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>18 Patterns</span>
                <span className="text-emerald-500 font-semibold">{solvedNeetCodeCount} Cleared</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Search & Filter Controls ── */}
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
                    ? 'bg-violet-600 text-white border-violet-600 font-bold shadow-sm'
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
              Showing {filteredProblems.length} of {totalProblems} problems
            </span>
          </div>

          {/* Search + Difficulty Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search problem, pattern, or track..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/30 ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    : 'bg-[#1c1c1e] border-white/10 text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>

            {/* Difficulty Filters */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 self-start sm:self-auto">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-mono font-medium transition-all shrink-0 border ${
                    selectedDifficulty === diff
                      ? 'bg-violet-600 border-violet-600 text-white font-bold shadow-sm'
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

        {/* ── Track Accordions & Problem Cards Grid ── */}
        {groupedByTrack.size === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 font-mono text-xs">
            No problems found matching &quot;{searchQuery}&quot;. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(groupedByTrack.entries()).map(([track, problems]) => {
              const isExpanded = expandedTracks.has(track);
              const trackSolvedCount = problems.filter(isProblemSolved).length;
              const trackPct = Math.round((trackSolvedCount / problems.length) * 100) || 0;

              return (
                <div
                  key={track}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
                  }`}
                >
                  {/* Track Header */}
                  <button
                    onClick={() => toggleTrack(track)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left border-b transition-colors ${
                      isLight
                        ? 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-500 flex items-center justify-center font-bold text-xs">
                        <Layers size={15} />
                      </div>
                      <div>
                        <h3 className="font-display text-sm font-bold flex items-center gap-2">
                          <span>{track}</span>
                          <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border font-normal ${
                            isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                          }`}>
                            {problems.length} problems
                          </span>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Track Progress Bar */}
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-24 bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-violet-500 h-full rounded-full transition-all"
                            style={{ width: `${trackPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {trackSolvedCount}/{problems.length}
                        </span>
                      </div>

                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Responsive Problem Cards Grid */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 sm:p-5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {problems.map((p) => {
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
                                      ? 'bg-emerald-50/40 border-emerald-300/80 shadow-sm'
                                      : 'bg-emerald-950/20 border-emerald-500/30'
                                    : isLight
                                    ? 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm hover:shadow-md'
                                    : 'bg-[#151517] hover:bg-[#1a1a1d] border-white/10 hover:border-white/20 shadow-sm'
                                }`}
                              >
                                {solved && (
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                                )}

                                <div>
                                  {/* Top Row: Checkbox, Difficulty & Bookmark */}
                                  <div className="flex items-center justify-between gap-2 mb-2.5">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => toggleSolved(p.id)}
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
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

                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border capitalize font-semibold ${
                                        difficultyColors[diffKey] || difficultyColors.medium
                                      }`}>
                                        {p.difficulty}
                                      </span>
                                    </div>

                                    <button
                                      onClick={() => toggleBookmark(p.id)}
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

                                  {/* Problem Title */}
                                  <h4 className={`text-xs sm:text-sm font-semibold font-display mb-1.5 leading-snug line-clamp-2 ${
                                    solved
                                      ? 'text-slate-500 dark:text-slate-400 line-through'
                                      : isLight ? 'text-slate-900' : 'text-slate-100'
                                  }`}>
                                    {p.title}
                                  </h4>

                                  {/* Pattern Tag */}
                                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-medium ${
                                      isLight
                                        ? 'bg-violet-50 border-violet-200/80 text-violet-700'
                                        : 'bg-violet-950/30 border-violet-500/20 text-violet-300'
                                    }`}>
                                      {p.pattern}
                                    </span>
                                  </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/5 mt-auto">
                                  {p.doorNumber ? (
                                    <button
                                      onClick={() => navigate(`/door/${p.doorNumber}`)}
                                      className="flex-1 py-1.5 px-3 rounded-lg font-mono text-xs font-semibold text-black bg-[#ff9500] hover:brightness-110 shadow-sm transition-all flex items-center justify-center gap-1 group"
                                    >
                                      <DoorOpen size={12} />
                                      <span>Solve Door {p.doorNumber}</span>
                                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                  ) : (
                                    <a
                                      href={p.leetcodeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex-1 py-1.5 px-3 rounded-lg font-mono text-xs border text-center transition-colors flex items-center justify-center gap-1 ${
                                        isLight
                                          ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                                      }`}
                                    >
                                      <span>Practice</span>
                                      <ExternalLink size={11} />
                                    </a>
                                  )}

                                  <a
                                    href={p.leetcodeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-1.5 rounded-lg border transition-colors ${
                                      isLight
                                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-700'
                                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400 hover:text-white'
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
        )}
      </div>
    </MainLayout>
  );
}
