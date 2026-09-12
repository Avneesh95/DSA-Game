import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User as UserIcon, Flame, Zap, Trophy, Shield, CheckCircle2,
  Lock, ArrowRight, ArrowLeft, Clock, Calendar, Sparkles, BookOpen,
  Award, TrendingUp, Filter, Home,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { doorApi, progressApi } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import DungeonLoader from '../components/DungeonLoader';

const RANK_TIERS = [
  { name: 'Bronze Initiate', minXp: 0, color: 'from-amber-700 to-amber-900', badge: '🥉' },
  { name: 'Silver Adventurer', minXp: 500, color: 'from-slate-400 to-slate-600', badge: '🥈' },
  { name: 'Gold Knight', minXp: 1500, color: 'from-yellow-400 to-amber-600', badge: '🥇' },
  { name: 'Platinum Warlock', minXp: 3500, color: 'from-cyan-400 to-blue-600', badge: '💎' },
  { name: 'Diamond Grandmaster', minXp: 7000, color: 'from-violet-400 to-purple-600', badge: '👑' },
  { name: 'Celestial Legend', minXp: 12000, color: 'from-[#ff9500] to-rose-500', badge: '🌟' },
];

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isLight = useThemeStore((state) => state.theme) === 'light';

  const [doors, setDoors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopicFilter, setSelectedTopicFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const { data } = await doorApi.getAll();
        if (isMounted) setDoors(data.doors || []);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Compute stats
  const completedDoors = useMemo(() => doors.filter((d) => d.status === 'COMPLETED'), [doors]);
  const completedCount = completedDoors.length;
  const totalDoors = doors.length || 100;
  const completionPercentage = Math.round((completedCount / totalDoors) * 100) || 0;

  // Determine Rank Tier
  const currentXp = user?.xp || 0;
  const currentTier = useMemo(() => {
    let tier = RANK_TIERS[0];
    for (const t of RANK_TIERS) {
      if (currentXp >= t.minXp) tier = t;
    }
    return tier;
  }, [currentXp]);

  const nextTier = useMemo(() => {
    return RANK_TIERS.find((t) => t.minXp > currentXp) || null;
  }, [currentXp]);

  // Difficulty counts
  const diffStats = useMemo(() => {
    const stats = {
      easy: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      hard: { total: 0, completed: 0 },
    };
    doors.forEach((d) => {
      const diff = (d.difficulty || 'medium').toLowerCase();
      if (stats[diff]) {
        stats[diff].total++;
        if (d.status === 'COMPLETED') stats[diff].completed++;
      }
    });
    return stats;
  }, [doors]);

  // World / Topic mastery breakdown
  const worldStats = useMemo(() => {
    const map = new Map();
    doors.forEach((d) => {
      const world = d.world || 'Dungeon Realm';
      if (!map.has(world)) {
        map.set(world, { name: world, total: 0, completed: 0 });
      }
      const entry = map.get(world);
      entry.total++;
      if (d.status === 'COMPLETED') entry.completed++;
    });
    return Array.from(map.values());
  }, [doors]);

  // Filtered completed doors
  const filteredCompleted = useMemo(() => {
    if (selectedTopicFilter === 'ALL') return completedDoors;
    return completedDoors.filter((d) => d.topic === selectedTopicFilter || d.world === selectedTopicFilter);
  }, [completedDoors, selectedTopicFilter]);

  const allTopics = useMemo(() => {
    const set = new Set();
    completedDoors.forEach((d) => {
      if (d.topic) set.add(d.topic);
    });
    return ['ALL', ...Array.from(set)];
  }, [completedDoors]);

  if (isLoading) {
    return (
      <MainLayout>
        <DungeonLoader message="Loading your hero stats..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* ── Navigation Top Bar ── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <ArrowLeft size={14} /> Back to Dungeon Map
          </button>

          <span className="text-xs font-mono text-slate-400">
            Player Profile & Stats
          </span>
        </div>

        {/* ── User Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition-all ${
            isLight
              ? 'bg-gradient-to-r from-orange-50/80 via-white to-amber-50/60 border-slate-200 shadow-sm'
              : 'bg-gradient-to-r from-[#241a10] via-[#1c1c1e] to-[#161618] border-white/10 shadow-2xl'
          }`}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9500]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar & Identity */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#ff9500] to-violet-500 p-0.5 shadow-lg shadow-[#ff9500]/20">
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-display text-3xl font-bold ${
                    isLight ? 'bg-white text-slate-900' : 'bg-black text-white'
                  }`}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={32} />}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#ff9500] text-black shadow-md">
                  Lv. {user?.level || 1}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="font-display text-xl sm:text-2xl font-bold">
                    {user?.name || 'Adventurer'}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    isLight ? 'bg-amber-100/80 border-amber-300 text-amber-900' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  }`}>
                    {currentTier.badge} {currentTier.name}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mb-3">
                  {user?.email || 'player@dsa100doors.dev'}
                </p>

                {/* Level XP Bar */}
                <div className="w-full sm:w-72 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{currentXp} XP</span>
                    <span>{nextTier ? `${nextTier.minXp} XP for ${nextTier.name}` : 'Max Tier'}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff9500] to-amber-400 rounded-full transition-all duration-500"
                      style={{
                        width: nextTier
                          ? `${Math.min(100, Math.round(((currentXp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100))}%`
                          : '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Highlight Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className={`p-3.5 rounded-2xl border text-center ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-center text-[#ff9500] mb-1">
                  <Flame size={20} />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold">{user?.streak || 0} Days</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Streak</div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-center ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-center text-emerald-500 mb-1">
                  <CheckCircle2 size={20} />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold">{completedCount} / {totalDoors}</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Doors Solved</div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-center col-span-2 sm:col-span-1 ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'
              }`}>
                <div className="flex items-center justify-center text-violet-500 mb-1">
                  <Zap size={20} />
                </div>
                <div className="font-display text-lg sm:text-xl font-bold">{currentXp}</div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total XP</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Middle 2-Column: Difficulty + Topic Mastery ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Breakdown */}
          <div className={`rounded-3xl border p-6 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
          }`}>
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
              <Shield size={18} className="text-[#ff9500]" /> Difficulty Distribution
            </h3>

            <div className="space-y-4">
              {/* Easy */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-emerald-500">Easy</span>
                  <span className="text-slate-400">
                    {diffStats.easy.completed} / {diffStats.easy.total} ({diffStats.easy.total ? Math.round((diffStats.easy.completed / diffStats.easy.total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${diffStats.easy.total ? (diffStats.easy.completed / diffStats.easy.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Medium */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-amber-500">Medium</span>
                  <span className="text-slate-400">
                    {diffStats.medium.completed} / {diffStats.medium.total} ({diffStats.medium.total ? Math.round((diffStats.medium.completed / diffStats.medium.total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${diffStats.medium.total ? (diffStats.medium.completed / diffStats.medium.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Hard */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="font-bold text-rose-500">Hard</span>
                  <span className="text-slate-400">
                    {diffStats.hard.completed} / {diffStats.hard.total} ({diffStats.hard.total ? Math.round((diffStats.hard.completed / diffStats.hard.total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${diffStats.hard.total ? (diffStats.hard.completed / diffStats.hard.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* World Mastery */}
          <div className={`rounded-3xl border p-6 ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
          }`}>
            <h3 className="font-display text-base font-bold mb-4 flex items-center gap-2">
              <Trophy size={18} className="text-glow-purple" /> Dungeon World Mastery
            </h3>

            <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
              {worldStats.map((w) => {
                const pct = w.total ? Math.round((w.completed / w.total) * 100) : 0;
                return (
                  <div key={w.name}>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-medium truncate max-w-[14rem]">{w.name}</span>
                      <span className="text-slate-400 shrink-0">
                        {w.completed}/{w.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-[#ff9500] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Solved Doors History Section ── */}
        <div className={`rounded-3xl border p-6 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#1c1c1e] border-white/10'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="font-display text-base font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-emerald-500" /> Solved Doors Collection
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and practice any of your {completedCount} solved algorithm doors
              </p>
            </div>

            {/* Filter pills */}
            {allTopics.length > 2 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {allTopics.slice(0, 6).map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopicFilter(topic)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-medium transition-all shrink-0 ${
                      selectedTopicFilter === topic
                        ? 'bg-[#ff9500] text-black font-bold'
                        : isLight
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filteredCompleted.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs font-mono">
              <Lock size={28} className="mx-auto mb-2 text-slate-500" />
              No doors solved in this category yet. Unlock doors on the map to build your collection!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCompleted.map((d) => (
                <div
                  key={d._id || d.doorNumber}
                  onClick={() => navigate(`/door/${d.doorNumber}`)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 group flex flex-col justify-between ${
                    isLight
                      ? 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-[#ff9500]/50 hover:shadow-md'
                      : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-[#ff9500]/50 hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#ff9500] font-bold">Door {d.doorNumber}</span>
                      <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                        <CheckCircle2 size={12} /> Solved
                      </span>
                    </div>

                    <h4 className="font-display text-sm font-semibold group-hover:text-[#ff9500] transition-colors line-clamp-1">
                      {d.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span>{d.world}</span>
                      <span>·</span>
                      <span className="capitalize">{d.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-black/5 dark:border-white/5 text-slate-400 group-hover:text-[#ff9500] transition-colors">
                    <span className="text-[11px] font-mono">+{d.xp || 50} XP</span>
                    <span className="flex items-center gap-1 font-medium">
                      Practice <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
