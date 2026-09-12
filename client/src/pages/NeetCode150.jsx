import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, CheckCircle2, Circle, Search, ArrowRight, ExternalLink,
  ChevronDown, ChevronUp, Trophy, Sparkles, Filter, BookOpen, Layers,
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
  const [expandedTracks, setExpandedTracks] = useState(() => new Set(NEETCODE_TRACKS));

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

  const solvedNeetCodeCount = useMemo(() => {
    return NEETCODE_150_PROBLEMS.filter((p) => p.doorNumber && completedDoorNums.has(p.doorNumber)).length;
  }, [completedDoorNums]);

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

  // Filter problems
  const filteredProblems = useMemo(() => {
    return NEETCODE_150_PROBLEMS.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.track.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty.toUpperCase() === selectedDifficulty;
      const matchesTrack = selectedTrack === 'ALL' || p.track === selectedTrack;
      return matchesSearch && matchesDiff && matchesTrack;
    });
  }, [searchQuery, selectedDifficulty, selectedTrack]);

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
                The definitive blind 150 coding interview guide, categorized by foundational pattern. All problems are integrated directly with playable dungeon doors!
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

          {/* Difficulty and Track Filters */}
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

        {/* ── Track Accordions & Problem Tables ── */}
        {groupedByTrack.size === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 font-mono text-xs">
            No problems found matching &quot;{searchQuery}&quot;. Try adjusting your search query or filters.
          </div>
        ) : (
          <div className="space-y-4">
            {Array.from(groupedByTrack.entries()).map(([track, problems]) => {
              const isExpanded = expandedTracks.has(track);
              const trackSolvedCount = problems.filter((p) => p.doorNumber && completedDoorNums.has(p.doorNumber)).length;

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
                        <h3 className="font-display text-sm font-bold">{track}</h3>
                        <p className="text-[11px] font-mono text-slate-400">
                          {problems.length} Problems · {trackSolvedCount} Solved
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {Math.round((trackSolvedCount / problems.length) * 100)}%
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </button>

                  {/* Problems List */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="divide-y divide-black/5 dark:divide-white/5"
                      >
                        {problems.map((p) => {
                          const isSolved = p.doorNumber && completedDoorNums.has(p.doorNumber);
                          const diffKey = p.difficulty.toLowerCase();

                          return (
                            <div
                              key={p.id}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 gap-3 transition-colors ${
                                isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                  {isSolved ? (
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                  ) : (
                                    <Circle size={18} className="text-slate-400 dark:text-slate-600" />
                                  )}
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold font-display">{p.title}</span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border capitalize font-medium ${difficultyColors[diffKey] || difficultyColors.medium}`}>
                                      {p.difficulty}
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    Pattern: <strong className={isLight ? 'text-slate-600' : 'text-slate-300'}>{p.pattern}</strong>
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                {p.doorNumber && (
                                  <button
                                    onClick={() => navigate(`/door/${p.doorNumber}`)}
                                    className="px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold text-black bg-[#ff9500] hover:brightness-110 shadow-sm transition-all flex items-center gap-1 group"
                                  >
                                    <span>Door {p.doorNumber}</span>
                                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                  </button>
                                )}
                                <a
                                  href={p.leetcodeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-1.5 rounded-xl border text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors ${
                                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
                                  }`}
                                  title="View on LeetCode"
                                >
                                  <ExternalLink size={14} />
                                </a>
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
        )}
      </div>
    </MainLayout>
  );
}
