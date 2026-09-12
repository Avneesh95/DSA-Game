import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, Circle, Search, ArrowRight, ExternalLink,
  Star, Trophy, Filter, ShoppingBag, Shield, Compass,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { AMAZON_CATEGORIES, AMAZON_150_PROBLEMS } from '../data/amazon150Data';
import { doorApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import DungeonLoader from '../components/DungeonLoader';

export default function Amazon150() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [doors, setDoors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Focus Areas');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    const fetchDoors = async () => {
      try {
        const { data } = await doorApi.getAll();
        if (isMounted) setDoors(data.doors || []);
      } catch (err) {
        console.error('Failed to load door states for Amazon 150:', err);
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

  const solvedAmazonCount = useMemo(() => {
    return AMAZON_150_PROBLEMS.filter((p) => p.doorNumber && completedDoorNums.has(p.doorNumber)).length;
  }, [completedDoorNums]);

  const totalProblems = AMAZON_150_PROBLEMS.length;
  const progressPct = Math.round((solvedAmazonCount / totalProblems) * 100) || 0;

  // Filter problems
  const filteredProblems = useMemo(() => {
    return AMAZON_150_PROBLEMS.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDiff = selectedDifficulty === 'ALL' || p.difficulty.toUpperCase() === selectedDifficulty;
      const matchesCat = selectedCategory === 'All Focus Areas' || p.category === selectedCategory;
      return matchesSearch && matchesDiff && matchesCat;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  if (isLoading) {
    return (
      <MainLayout>
        <DungeonLoader message="Loading Amazon Top 150 interview questions..." />
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
                The most frequently tested coding questions in Amazon SDE I, SDE II, and Senior SDE loops. Ranked by interview frequency and mapped directly to playable doors!
              </p>
            </div>

            {/* Progress Card */}
            <div className={`p-4 rounded-2xl border min-w-[240px] ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Amazon Mastery</span>
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
                <span className="text-emerald-500 font-semibold">{solvedAmazonCount} Mastered</span>
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

        {/* ── Questions Table ── */}
        <div className={`rounded-3xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
        }`}>
          <div className={`px-5 py-3 border-b flex items-center justify-between text-xs font-mono text-slate-400 ${
            isLight ? 'bg-slate-50' : 'bg-white/[0.02]'
          }`}>
            <span>Showing {filteredProblems.length} Amazon Interview Questions</span>
            <span>Frequency Rating</span>
          </div>

          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-xs">
              No questions found matching &quot;{searchQuery}&quot;. Try adjusting your filters.
            </div>
          ) : (
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {filteredProblems.map((p) => {
                const isSolved = p.doorNumber && completedDoorNums.has(p.doorNumber);
                const diffKey = p.difficulty.toLowerCase();

                return (
                  <div
                    key={p.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 gap-3 transition-colors ${
                      isLight ? 'hover:bg-slate-50' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Left details */}
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {isSolved ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : (
                          <Circle size={18} className="text-slate-400 dark:text-slate-600" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold font-display">{p.title}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border capitalize font-medium ${difficultyColors[diffKey] || difficultyColors.medium}`}>
                            {p.difficulty}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-mono text-[#ff9500] font-medium mr-1">
                            {p.category}
                          </span>
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/5 text-slate-400'
                              }`}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right action & stars */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Frequency Stars */}
                      <div className="flex items-center gap-0.5" title={`Interview Frequency: ${p.frequency}/5`}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < p.frequency ? 'fill-[#ff9500] text-[#ff9500]' : 'text-slate-300 dark:text-slate-700'}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {p.doorNumber && (
                          <button
                            onClick={() => navigate(`/door/${p.doorNumber}`)}
                            className="px-3 py-1.5 rounded-xl font-mono text-xs font-semibold text-black bg-[#ff9500] hover:brightness-110 shadow-sm transition-all flex items-center gap-1 group"
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
