import { Link, useNavigate } from 'react-router-dom';
import { DoorOpen, Flame, LogOut, Zap, Sun, Moon, Sparkles } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated(),
  }));
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const isLight = theme === 'light';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl transition-all duration-300 ${
      isLight
        ? 'bg-white/82 border-b border-black/[0.08]'
        : 'bg-black/80 border-b border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

        {/* ── Left: Logo + Creator badge ── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link to="/" className={`flex items-center gap-1.5 sm:gap-2 font-display shrink-0 ${
            isLight ? 'text-[#1d1d1f]' : 'text-white'
          }`}>
            <DoorOpen
              size={20}
              className={`shrink-0 ${
                isLight ? 'text-[#ff9500]' : 'text-[#ff9500]'
              }`}
            />
            <span className="text-sm sm:text-lg tracking-wide whitespace-nowrap font-semibold">
              <span className="hidden sm:inline">DSA 100 DOORS</span>
              <span className="inline sm:hidden">D100D</span>
            </span>
          </Link>

          <div className={`hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] border ${
            isLight
              ? 'bg-[#ff9500]/8 border-[#ff9500]/20 text-[#bf5f00]'
              : 'bg-white/5 border-white/10 text-white/60'
          }`}>
            <Sparkles size={11} className="text-[#ff9500]" />
            <span>by <strong className="text-[#ff9500]">Avneesh</strong></span>
          </div>
        </div>

        {/* ── Right: Theme + Auth ── */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm min-w-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl border transition-all shrink-0 ${
              isLight
                ? 'bg-black/[0.04] border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.08]'
                : 'bg-white/[0.06] border-white/[0.08] text-[#ff9500] hover:bg-white/[0.1]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {isAuthenticated && user && (
            <>
              {/* XP */}
              <div className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full border font-mono text-xs ${
                isLight
                  ? 'bg-[#ff9500]/8 border-[#ff9500]/20 text-[#bf5f00]'
                  : 'bg-white/[0.06] border-white/[0.08] text-[#ffcc00]'
              }`}>
                <Zap size={13} />
                <span className="font-semibold">{user.xp}</span>
              </div>

              {/* Level */}
              <div className={`hidden md:flex items-center px-2.5 py-1 rounded-full border whitespace-nowrap font-mono text-xs ${
                isLight
                  ? 'bg-black/[0.04] border-black/[0.08] text-[#1d1d1f]'
                  : 'bg-white/[0.06] border-white/[0.08] text-white/80'
              }`}>
                Lv. {user.level}
              </div>

              {/* Streak */}
              <div className={`flex items-center gap-1 shrink-0 ${
                isLight ? 'text-[#ff3b30]' : 'text-[#ff9500]'
              }`} title={`${user.streak || 0}-day streak`}>
                <Flame size={15} />
                {user.streak || 0}
              </div>

              {/* Username */}
              <span className={`hidden sm:inline truncate max-w-[8rem] font-medium ${
                isLight ? 'text-[#1d1d1f]' : 'text-white/70'
              }`}>{user.name}</span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1 transition-colors shrink-0 ${
                  isLight
                    ? 'text-[#86868b] hover:text-[#ff3b30]'
                    : 'text-white/30 hover:text-[#ff3b30]'
                }`}
                aria-label="Log out"
              >
                <LogOut size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
